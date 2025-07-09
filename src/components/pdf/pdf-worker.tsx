import type { WorkerProps } from '@react-pdf-viewer/core';

import { Worker } from '@react-pdf-viewer/core';

export const PdfWorker = (props: Omit<WorkerProps, 'workerUrl'>) => (
  <Worker {...props} workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js" />
);
