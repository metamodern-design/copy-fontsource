import { resolve } from 'path';
import { existsSync, rmSync } from 'fs';

import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { copy } from '../lib/index.js';


const context = resolve(process.cwd(), 'test/fixtures');
const dist = 'public';

const expected = [
  '1a.txt',
  '1b.txt',
  '2a.txt',
  '2b.txt',
];


test.before(async () => {
  await copy(context, { dist });
});


test.after(() => {
  rmSync(resolve(context, dist), { force: true });
});


test('All files were copied', () => {
  assert.ok(
    expected.every(
      (name) => existsSync(path.resolve(context, dist, 'files', name)),
    ),
  );
});

test.run()
