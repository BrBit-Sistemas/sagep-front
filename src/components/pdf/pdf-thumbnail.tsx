import * as React from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.js?url';

GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

interface PdfThumbnailProps {
  fileUrl: string;
  pageIndex: number;
  width?: number;
  withCredentials?: boolean;
}

export const PdfThumbnail: React.FC<PdfThumbnailProps> = ({
  fileUrl,
  pageIndex,
  width,
  withCredentials,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    let renderTask: { cancel: () => void; promise: Promise<void> } | null = null;
    const canvas = canvasRef.current;

    if (!canvas) return undefined;

    const renderThumbnail = async () => {
      try {
        setIsLoading(true);

        const loadingTask = getDocument({
          url: fileUrl,
          withCredentials,
        });

        const pdf = await loadingTask.promise;
        const safePageIndex = Math.max(0, pageIndex) + 1;
        const page = await pdf.getPage(safePageIndex);

        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = width ? width / unscaledViewport.width : 1;
        const viewport = page.getViewport({ scale });

        const dpr = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * dpr);
        canvas.height = Math.floor(viewport.height * dpr);
        canvas.style.width = `${Math.floor(viewport.width)}px`;
        canvas.style.height = `${Math.floor(viewport.height)}px`;

        const context = canvas.getContext('2d');
        if (!context) {
          await loadingTask.destroy();
          return;
        }

        context.setTransform(dpr, 0, 0, dpr, 0, 0);

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        await loadingTask.destroy();

        if (isMounted) {
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    renderThumbnail();

    return () => {
      isMounted = false;
      renderTask?.cancel();
    };
  }, [fileUrl, pageIndex, width, withCredentials]);

  return (
    <div
      style={{
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center',
        minHeight: 200,
        width: '100%',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: isLoading ? 'none' : 'block',
          maxHeight: 200,
          objectFit: 'cover',
          width: '100%',
        }}
      />

      {isLoading && (
        <div
          style={{
            alignItems: 'center',
            color: '#9e9e9e',
            display: 'flex',
            fontSize: 14,
            justifyContent: 'center',
            minHeight: 200,
            width: '100%',
          }}
        >
          Carregando pré-visualização...
        </div>
      )}
    </div>
  );
};
