import type { Detento } from '../../../types';

import { Box, Grid, Divider, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';
import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

interface DetentoDetailsTabProps {
  detento: Detento;
}

export const DetentoDetailsTab = ({ detento }: DetentoDetailsTabProps) => {
  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 1,
    limit: 1000,
  });

  const getUnidadeName = (unidadeId: string) => {
    const unidade = unidades.find((u) => u.id === unidadeId);
    return unidade?.nome || unidadeId || '-';
  };

  const nascimento = formatDateToDDMMYYYY(detento.data_nascimento) || '-';
  const auditFormat = 'DD/MM/YYYY HH:mm';
  const createdAtFmt = fDateTime(detento.createdAt, auditFormat);
  const updatedAtFmt = fDateTime(detento.updatedAt, auditFormat);
  const createdAt = createdAtFmt === 'Invalid date' ? '-' : createdAtFmt;
  const updatedAt = updatedAtFmt === 'Invalid date' ? '-' : updatedAtFmt;

  return (
    <Box p={3}>
      <Typography variant="h6" gutterBottom>
        Dados Pessoais
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Nome</Typography>
          <Typography variant="body1" color="text.secondary">
            {detento.nome}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Prontuário</Typography>
          <Typography variant="body1" color="text.secondary">
            {detento.prontuario || '-'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">CPF</Typography>
          <Typography variant="body1" color="text.secondary">
            {detento.cpf}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Data de Nascimento</Typography>
          <Typography variant="body1" color="text.secondary">
            {nascimento}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Regime</Typography>
          <Typography variant="body1" color="text.secondary">
            {detento.regime}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Escolaridade</Typography>
          <Typography variant="body1" color="text.secondary">
            {detento.escolaridade}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Unidade</Typography>
          <Typography variant="body1" color="text.secondary">
            {getUnidadeName(detento.unidade_id)}
          </Typography>
        </Grid>
      </Grid>
      <Divider sx={{ my: 3 }} />
      <Typography variant="h6" gutterBottom>
        Auditoria
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Criado em</Typography>
          <Typography variant="body2" color="text.secondary">
            {createdAt}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography variant="subtitle2">Atualizado em</Typography>
          <Typography variant="body2" color="text.secondary">
            {updatedAt}
          </Typography>
        </Grid>
        {detento.created_by && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">Criado por</Typography>
            <Typography variant="body2" color="text.secondary">
              {detento.created_by}
            </Typography>
          </Grid>
        )}
        {detento.updated_by && (
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography variant="subtitle2">Atualizado por</Typography>
            <Typography variant="body2" color="text.secondary">
              {detento.updated_by}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};
