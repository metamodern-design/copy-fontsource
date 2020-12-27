import { resolve, basename } from 'path';
import {
  readFile, mkdir, readdir, copyFile,
} from 'fs/promises';

export const copy = async (context, {
  dist = 'dist',
} = {}) => {
  const jsonString = await readFile(
    resolve(context, 'package.json'),
    'utf8',
  );

  const { dependencies } = JSON.parse(jsonString);

  const packages = Object.keys(dependencies).filter(
    (str) => str.startsWith('@fontsource/'),
  );

  const dest = resolve(context, dist, 'files');

  const sourceFiles = (await Promise.all(
    packages.map((pkg) => {
      const dirname = resolve(context, `node_modules/${pkg}/files`);
      return readdir(dirname).then(
        (names) => names.map((n) => resolve(dirname, n)),
      );
    }),
  )).flat();

  await mkdir(dest, { recursive: true });

  await Promise.all(
    sourceFiles.map(
      (srcPath) => copyFile(srcPath, resolve(dest, basename(srcPath))),
    ),
  );
};
