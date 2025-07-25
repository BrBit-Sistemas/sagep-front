import '@react-pdf-viewer/core/lib/styles/index.css';

import type { DetentoFichaCadastral } from 'src/features/detento/types';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { fDateTime } from 'src/utils/format-time';

import { Iconify } from 'src/components/iconify';
import { PdfWorker } from 'src/components/pdf/pdf-worker';
import { PdfThumbnail } from 'src/components/pdf/pdf-thumbnail';

import { detentoService } from '../../data';
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

  return (
    <Card
      sx={{
        aspectRatio: 1,
        position: 'relative',
        [`& .${react_pdf_cover_class}`]: { display: 'flex', justifyContent: 'center' },
        [`& .${react_pdf_cover_img_class}`]: { objectFit: 'cover', maxHeight: 200 },
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
          {hover && (
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
          )}
        </Box>
        <CardContent>{fDateTime(fichaCadastral.createdAt)}</CardContent>
      </CardActionArea>
    </Card>
  );
};
