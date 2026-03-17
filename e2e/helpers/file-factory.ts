import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);
const assetsDir = path.resolve(currentDir, '../assets');

export const assetPaths = {
  validPng: path.join(assetsDir, 'documento-valido.png'),
  validJpg: path.join(assetsDir, 'documento-valido-2.jpg'),
  invalidTxt: path.join(assetsDir, 'documento-invalido.txt'),
  largePng: path.join(assetsDir, 'documento-grande.png'),
} as const;

export type AssetName = keyof typeof assetPaths;

const mimeTypes: Record<AssetName, string> = {
  validPng: 'image/png',
  validJpg: 'image/jpeg',
  invalidTxt: 'text/plain',
  largePng: 'image/png',
};

export function getAssetPath(name: AssetName): string {
  return assetPaths[name];
}

export async function getAssetBuffer(name: AssetName): Promise<Buffer> {
  return readFile(getAssetPath(name));
}

export function getAssetMimeType(name: AssetName): string {
  return mimeTypes[name];
}
