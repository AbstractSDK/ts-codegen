import * as t from '@babel/types';
import { ExportNamedDeclaration } from '@babel/types';
import { camel, pascal } from 'case';
import {
  abstractClassDeclaration,
  arrowFunctionExpression,
  autoTypedObjectPattern,
  bindMethod,
  classDeclaration,
  classProperty,
  createExtractTypeAnnotation,
  getMessageProperties,
  getResponseType,
  identifier,
  promiseTypeAnnotation,
  shorthandProperty
} from '../utils';
import { ExecuteMsg, QueryMsg } from '../types';
import { createTypedObjectParams } from '../utils/types';
import { RenderContext } from '../context';
import { getWasmMethodArgs } from '../client/client';
import { createQueryOptionsFactory } from './query-options-factory';

const FUNDS_PARAM = identifier(
  '_funds',
  t.tsTypeAnnotation(t.tsArrayType(t.tsTypeReference(t.identifier('Coin')))),
  true
);

export const createAbstractAppClass = (
  context: RenderContext,
  className: string,
  msg: ExecuteMsg | QueryMsg
): t.ExportNamedDeclaration => {
  const staticMethods = getMessageProperties(msg).map((schema) => {
    return createStaticExecMethodMsgBuilder(context, schema, msg.title);
  });

  // const blockStmt = bindings;

  return t.exportNamedDeclaration(
    abstractClassDeclaration(
      className,
      staticMethods,
      [t.tSExpressionWithTypeArguments(t.identifier(`I${className}`))],
      null
    )
  );
};

export const createAbstractAppQueryFactory = (
  context: RenderContext,
  moduleName: string,
  msg: QueryMsg
): t.ExportNamedDeclaration => {
  return createQueryOptionsFactory(context, moduleName, msg, 'abstract-app');
};

const CLASS_VARS = {
  moduleId: t.identifier('moduleId'),
  _moduleAddress: t.identifier('_moduleAddress'),
  accountClient: t.identifier('accountClient'),
  accountQueryClient: t.identifier('accountQueryClient')
};

const ABSTRACT_ACCOUNT_CLIENT = 'AbstractAccountClient';
const ABSTRACT_CLIENT = 'AbstractClient';
const ABSTRACT_QUERY_CLIENT = 'AbstractQueryClient';
const ABSTRACT_ACCOUNT_QUERY_CLIENT = 'AbstractAccountQueryClient';

function extractCamelcasedQueryParams(jsonschema, underscoreName: string) {
  const queryParams = Object.keys(
    jsonschema.properties[underscoreName]?.properties ?? {}
  );

  // the actual type of the ref
  const methodParam = t.identifier('params');
  methodParam.typeAnnotation = createExtractTypeAnnotation(
    underscoreName,
    'QueryMsg'
  );

  const parameters = queryParams.length ? [methodParam] : [];
  return parameters;
}

/**
 * The address and connect methods in the interface.
 */
const staticQueryInterfaceMethods = (connectedAppClientName: string) => {
  return [
    t.tsPropertySignature(
      t.identifier('connect'),
      t.tsTypeAnnotation(
        t.tsFunctionType(
          undefined,
          // params
          [
            identifier(
              'signingClient',
              t.tsTypeAnnotation(
                t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
              )
            ),
            identifier('address', t.tsTypeAnnotation(t.tsStringKeyword()))
          ],
          // Return the connected app client
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(connectedAppClientName))
          )
        )
      )
    ),
    t.tsPropertySignature(
      t.identifier('address'),
      t.tsTypeAnnotation(
        t.tsFunctionType(
          undefined,
          [],
          // return
          promiseTypeAnnotation('string')
        )
      )
    )
  ];
};

// TODO: there might not be any execute methods, in which case we wouldn't need the connect method
export const createAppQueryInterface = (
  context: RenderContext,
  interfaceClassName: string,
  mutClassName: string,
  queryMsg: QueryMsg
) => {
  context.addUtils(['SigningCosmWasmClient', ABSTRACT_QUERY_CLIENT]);

  const methods = getMessageProperties(queryMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);
    const parameters = extractCamelcasedQueryParams(jsonschema, underscoreName);

    const func = {
      type: 'TSFunctionType',
      typeAnnotation: promiseTypeAnnotation(responseType),
      parameters
    };

    return t.tSPropertySignature(
      t.identifier(methodName),
      // @ts-ignore
      t.tsTypeAnnotation(func)
    );
  });

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(interfaceClassName),
      null,
      [],
      t.tSInterfaceBody([
        t.tSPropertySignature(
          CLASS_VARS.moduleId,
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),
        t.tSPropertySignature(
          CLASS_VARS.accountQueryClient,
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT))
          )
        ),
        t.tSPropertySignature(
          CLASS_VARS._moduleAddress,
          t.tsTypeAnnotation(t.tsStringKeyword())
        ),
        ...methods,
        ...staticQueryInterfaceMethods(mutClassName)
      ])
    )
  );
};

// TODO: private
const QUERY_APP_FN = t.classProperty(
  t.identifier('_query'),
  arrowFunctionExpression(
    [
      identifier(
        'queryMsg',
        t.tsTypeAnnotation(t.tsTypeReference(t.identifier('QueryMsg')))
      )
    ],
    t.blockStatement(
      [
        t.returnStatement(
          t.callExpression(
            t.memberExpression(
              t.memberExpression(
                t.thisExpression(),
                CLASS_VARS.accountQueryClient
              ),
              t.identifier('queryModule')
            ),
            [
              t.objectExpression([
                t.objectProperty(
                  t.identifier('moduleId'),
                  t.memberExpression(t.thisExpression(), CLASS_VARS.moduleId)
                ),
                t.objectProperty(
                  t.identifier('moduleType'),
                  t.stringLiteral('app')
                ),
                shorthandProperty('queryMsg')
              ])
            ]
          )
        )
      ],
      []
    ),
    // TODO: better than any
    promiseTypeAnnotation('any'),
    true
  )
);

export const createAppExecuteInterface = (
  context: RenderContext,
  interfaceClassName: string,
  mutClassName: string,
  extendsClassName,
  executeMsg: ExecuteMsg
): t.ExportNamedDeclaration => {
  context.addUtils([
    'SigningCosmWasmClient',
    ABSTRACT_ACCOUNT_CLIENT,
    'MsgExecuteContractEncodeObject',
    'AppExecuteMsg',
    'AppModuleExecuteMsgBuilder',
    'MsgExecuteContract',
    'toUtf8'
  ]);

  const methods = getMessageProperties(executeMsg).map((jsonschema) => {
    const underscoreName = Object.keys(jsonschema.properties)[0];
    const methodName = camel(underscoreName);
    const responseType = getResponseType(context, underscoreName);
    const parameters = extractCamelcasedQueryParams(jsonschema, underscoreName);

    const func = {
      type: 'TSFunctionType',
      typeAnnotation: promiseTypeAnnotation(responseType),
      parameters: parameters ? [...parameters, FUNDS_PARAM] : [FUNDS_PARAM]
    };

    return t.tSPropertySignature(
      t.identifier(methodName),
      // @ts-ignore
      t.tsTypeAnnotation(func)
    );
  });

  const extendsDeclaration = extendsClassName
    ? [t.tSExpressionWithTypeArguments(t.identifier(extendsClassName))]
    : [];

  return t.exportNamedDeclaration(
    t.tsInterfaceDeclaration(
      t.identifier(interfaceClassName),
      null,
      extendsDeclaration,
      t.tSInterfaceBody([
        t.tSPropertySignature(
          CLASS_VARS.accountClient,
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_CLIENT))
          )
        ),
        ...methods
      ])
    )
  );
};

const COMPOSE_MSG_FN = t.classProperty(
  t.identifier('_composeMsg'),
  arrowFunctionExpression(
    [
      identifier(
        'msg',
        t.tsTypeAnnotation(t.tsTypeReference(t.identifier('ExecuteMsg')))
      ),
      FUNDS_PARAM
    ],
    t.blockStatement(
      [
        t.variableDeclaration('const', [
          t.variableDeclarator(
            identifier(
              'moduleMsg',
              t.tsTypeAnnotation(
                t.tSTypeReference(
                  t.identifier('AppExecuteMsg'),
                  t.tsTypeParameterInstantiation([
                    t.tsTypeReference(t.identifier('ExecuteMsg'))
                  ])
                )
              )
            ),
            t.callExpression(
              t.memberExpression(
                t.identifier('AppModuleExecuteMsgBuilder'),
                t.identifier('executeApp')
              ),
              [t.identifier('msg')]
            )
          )
        ]),
        t.returnStatement(
          t.objectExpression([
            t.objectProperty(
              t.identifier('typeUrl'),
              t.stringLiteral('/cosmwasm.wasm.v1.MsgExecuteContract')
            ),
            t.objectProperty(
              t.identifier('value'),
              t.callExpression(
                t.memberExpression(
                  t.identifier('MsgExecuteContract'),
                  t.identifier('fromPartial')
                ),
                [
                  t.objectExpression([
                    t.objectProperty(
                      t.identifier('sender'),
                      t.memberExpression(
                        t.memberExpression(
                          t.thisExpression(),
                          CLASS_VARS.accountClient
                        ),
                        t.identifier('sender')
                      )
                    ),
                    t.objectProperty(
                      t.identifier('contract'),
                      t.awaitExpression(
                        t.callExpression(
                          t.memberExpression(
                            t.thisExpression(),
                            t.identifier('address')
                          ),
                          []
                        )
                      )
                    ),
                    t.objectProperty(
                      t.identifier('msg'),
                      t.callExpression(t.identifier('toUtf8'), [
                        t.callExpression(
                          t.memberExpression(
                            t.identifier('JSON'),
                            t.identifier('stringify')
                          ),
                          [t.identifier('moduleMsg')]
                        )
                      ])
                    ),
                    t.objectProperty(
                      t.identifier('funds'),
                      t.identifier('_funds'),
                      false,
                      false
                    )
                  ])
                ]
              )
            )
          ])
        )
      ],
      []
    ),
    // return
    promiseTypeAnnotation('MsgExecuteContractEncodeObject'),
    // async
    true
  )
);

export const createAppQueryClass = (
  context: RenderContext,
  _moduleName: string,
  className: string,
  implementsClassName: string,
  queryMsg: QueryMsg
): t.ExportNamedDeclaration => {
  const moduleName = pascal(_moduleName);

  context.addUtils([ABSTRACT_QUERY_CLIENT, ABSTRACT_ACCOUNT_QUERY_CLIENT]);

  const propertyNames = getMessageProperties(queryMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(queryMsg).map((schema) => {
    return createAppQueryMethod(context, moduleName, schema);
  });

  methods.push(QUERY_APP_FN);
  methods.push(ADDRESS_ACCESSOR_FN);
  methods.push(connectMethod(`${moduleName}AppClient`));

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'accountQueryClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT))
          )
        ),

        // moduleId
        classProperty('moduleId', t.tsTypeAnnotation(t.tsStringKeyword())),

        // _moduleAddress
        {
          ...classProperty(
            '_moduleAddress',
            t.tsTypeAnnotation(t.tsStringKeyword())
          ),
          visibility: 'private'
        },

        // constructor
        t.classMethod(
          'constructor',
          t.identifier('constructor'),
          [
            autoTypedObjectPattern([
              shorthandProperty(
                'abstractQueryClient',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_QUERY_CLIENT))
                )
              ),
              shorthandProperty(
                'accountId',
                t.tsTypeAnnotation(t.tsNumberKeyword())
              ),
              shorthandProperty(
                'managerAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'proxyAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'moduleId',
                t.tsTypeAnnotation(t.tsStringKeyword())
              )
            ])
          ],
          t.blockStatement([
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  CLASS_VARS.accountQueryClient
                ),
                t.newExpression(t.identifier(ABSTRACT_ACCOUNT_QUERY_CLIENT), [
                  t.objectExpression([
                    t.objectProperty(
                      identifier('abstract'),
                      t.identifier('abstractQueryClient'),
                      false,
                      true
                    ),
                    shorthandProperty('accountId'),
                    shorthandProperty('managerAddress'),
                    shorthandProperty('proxyAddress')
                  ])
                ])
              )
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  t.identifier('moduleId')
                ),
                t.identifier('moduleId')
              )
            ),
            ...bindings
          ])
        ),

        ...methods
      ],
      [t.tSExpressionWithTypeArguments(t.identifier(implementsClassName))]
    )
  );
};

const ADDRESS_ACCESSOR_FN = t.classProperty(
  t.identifier('address'),
  arrowFunctionExpression(
    [],
    t.blockStatement([
      t.ifStatement(
        t.unaryExpression(
          '!',
          t.memberExpression(t.thisExpression(), CLASS_VARS._moduleAddress)
        ),
        t.blockStatement([
          t.expressionStatement(
            t.assignmentExpression(
              '=',
              t.memberExpression(t.thisExpression(), CLASS_VARS._moduleAddress),
              t.awaitExpression(
                t.callExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.thisExpression(),
                      CLASS_VARS.accountQueryClient
                    ),
                    t.identifier('getModuleAddress')
                  ),
                  [
                    t.memberExpression(
                      t.thisExpression(),
                      t.identifier('moduleId')
                    )
                  ]
                )
              )
            )
          )
        ])
      ),
      t.returnStatement(
        t.memberExpression(t.thisExpression(), CLASS_VARS._moduleAddress)
      )
    ]),

    t.tsTypeAnnotation(
      t.tsTypeReference(
        t.identifier('Promise'),
        t.tsTypeParameterInstantiation([t.tsStringKeyword()])
      )
    ),
    true
  )
);

//       t.tsTypeAnnotation(t.tsTypeReference(t.identifier('VaultManager'))),
//       false,
const connectMethod = (mutClientName: string) => {
  return t.classProperty(
    t.identifier('connect'),
    arrowFunctionExpression(
      [
        identifier(
          'signingClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier('SigningCosmWasmClient'))
          )
        ),
        identifier('address', t.tsTypeAnnotation(t.tsStringKeyword()))
      ],
      t.blockStatement([
        t.returnStatement(
          t.newExpression(t.identifier(mutClientName), [
            t.objectExpression([
              t.objectProperty(
                t.identifier('accountId'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('accountId')
                )
              ),
              t.objectProperty(
                t.identifier('managerAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('managerAddress')
                )
              ),
              t.objectProperty(
                t.identifier('proxyAddress'),
                t.memberExpression(
                  t.memberExpression(
                    t.thisExpression(),
                    CLASS_VARS.accountQueryClient
                  ),
                  t.identifier('proxyAddress')
                )
              ),
              t.objectProperty(
                t.identifier('moduleId'),
                t.memberExpression(t.thisExpression(), t.identifier('moduleId'))
              ),
              t.objectProperty(
                t.identifier('abstractClient'),
                t.callExpression(
                  t.memberExpression(
                    t.memberExpression(
                      t.memberExpression(
                        t.thisExpression(),
                        CLASS_VARS.accountQueryClient
                      ),
                      t.identifier('abstract')
                    ),
                    t.identifier('upgrade')
                  ),
                  [t.identifier('signingClient'), t.identifier('address')]
                )
              )
            ])
          ])
        )
      ]),
      t.tsTypeAnnotation(t.tsTypeReference(t.identifier(mutClientName)))
    )
  );
};

/*
  public pendingClaims = async (
    params: ExtractCamelizedParams<AutocompounderQueryMsg, 'pending_claims'>
  ): Promise<Uint128> => {
    return this._query(AutocompounderQueryMsgBuilder.pendingClaims(params))
  }
 */
const createAppQueryMethod = (
  context: RenderContext,
  moduleName: string,
  schema: any
) => {
  const underscoreName = Object.keys(schema.properties)[0];
  const methodName = camel(underscoreName);
  const responseType = getResponseType(context, underscoreName);

  const queryParams = Object.keys(
    schema.properties[underscoreName]?.properties ?? {}
  );

  // the actual type of the ref
  const methodParam = t.identifier('params');
  methodParam.typeAnnotation = createExtractTypeAnnotation(
    underscoreName,
    moduleName
  );

  const parameters = extractCamelcasedQueryParams(schema, underscoreName);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      parameters,
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier('_query')),
            [
              t.callExpression(
                t.memberExpression(
                  t.identifier(`${moduleName}QueryMsgBuilder`),
                  t.identifier(methodName)
                ),
                parameters
              )
            ]
          )
        )
      ]),
      promiseTypeAnnotation(responseType),
      true
    )
  );
};

export const createAppExecuteClass = (
  context: RenderContext,
  uncheckedModuleName: string,
  className: string,
  implementsClassName: string,
  extendsClassName: string,
  execMsg: ExecuteMsg
): ExportNamedDeclaration => {
  const moduleName = pascal(uncheckedModuleName);

  context.addUtils([
    ABSTRACT_ACCOUNT_CLIENT,
    'StdFee',
    'Coin',
    ABSTRACT_CLIENT
  ]);

  const propertyNames = getMessageProperties(execMsg)
    .map((method) => Object.keys(method.properties)?.[0])
    .filter(Boolean);

  const bindings = propertyNames.map(camel).map(bindMethod);

  const methods = getMessageProperties(execMsg).map((schema) => {
    return createAppExecMethod(context, moduleName, schema);
  });

  methods.push(COMPOSE_MSG_FN);

  return t.exportNamedDeclaration(
    classDeclaration(
      className,
      [
        // client
        classProperty(
          'accountClient',
          t.tsTypeAnnotation(
            t.tsTypeReference(t.identifier(ABSTRACT_ACCOUNT_CLIENT))
          )
        ),

        // constructor
        t.classMethod(
          'constructor',
          t.identifier('constructor'),
          // TODO: typing
          [
            autoTypedObjectPattern([
              shorthandProperty(
                'abstractClient',
                t.tsTypeAnnotation(
                  t.tsTypeReference(t.identifier(ABSTRACT_CLIENT))
                )
              ),
              shorthandProperty(
                'accountId',
                t.tsTypeAnnotation(t.tsNumberKeyword())
              ),
              shorthandProperty(
                'managerAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'proxyAddress',
                t.tsTypeAnnotation(t.tsStringKeyword())
              ),
              shorthandProperty(
                'moduleId',
                t.tsTypeAnnotation(t.tsStringKeyword())
              )
            ])
          ],
          t.blockStatement([
            t.expressionStatement(
              // TODO!
              t.callExpression(t.super(), [
                t.objectExpression([
                  t.objectProperty(
                    identifier('abstractQueryClient', undefined),
                    t.identifier('abstractClient'),
                    false,
                    true
                  ),
                  shorthandProperty('accountId'),
                  shorthandProperty('managerAddress'),
                  shorthandProperty('proxyAddress'),
                  shorthandProperty('moduleId')
                ])
              ])
            ),
            t.expressionStatement(
              t.assignmentExpression(
                '=',
                t.memberExpression(
                  t.thisExpression(),
                  CLASS_VARS.accountClient
                ),
                t.callExpression(
                  t.memberExpression(
                    t.identifier(ABSTRACT_ACCOUNT_CLIENT),
                    t.identifier('fromQueryClient')
                  ),
                  [
                    t.memberExpression(
                      t.thisExpression(),
                      CLASS_VARS.accountQueryClient
                    ),
                    t.identifier('abstractClient')
                  ]
                )
              )
            ),
            ...bindings
          ])
        ),

        ...methods
      ],
      [t.tSExpressionWithTypeArguments(t.identifier(implementsClassName))],
      extendsClassName ? t.identifier(extendsClassName) : null
    )
  );
};

/*
  deposit = async (
    params: ExtractCamelizedParams<AutocompounderExecuteMsg, 'deposit'>,
    _funds?: Coin[]
  ): Promise<MsgExecuteContractEncodeObject> => {
    return this._composeMsg(AutocompounderExecuteMsgBuilder.deposit(params), _funds)
  }
 */
const createAppExecMethod = (
  context: RenderContext,
  moduleName: string,
  schema: any
) => {
  const underscoreName = Object.keys(schema.properties)[0];
  const methodName = camel(underscoreName);

  const execParams = Object.keys(
    schema.properties[underscoreName]?.properties ?? {}
  );

  // the actual type of the ref
  const methodParam = t.identifier('params');
  methodParam.typeAnnotation = createExtractTypeAnnotation(
    underscoreName,
    moduleName
  );

  const methodParameters = extractCamelcasedQueryParams(schema, underscoreName);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      methodParameters ? [...methodParameters, FUNDS_PARAM] : [FUNDS_PARAM],
      t.blockStatement([
        t.returnStatement(
          t.callExpression(
            t.memberExpression(t.thisExpression(), t.identifier('_composeMsg')),
            [
              t.callExpression(
                t.memberExpression(
                  t.identifier(`${moduleName}ExecuteMsgBuilder`),
                  t.identifier(methodName)
                ),
                methodParameters
              ),
              FUNDS_PARAM
            ]
          )
        )
      ]),
      promiseTypeAnnotation('MsgExecuteContractEncodeObject'),
      true
    )
  );
};

const createStaticExecMethodMsgBuilder = (
  context: RenderContext,
  jsonschema: any,
  msgTitle: string
) => {
  const underscoreName = Object.keys(jsonschema.properties)[0];
  const methodName = camel(underscoreName);
  const obj = createTypedObjectParams(
    context,
    jsonschema.properties[underscoreName]
  );
  const args = getWasmMethodArgs(
    context,
    jsonschema.properties[underscoreName]
  );

  if (obj)
    obj.typeAnnotation = createExtractTypeAnnotation(underscoreName, msgTitle);

  return t.classProperty(
    t.identifier(methodName),
    arrowFunctionExpression(
      // params
      obj
        ? [
            // props
            obj
          ]
        : [],
      // body
      t.blockStatement([
        t.returnStatement(
          t.objectExpression([
            t.objectProperty(
              t.identifier(underscoreName),
              t.tsAsExpression(
                t.objectExpression(args),
                t.tsTypeReference(t.identifier('const'))
              )
            )
          ])
        )
      ]),
      // return type
      t.tsTypeAnnotation(t.tsTypeReference(t.identifier(msgTitle))),
      false
    ),
    null,
    null,
    false,
    // static
    true
  );
};