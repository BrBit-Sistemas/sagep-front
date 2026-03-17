import { createRequire } from 'node:module';
import type { APIRequestContext } from '@playwright/test';

import { expect } from '@playwright/test';

type PdfJsModule = {
  getDocument: (options: { data: Uint8Array }) => {
    promise: Promise<{
      numPages: number;
      getPage: (index: number) => Promise<{
        getTextContent: () => Promise<{
          items: Array<{ str?: string }>;
        }>;
      }>;
      destroy: () => Promise<void>;
    }>;
  };
};

class MinimalDomMatrix {
  multiplySelf(): this {
    return this;
  }

  preMultiplySelf(): this {
    return this;
  }

  translateSelf(): this {
    return this;
  }

  scaleSelf(): this {
    return this;
  }

  rotateSelf(): this {
    return this;
  }

  invertSelf(): this {
    return this;
  }
}

class MinimalPath2D {}

if (typeof globalThis.DOMMatrix === 'undefined') {
  globalThis.DOMMatrix = MinimalDomMatrix as typeof DOMMatrix;
}

if (typeof globalThis.Path2D === 'undefined') {
  globalThis.Path2D = MinimalPath2D as typeof Path2D;
}

const require = createRequire(import.meta.url);
const pdfjs = require('pdfjs-dist/legacy/build/pdf.js') as PdfJsModule;

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url);
}

function normalizeForSearch(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

async function downloadExternalPdf(url: string): Promise<Buffer> {
  const response = await fetch(url);

  expect(response.ok).toBeTruthy();

  return Buffer.from(await response.arrayBuffer());
}

export async function downloadPdf(
  request: APIRequestContext,
  url: string
): Promise<Buffer> {
  if (isAbsoluteUrl(url)) {
    return downloadExternalPdf(url);
  }

  const response = await request.get(url);
  expect(response.ok()).toBeTruthy();
  return Buffer.from(await response.body());
}

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const document = await pdfjs.getDocument({
    data: new Uint8Array(buffer),
  }).promise;

  const pages: string[] = [];

  for (let pageIndex = 1; pageIndex <= document.numPages; pageIndex += 1) {
    const page = await document.getPage(pageIndex);
    const content = await page.getTextContent();
    pages.push(
      content.items
        .map((item) => item.str ?? '')
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim()
    );
  }

  await document.destroy();
  return pages.join(' ').replace(/\s+/g, ' ').trim();
}

export async function expectPdfContainsFields(
  request: APIRequestContext,
  url: string,
  fields: string[]
): Promise<void> {
  const buffer = await downloadPdf(request, url);
  const text = await extractPdfText(buffer);
  const normalizedText = normalizeForSearch(text);

  for (const field of fields.filter(Boolean)) {
    const normalizedField = normalizeForSearch(field);

    expect(
      text.includes(field) || normalizedText.includes(normalizedField)
    ).toBeTruthy();
  }
}
