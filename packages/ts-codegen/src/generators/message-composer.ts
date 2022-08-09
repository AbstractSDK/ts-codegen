import { pascal } from "case";
import { header } from '../utils/header';
import { join } from "path";
import { sync as mkdirp } from "mkdirp";
import * as w from 'wasm-ast-types';
import * as t from '@babel/types';
import { writeFileSync } from 'fs';
import generate from "@babel/generator";
import { getMessageProperties } from "wasm-ast-types";
import { findAndParseTypes, findExecuteMsg, getDefinitionSchema } from "../utils";
import { RenderContext, MessageComposerOptions } from "wasm-ast-types";
import { BuilderFile } from "../builder";

export default async (
  name: string,
  schemas: any[],
  outPath: string,
  messageComposerOptions?: MessageComposerOptions
): Promise<BuilderFile[]> => {

  const context = new RenderContext(getDefinitionSchema(schemas), {
    messageComposer: messageComposerOptions ?? {}
  });
  const options = context.options.messageComposer;

  const localname = pascal(name) + '.message-composer.ts';
  const TypesFile = pascal(name) + '.types';
  const ExecuteMsg = findExecuteMsg(schemas);
  const typeHash = await findAndParseTypes(schemas);

  const body = [];

  body.push(
    w.importStmt(Object.keys(typeHash), `./${TypesFile}`)
  );

  // execute messages
  if (ExecuteMsg) {
    const children = getMessageProperties(ExecuteMsg);
    if (children.length > 0) {
      const TheClass = pascal(`${name}MessageComposer`);
      const Interface = pascal(`${name}Message`);

      body.push(
        w.createMessageComposerInterface(
          context,
          Interface,
          ExecuteMsg
        )
      );
      body.push(
        w.createMessageComposerClass(
          context,
          TheClass,
          Interface,
          ExecuteMsg
        )
      );
    }
  }

  if (typeHash.hasOwnProperty('Coin')) {
    delete context.utils.Coin;
  }
  const imports = context.getImports();
  const code = header + generate(
    t.program([
      ...imports,
      ...body
    ])
  ).code;

  mkdirp(outPath);
  writeFileSync(join(outPath, localname), code);

  return [
    {
      type: 'message-composer',
      contract: name,
      localname,
      filename: join(outPath, localname),
    }
  ]
};