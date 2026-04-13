
import {
  Box,
  Chip,
  Stack,
  Alert,
  Button,
  Dialog,
  Divider,
  Skeleton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { Iconify } from 'src/components/iconify';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { StatusChip } from './status-chip';
import { useValidar } from '../hooks/use-validar';
import { useValidacaoStore } from '../stores/validacao-store';
import { ReprovarMotivoDialog } from './reprovar-motivo-dialog';
import { validacoesPermissions } from '../constants/permissions';
import { RevalidarMotivoDialog } from './revalidar-motivo-dialog';
import { useValidacaoDetails } from '../hooks/use-validacao-details';

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack direction="row" sx={{ py: 1 }} spacing={2}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180, fontWeight: 500 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
  </Stack>
);

const BoolChip = ({ value, trueLabel = 'Sim', falseLabel = 'Não' }: {
  value: boolean | null;
  trueLabel?: string;
  falseLabel?: string;
}) => {
  if (value === null) return <Typography variant="body2" color="text.disabled">—</Typography>;
  return (
    <Chip
      size="small"
      variant={value ? 'filled' : 'outlined'}
      color={value ? 'success' : 'default'}
      label={value ? trueLabel : falseLabel}
    />
  );
};

export const ValidacaoDetailsDialog = () => {
  const { hasPermission } = usePermissionCheck();
  const {
    isDetailsOpen,
    selectedFichaId,
    closeDetails,
    openReprovar,
    openRevalidar,
  } = useValidacaoStore();

  const { data, isLoading } = useValidacaoDetails(selectedFichaId);
  const { mutateAsync: validar, isPending: isValidating } = useValidar();

  const canValidar = hasPermission(validacoesPermissions.validar);
  const canRevalidar = hasPermission(validacoesPermissions.revalidar);

  const handleAprovar = async () => {
    if (!data) return;
    await validar({
      fichaId: data.ficha_cadastral_id,
      data: { decisao: 'APROVADO' },
    });
    closeDetails();
  };

  const handleAlerta = async () => {
    if (!data) return;
    await validar({
      fichaId: data.ficha_cadastral_id,
      data: { decisao: 'ALERTA' },
    });
    closeDetails();
  };

  const alreadyDecided = data && data.status !== 'PENDENTE';

  return (
    <>
      <Dialog
        open={isDetailsOpen}
        onClose={closeDetails}
        fullWidth
        maxWidth="md"
        slotProps={{ paper: { sx: { minHeight: 520 } } }}
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <span>Validação de ficha</span>
            {data && <StatusChip status={data.status} />}
            {data?.ficha_cadastral_status === 'INATIVA' && (
              <Chip size="small" variant="outlined" color="default" label="Ficha INATIVA" />
            )}
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {isLoading || !data ? (
            <Stack spacing={1.5}>
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="text" height={32} />
              ))}
            </Stack>
          ) : (
            <>
              <Row label="Reeducando">
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {data.detento_nome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Matrícula: {data.matricula || '—'} · Ficha: {data.ficha_cadastral_numero || '—'}
                </Typography>
              </Row>

              <Divider />

              <Row label="Autorização para trabalho">
                <BoolChip value={data.autorizacao_trabalho} />
              </Row>
              <Row label="Regime">
                <Typography variant="body2">{data.regime || '—'}</Typography>
              </Row>
              <Row label="Artigos">
                {data.artigos.length === 0 ? (
                  <Typography variant="body2" color="text.disabled">—</Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {data.artigos.map((a) => (
                      <Chip key={a} size="small" label={a} variant="outlined" />
                    ))}
                  </Stack>
                )}
              </Row>

              <Divider />

              <Row label="SEEU consultado">
                <BoolChip value={data.seeu_consultado} />
              </Row>
              <Row label="SIAPEN consultado">
                <BoolChip value={data.siapen_consultado} />
              </Row>

              <Divider />

              <Row label="Observação">
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {data.observacao || '—'}
                </Typography>
              </Row>

              {data.status === 'REPROVADO' && data.motivo_rejeicao && (
                <Alert severity="error" sx={{ mt: 1 }} icon={<Iconify icon="solar:close-circle-bold" />}>
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    Motivo da reprovação
                  </Typography>
                  {data.motivo_rejeicao}
                </Alert>
              )}

              <Divider sx={{ my: 1 }} />

              <Row label="Validado por">
                <Typography variant="body2">{data.validado_por_nome || '—'}</Typography>
              </Row>
              <Row label="Data da validação">
                <Typography variant="body2">
                  {data.validado_em ? formatDateToDDMMYYYY(data.validado_em) : '—'}
                </Typography>
              </Row>
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ gap: 1, flexWrap: 'wrap' }}>
          <Button onClick={closeDetails} variant="outlined">
            Fechar
          </Button>

          {data && alreadyDecided && canRevalidar && (
            <Button
              variant="contained"
              color="warning"
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={openRevalidar}
              disabled={isValidating}
            >
              Revalidar
            </Button>
          )}

          {data && !alreadyDecided && canValidar && (
            <>
              <Button
                variant="outlined"
                color="warning"
                startIcon={<Iconify icon="solar:shield-check-bold" />}
                onClick={handleAlerta}
                loading={isValidating}
              >
                Marcar alerta
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Iconify icon="solar:close-circle-bold" />}
                onClick={openReprovar}
                disabled={isValidating}
              >
                Reprovar
              </Button>
              <Button
                variant="contained"
                color="success"
                startIcon={<Iconify icon="solar:check-circle-bold" />}
                onClick={handleAprovar}
                loading={isValidating}
              >
                Aprovar
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      {data && (
        <>
          <ReprovarMotivoDialog fichaId={data.ficha_cadastral_id} detentoNome={data.detento_nome} />
          <RevalidarMotivoDialog fichaId={data.ficha_cadastral_id} detentoNome={data.detento_nome} />
        </>
      )}
    </>
  );
};
