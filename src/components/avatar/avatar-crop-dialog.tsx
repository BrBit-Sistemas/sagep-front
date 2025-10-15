import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { createCircularAvatar } from 'src/utils/image';

export type AvatarCropDialogProps = {
  open: boolean;
  imageSrc: string | null;
  fileName?: string;
  onClose: () => void;
  onComplete: (result: { file: File; dataUrl: string }) => void;
};

const ZOOM_MIN = 1;
const ZOOM_MAX = 3;
const ZOOM_STEP = 0.05;
const CROP_SIZE = 360;
const OUTPUT_SIZE = 256;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

type ImageMetrics = {
  width: number;
  height: number;
};

type PointerSnapshot = {
  startX: number;
  startY: number;
  startPercentX: number;
  startPercentY: number;
};

export function AvatarCropDialog({
  open,
  imageSrc,
  onClose,
  onComplete,
  fileName = 'avatar.png',
}: AvatarCropDialogProps) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [imageMetrics, setImageMetrics] = useState<ImageMetrics | null>(null);
  const [processing, setProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const dragSnapshotRef = useRef<PointerSnapshot | null>(null);
  const cropZoneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!imageSrc) {
      setImageMetrics(null);
      return;
    }

    const image = new Image();
    image.onload = () => {
      setImageMetrics({ width: image.naturalWidth, height: image.naturalHeight });
    };
    image.src = imageSrc;
  }, [imageSrc]);

  useEffect(() => {
    if (!open) return;
    setZoom(1);
    setPosition({ x: 50, y: 50 });
  }, [open]);

  const displaySize = useMemo(() => {
    if (!imageMetrics) return null;
    const baseScale = Math.max(CROP_SIZE / imageMetrics.width, CROP_SIZE / imageMetrics.height);
    const scale = baseScale * zoom;
    return {
      width: imageMetrics.width * scale,
      height: imageMetrics.height * scale,
    };
  }, [imageMetrics, zoom]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!displaySize) return;
      (event.target as HTMLElement).setPointerCapture(event.pointerId);
      setIsDragging(true);
      dragSnapshotRef.current = {
        startX: event.clientX,
        startY: event.clientY,
        startPercentX: position.x,
        startPercentY: position.y,
      };
    },
    [displaySize, position.x, position.y]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging || !displaySize || !dragSnapshotRef.current) return;
      const maxOffsetX = Math.max(displaySize.width - CROP_SIZE, 0);
      const maxOffsetY = Math.max(displaySize.height - CROP_SIZE, 0);
      if (maxOffsetX === 0 && maxOffsetY === 0) return;

      const deltaX = event.clientX - dragSnapshotRef.current.startX;
      const deltaY = event.clientY - dragSnapshotRef.current.startY;

      const percentXDelta = maxOffsetX ? (deltaX / maxOffsetX) * 100 : 0;
      const percentYDelta = maxOffsetY ? (deltaY / maxOffsetY) * 100 : 0;

      setPosition({
        x: clamp(dragSnapshotRef.current.startPercentX + percentXDelta, 0, 100),
        y: clamp(dragSnapshotRef.current.startPercentY + percentYDelta, 0, 100),
      });
    },
    [displaySize, isDragging]
  );

  const stopDragging = useCallback((event?: React.PointerEvent<HTMLDivElement>) => {
    if (event) {
      (event.target as HTMLElement).releasePointerCapture(event.pointerId);
    }
    setIsDragging(false);
    dragSnapshotRef.current = null;
  }, []);

  const handleComplete = useCallback(async () => {
    if (!imageSrc || !imageMetrics) return;
    try {
      setProcessing(true);
      const result = await createCircularAvatar(imageSrc, {
        zoom,
        position,
        cropSize: CROP_SIZE,
        outputSize: OUTPUT_SIZE,
        imageMetrics,
      });
      onComplete(result);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, imageMetrics, zoom, position, onComplete, onClose]);

  const borderFeedback = useMemo(() => {
    if (!displaySize) return 'Carregando imagem...';
    const maxOffsetX = Math.max(displaySize.width - CROP_SIZE, 0);
    const maxOffsetY = Math.max(displaySize.height - CROP_SIZE, 0);
    const canMove = maxOffsetX > 2 || maxOffsetY > 2;
    return canMove
      ? 'Arraste a imagem para ajustar o enquadramento ou use os controles.'
      : 'Ajuste o zoom para refinar o enquadramento.';
  }, [displaySize]);

  return (
    <Dialog
      open={open}
      onClose={processing ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { overflow: 'visible' } }}
    >
      <DialogTitle>Recortar foto</DialogTitle>
      <DialogContent sx={{ mt: 1 }}>
        {imageSrc ? (
          <Stack spacing={3}>
            <Box
              ref={cropZoneRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={stopDragging}
              onPointerLeave={stopDragging}
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: CROP_SIZE,
                mx: 'auto',
                aspectRatio: '1 / 1',
                borderRadius: '50%',
                overflow: 'hidden',
                touchAction: 'none',
                bgcolor: 'grey.900',
                cursor: isDragging ? 'grabbing' : 'grab',
                border: (theme) => `2px solid ${theme.palette.divider}`,
                backgroundColor: 'grey.800',
                backgroundImage: `url(${imageSrc})`,
                backgroundSize: displaySize
                  ? `${displaySize.width}px ${displaySize.height}px`
                  : 'cover',
                backgroundPosition: `${position.x}% ${position.y}%`,
                backgroundRepeat: 'no-repeat',
              }}
            />

            <Typography variant="caption" color="text.secondary" textAlign="center">
              {borderFeedback}
            </Typography>

            <Stack spacing={1.5}>
              <Typography variant="caption" color="text.secondary">
                Zoom
              </Typography>
              <Slider
                value={zoom}
                min={ZOOM_MIN}
                max={ZOOM_MAX}
                step={ZOOM_STEP}
                onChange={(_, value) => setZoom(Array.isArray(value) ? value[0] : value)}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="caption" color="text.secondary">
                Horizontal
              </Typography>
              <Slider
                value={position.x}
                min={0}
                max={100}
                step={0.5}
                onChange={(_, value) =>
                  setPosition((prev) => ({ ...prev, x: Array.isArray(value) ? value[0] : value }))
                }
                disabled={!displaySize || displaySize.width <= CROP_SIZE}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="caption" color="text.secondary">
                Vertical
              </Typography>
              <Slider
                value={position.y}
                min={0}
                max={100}
                step={0.5}
                onChange={(_, value) =>
                  setPosition((prev) => ({ ...prev, y: Array.isArray(value) ? value[0] : value }))
                }
                disabled={!displaySize || displaySize.height <= CROP_SIZE}
              />
            </Stack>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhuma imagem selecionada.
          </Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} disabled={processing} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!imageSrc || !imageMetrics || processing}
          variant="contained"
        >
          {processing ? 'Processando...' : 'Aplicar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
