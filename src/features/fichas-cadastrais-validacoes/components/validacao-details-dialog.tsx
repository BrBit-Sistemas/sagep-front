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
import { StatusChip } from 'src/components/status-chip';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { useAprovar } from '../hooks/use-aprovar';
import { RevalidarDialog } from './revalidar-dialog';
import { useValidacaoStore } from '../stores/validacao-store';
import { useFilaDisponivel } from '../hooks/use-fila-disponivel';
import { validacoesPermissions } from '../constants/permissions';
import { RequererCorrecaoDialog } from './requerer-correcao-dialog';
import { useValidacaoDetails } from '../hooks/use-validacao-details';

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <Stack direction="row" sx={{ py: 1 }} spacing={2}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 180, fontWeight: 500 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
  </Stack>
);

export const ValidacaoDetailsDialog = () => {
  const { hasPermission } = usePermissionCheck();
  const { isDetailsOpen, selectedFichaId, closeDetails, openReprovar, openRevalidar } =
    useValidacaoStore();

  const { data, isLoading } = useValidacaoDetails(selectedFichaId);
  const { mutateAsync: aprovar, isPending: isAprovar } = useAprovar();
  const { mutateAsync: liberarFila, isPending: isLiberar } = useFilaDisponivel();

  const canValidar = hasPermission(validacoesPermissions.validar);

  const busy = isAprovar || isLiberar;

  const handleAprovar = async () => {
    if (!data) return;
    await aprovar(data.id);
    closeDetails();
  };

  const handleLiberarFila = async () => {
    if (!data) return;
    await liberarFila(data.id);
    closeDetails();
  };

  const detentoNome = data?.detento?.nome ?? data?.nome ?? '—';
  const prontuario = data?.detento?.prontuario ?? data?.prontuario ?? '—';
  const cpf = data?.detento?.cpf ?? data?.cpf ?? '—';

  const status = data?.status_validacao;
  const showAprovarAndReprovar = status === 'AGUARDANDO_VALIDACAO';
  const showLiberarFila = status === 'VALIDADO';
  const showRevalidar =
    status === 'VALIDADO' || status === 'REQUER_CORRECAO' || status === 'FILA_DISPONIVEL';
  const showReprovarSolo = status === 'VALIDADO' || status === 'FILA_DISPONIVEL';

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
            {data && <StatusChip status={data.status_validacao} />}
            {data?.status === 'inativa' && (
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
                  {detentoNome}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Prontuário: {prontuario} · CPF: {cpf}
                </Typography>
              </Row>

              <Divider />

              <Row label="Regime">
                <Typography variant="body2">{data.regime || '—'}</Typography>
              </Row>
              <Row label="Unidade prisional">
                <Typography variant="body2">{data.unidade_prisional || '—'}</Typography>
              </Row>
              <Row label="Artigos penais">
                {data.artigos_penais.length === 0 ? (
                  <Typography variant="body2" color="text.disabled">
                    —
                  </Typography>
                ) : (
                  <Stack direction="row" flexWrap="wrap" gap={0.75}>
                    {data.artigos_penais.map((a) => (
                      <Chip key={a} size="small" label={a} variant="outlined" />
                    ))}
                  </Stack>
                )}
              </Row>

              {data.substatus_operacional && (
                <>
                  <Divider />
                  <Row label="Substatus operacional">
                    <Typography variant="body2">{data.substatus_operacional}</Typography>
                  </Row>
                </>
              )}

              {data.status_validacao === 'REQUER_CORRECAO' && data.motivo_reprovacao && (
                <Alert
                  severity="error"
                  sx={{ mt: 1 }}
                  icon={<Iconify icon="solar:close-circle-bold" />}
                >
                  <Typography variant="caption" sx={{ fontWeight: 700, display: 'block' }}>
                    Motivo da reprovação
                  </Typography>
                  {data.motivo_reprovacao}
                </Alert>
              )}

              <Divider sx={{ my: 1 }} />

              <Row label="Validado por">
                <Typography variant="body2">
                  {data.validado_por_nome || (data.validado_por ? '—' : '—')}
                </Typography>
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

          {data && canValidar && showRevalidar && (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<Iconify icon="solar:restart-bold" />}
              onClick={openRevalidar}
              disabled={busy}
            >
              Reabrir análise
            </Button>
          )}

          {data && canValidar && (showAprovarAndReprovar || showReprovarSolo) && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<Iconify icon="solar:close-circle-bold" />}
              onClick={openReprovar}
              disabled={busy}
            >
              Reprovar ficha
            </Button>
          )}

          {data && canValidar && showAprovarAndReprovar && (
            <Button
              variant="contained"
              color="success"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              onClick={handleAprovar}
              loading={isAprovar}
            >
              Aprovar
            </Button>
          )}

          {data && canValidar && showLiberarFila && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<Iconify icon="solar:check-circle-bold" />}
              onClick={handleLiberarFila}
              loading={isLiberar}
            >
              Liberar para fila
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {data && (
        <>
          <RequererCorrecaoDialog fichaId={data.id} detentoNome={detentoNome} />
          <RevalidarDialog fichaId={data.id} detentoNome={detentoNome} />
        </>
      )}
    </>
  );
};
