import { readSchemas } from '../src/utils';
import { sync as mkdirp } from 'mkdirp';
import generate from '../src/generate';
import fromPartial from '../src/from-partial';
import reactQuery from '../src/react-query';
import recoil from '../src/recoil';
import { writeFileSync } from 'fs';

const FIXTURE_DIR = __dirname + '/../../../__fixtures__';
const OUTPUT_DIR = __dirname + '/../../../__output__';


it('sg721', async () => {
    const out = OUTPUT_DIR + '/sg721';
    const schemaDir = FIXTURE_DIR + '/sg721/';

    const clean = await readSchemas({ schemaDir, argv: {}, clean: true });
    const orig = await readSchemas({ schemaDir, argv: {}, clean: false });

    mkdirp(out);
    writeFileSync(out + '/orig.json', JSON.stringify(orig, null, 2));
    writeFileSync(out + '/clean.json', JSON.stringify(clean, null, 2));

})

it('daodao/cw-code-id-registry', async () => {
    const out = OUTPUT_DIR + '/daodao/cw-code-id-registry';
    const schemaDir = FIXTURE_DIR + '/daodao/cw-code-id-registry/';

    const clean = await readSchemas({ schemaDir, argv: {}, clean: true });
    const orig = await readSchemas({ schemaDir, argv: {}, clean: false });

    mkdirp(out);
    writeFileSync(out + '/orig.json', JSON.stringify(orig, null, 2));
    writeFileSync(out + '/clean.json', JSON.stringify(clean, null, 2));

})

