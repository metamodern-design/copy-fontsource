import { resolve, basename } from 'path';
import { readFile, mkdir, readdir, copyFile } from 'fs/promises';

export const copy = async (context, {
  dist = 'dist',
} = {}) => {
  const jsonString = await readFile(
    path.resolve(context, 'package.json'),
    'utf8',
  );

  const { dependencies } = JSON.parse(jsonString);

  const packages = Object.keys(dependencies).filter(
    (str) => str.startsWith('@fontsource/'),
  );

  const dest = resolve(context, dist, 'files');

  const sourceFiles = await Promise.all(
    packages.map(
      (pkg) => readdir(
        resolve(context, `node_modules/${pkg}/files`),
      ),
    ),
  ).flat();

  await mkdir(dest, { recursive: true });

  await Promise.all(
    sourceFiles.map(
      (srcPath) => copyFile(srcPath, resolve(dest, basename(srcPath))),
    ),
  );
};

export default copyFontsource;
