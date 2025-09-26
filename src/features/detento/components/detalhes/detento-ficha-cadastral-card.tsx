import '@react-pdf-viewer/core/lib/styles/index.css';

import type { DetentoFichaCadastral } from 'src/features/detento/types';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import {
  Box,
  Card,
  Chip,
  Dialog,
  Button,
  Tooltip,
  IconButton,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
  CardActionArea,
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { PdfWorker } from 'src/components/pdf/pdf-worker';
import { PdfThumbnail } from 'src/components/pdf/pdf-thumbnail';

import { detentoService } from '../../data';
import { detentoKeys } from '../../hooks/keys';
import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';

const react_pdf_cover_class = 'rpv-thumbnail__cover-inner';
const react_pdf_cover_img_class = 'rpv-thumbnail__cover-image';

type DetentoFichaCadastralCardProps = {
  fichaCadastral: DetentoFichaCadastral;
};

export const DetentoFichaCadastralCard = ({ fichaCadastral }: DetentoFichaCadastralCardProps) => {
  const { openFichaCadastralEditDialog } = useDetentoDetalhesStore();
  const [hover, setHover] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{
    open: boolean;
    type: 'delete' | 'activate' | 'deactivate' | null;
  }>({ open: false, type: null });
  const [pending, setPending] = useState(false);
  const [localStatus, setLocalStatus] = useState<DetentoFichaCadastral['status']>(
    fichaCadastral.status
  );
  const queryClient = useQueryClient();

  useEffect(() => {
    let mounted = true;
    detentoService.getFichaCadastralPdfUrl(fichaCadastral.fichacadastral_id).then((url) => {
      if (mounted) setSignedUrl(url);
    });
    return () => {
      mounted = false;
    };
  }, [fichaCadastral.fichacadastral_id]);

  const handleEdit = () => {
    openFichaCadastralEditDialog(fichaCadastral);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (signedUrl) window.open(signedUrl, '_blank');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirm({ open: true, type: 'delete' });
  };

  const handleDeactivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fichaCadastral.status === 'inativa') return;
    setConfirm({ open: true, type: 'deactivate' });
  };

  const handleActivate = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (fichaCadastral.status === 'ativa') return;
    setConfirm({ open: true, type: 'activate' });
  };

  const onConfirm = async () => {
    if (!confirm.type) return;
    const type = confirm.type;
    setConfirm({ open: false, type: null });
    setPending(true);
    try {
      if (type === 'delete') {
        await detentoService.deleteFichaCadastral(fichaCadastral.fichacadastral_id);
      } else if (type === 'deactivate') {
        setLocalStatus('inativa');
        await detentoService.updateFichaCadastral(fichaCadastral.fichacadastral_id, {
          status: 'inativa',
        } as any);
      } else if (type === 'activate') {
        setLocalStatus('ativa');
        await detentoService.updateFichaCadastral(fichaCadastral.fichacadastral_id, {
          status: 'ativa',
        } as any);
      }
    } finally {
      await queryClient.invalidateQueries({
        queryKey: detentoKeys.fichasCadastrais(fichaCadastral.detento_id),
      });
      setPending(false);
    }
  };

  return (
    <Card
      sx={{
        aspectRatio: 1,
        position: 'relative',
        [`& .${react_pdf_cover_class}`]: { display: 'flex', justifyContent: 'center' },
        [`& .${react_pdf_cover_img_class}`]: { objectFit: 'cover', maxHeight: 200 },
        // Borda especial para ficha ativa
        ...(localStatus === 'ativa' && {
          border: '3px solid',
          borderColor: 'success.main',
          borderRadius: 2,
          boxShadow: (theme) => `0 0 12px ${theme.palette.success.main}33`,
          transform: 'scale(1.02)',
          transition: 'all 0.3s ease-in-out',
        }),
        // Hover effect mantém a borda ativa
        '&:hover': {
          ...(localStatus === 'ativa' && {
            boxShadow: (theme) => `0 0 16px ${theme.palette.success.main}55`,
            transform: 'scale(1.03)',
          }),
        },
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <CardActionArea onClick={handleEdit} sx={{ height: '100%' }}>
        <Box sx={{ position: 'relative', height: '100%' }}>
          <PdfWorker>
            {signedUrl && (
              <PdfThumbnail width={720} pageIndex={0} fileUrl={signedUrl} withCredentials />
            )}
          </PdfWorker>
          {(hover || pending) && (
            <>
              <IconButton
                onClick={handleView}
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  bgcolor: 'rgba(0,0,0,0.35)',
                  color: 'common.white',
                  p: 0.5,
                  zIndex: 2,
                  '&:hover': { bgcolor: 'primary.main' },
                  boxShadow: 1,
                }}
                size="small"
              >
                <Iconify icon="solar:eye-bold" width={22} height={22} />
              </IconButton>
              <IconButton
                onClick={handleDelete}
                sx={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  bgcolor: 'rgba(255,0,0,0.25)',
                  color: 'error.main',
                  p: 0.5,
                  zIndex: 2,
                  '&:hover': { bgcolor: 'error.main', color: 'common.white' },
                  boxShadow: 1,
                }}
                size="small"
              >
                <Iconify icon="solar:trash-bin-trash-bold" width={22} height={22} />
              </IconButton>

              {localStatus === 'ativa' ? (
                <Tooltip title="Desativar ficha">
                  <IconButton
                    onClick={handleDeactivate}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.35)',
                      color: 'warning.main',
                      p: 0.5,
                      zIndex: 2,
                      '&:hover': { bgcolor: 'warning.main', color: 'common.white' },
                      boxShadow: 1,
                    }}
                    size="small"
                  >
                    <Iconify icon="solar:pen-bold" width={22} height={22} />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Ativar ficha">
                  <IconButton
                    onClick={handleActivate}
                    sx={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      bgcolor: 'rgba(0,0,0,0.35)',
                      color: 'success.main',
                      p: 0.5,
                      zIndex: 2,
                      '&:hover': { bgcolor: 'success.main', color: 'common.white' },
                      boxShadow: 1,
                    }}
                    size="small"
                  >
                    <Iconify icon="solar:pen-bold" width={22} height={22} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          {/* Badge para ficha ativa */}
          {localStatus === 'ativa' && (
            <Box
              sx={{
                position: 'absolute',
                bottom: -8,
                left: -8,
                bgcolor: 'success.main',
                color: 'white',
                borderRadius: '50%',
                width: 32,
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 3,
                boxShadow: 2,
                border: '2px solid white',
              }}
            >
              <Iconify icon="solar:check-circle-bold" width={18} height={18} />
            </Box>
          )}
        </Box>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Chip
              size="small"
              color={localStatus === 'ativa' ? 'success' : 'default'}
              label={localStatus === 'ativa' ? 'Ativa' : 'Inativa'}
              sx={{
                // Chip com estilo especial para ficha ativa
                ...(localStatus === 'ativa' && {
                  fontWeight: 'bold',
                  '& .MuiChip-label': {
                    color: 'success.contrastText',
                  },
                }),
              }}
            />
            {fDateTime(fichaCadastral.createdAt)}
          </Box>
        </CardContent>
      </CardActionArea>
      <Dialog open={confirm.open} onClose={() => setConfirm({ open: false, type: null })}>
        <DialogTitle>
          {confirm.type === 'delete'
            ? 'Excluir ficha cadastral'
            : confirm.type === 'deactivate'
              ? 'Desativar ficha cadastral'
              : 'Ativar ficha cadastral'}
        </DialogTitle>
        <DialogContent>
          {confirm.type === 'delete' && 'Tem certeza que deseja excluir esta ficha cadastral?'}
          {confirm.type === 'deactivate' && 'Deseja desativar esta ficha cadastral?'}
          {confirm.type === 'activate' &&
            'Ativar esta ficha cadastral? Somente uma ficha pode permanecer ativa por detento.'}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirm({ open: false, type: null })} variant="outlined">
            Cancelar
          </Button>
          <Button
            onClick={onConfirm}
            variant="contained"
            color={confirm.type === 'delete' ? 'error' : 'primary'}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};
