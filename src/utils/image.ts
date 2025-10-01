export type CroppedImageResult = {
  file: File;
  dataUrl: string;
};

export type AvatarCropOptions = {
  zoom: number;
  position: { x: number; y: number }; // percentage 0-100
  cropSize: number;
  outputSize?: number;
  imageMetrics: { width: number; height: number };
  fileName?: string;
};

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.crossOrigin = 'anonymous';
    image.src = url;
  });

export const createCircularAvatar = async (
  imageSrc: string,
  {
    zoom,
    position,
    cropSize,
    outputSize = 512,
    imageMetrics,
    fileName = 'avatar.png',
  }: AvatarCropOptions
): Promise<CroppedImageResult> => {
  const image = await createImage(imageSrc);

  const baseScale = Math.max(cropSize / imageMetrics.width, cropSize / imageMetrics.height);
  const scale = baseScale * zoom;

  const displayWidth = imageMetrics.width * scale;
  const displayHeight = imageMetrics.height * scale;

  const maxOffsetX = Math.max(displayWidth - cropSize, 0);
  const maxOffsetY = Math.max(displayHeight - cropSize, 0);

  const offsetX = (position.x / 100) * maxOffsetX;
  const offsetY = (position.y / 100) * maxOffsetY;

  const canvas = document.createElement('canvas');
  canvas.width = outputSize;
  canvas.height = outputSize;

  const context = canvas.getContext('2d');

  if (!context) {
    throw new Error('O contexto 2D não pôde ser inicializado.');
  }

  const ratio = outputSize / cropSize;

  context.save();
  context.imageSmoothingQuality = 'high';
  context.clearRect(0, 0, outputSize, outputSize);
  context.beginPath();
  context.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
  context.closePath();
  context.clip();

  context.drawImage(
    image,
    -offsetX * ratio,
    -offsetY * ratio,
    displayWidth * ratio,
    displayHeight * ratio
  );
  context.restore();

  const dataUrl = canvas.toDataURL('image/png');

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((file) => {
      if (!file) {
        reject(new Error('Não foi possível gerar o arquivo recortado.'));
        return;
      }
      resolve(file);
    }, 'image/png');
  });

  const file = new File([blob], fileName, { type: 'image/png' });

  return { file, dataUrl };
};
