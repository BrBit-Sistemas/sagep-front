import '@react-pdf-viewer/core/lib/styles/index.css';

import type { DetentoFichaCadastral } from 'src/features/detento/types';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';

import { fDateTime } from 'src/utils/format-time';

import { PdfWorker } from 'src/components/pdf/pdf-worker';
import { PdfThumbnail } from 'src/components/pdf/pdf-thumbnail';

import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';

const react_pdf_cover_class = 'rpv-thumbnail__cover-inner';
const react_pdf_cover_img_class = 'rpv-thumbnail__cover-image';

type DetentoFichaCadastralCardProps = {
  fichaCadastral: DetentoFichaCadastral;
};

export const DetentoFichaCadastralCard = ({ fichaCadastral }: DetentoFichaCadastralCardProps) => {
  const { openFichaCadastralEditDialog } = useDetentoDetalhesStore();

  const handleEdit = () => {
    openFichaCadastralEditDialog(fichaCadastral);
  };

  return (
    <Card
      sx={{
        aspectRatio: 1,
        [`& .${react_pdf_cover_class}`]: { display: 'flex', justifyContent: 'center' },
        [`& .${react_pdf_cover_img_class}`]: { objectFit: 'cover', maxHeight: 200 },
      }}
    >
      <CardActionArea onClick={handleEdit}>
        <PdfWorker>
          <PdfThumbnail
            width={720}
            pageIndex={0}
            fileUrl={fichaCadastral.pdf_path}
            withCredentials
          />
        </PdfWorker>
        <CardContent>{fDateTime(fichaCadastral.created_at)}</CardContent>
      </CardActionArea>
    </Card>
  );
};
