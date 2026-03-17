import type { DetentoFichaCadastral } from '../../types';

import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';

import { formatDateToDDMMYYYY } from 'src/utils/format-date';

type DetentoFichaInativaSelectorProps = {
  fichasInativas: DetentoFichaCadastral[];
  onSelectFicha: (ficha: DetentoFichaCadastral) => void;
  onSkip: () => void;
  isLoading?: boolean;
};

export const DetentoFichaInativaSelector = ({
  fichasInativas,
  onSelectFicha,
  onSkip,
  isLoading,
}: DetentoFichaInativaSelectorProps) => {
  if (isLoading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 4 }}>
        <CircularProgress size={24} />
        <Typography variant="body2" color="text.secondary">
          Buscando fichas inativas...
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2} data-testid="ficha-inativa-selector">
      <Typography variant="h6">Fichas anteriores encontradas</Typography>
      <Typography variant="body2" color="text.secondary">
        Selecione uma ficha inativa para reaproveitar os dados na nova ficha ou inicie do zero.
      </Typography>

      <Grid container spacing={2}>
        {fichasInativas.map((ficha) => {
          const dataFicha =
            formatDateToDDMMYYYY(ficha.updatedAt || ficha.createdAt) || 'Data não informada';

          return (
            <Grid size={{ xs: 12, md: 6 }} key={ficha.fichacadastral_id}>
              <Card
                variant="outlined"
                data-testid={`ficha-inativa-card-${ficha.fichacadastral_id}`}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Ficha de {dataFicha}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Unidade: {ficha.unidade_prisional || 'Não informada'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Profissão: {ficha.profissao_01 || 'Não informada'}
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={() => onSelectFicha(ficha)}
                      size="small"
                      data-testid={`ficha-inativa-select-${ficha.fichacadastral_id}`}
                    >
                      Usar esta ficha
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <Stack direction="row" justifyContent="flex-end">
        <Button variant="outlined" onClick={onSkip} data-testid="ficha-inativa-skip">
          Criar do zero
        </Button>
      </Stack>
    </Stack>
  );
};
