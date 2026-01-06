import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { formatDateToYYYYMMDD } from 'src/utils/format-date';

import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import {
  Regime,
  Escolaridade,
  getRegimeOptions,
  getEscolaridadeOptions,
} from 'src/types/prisional';

import { detentoService } from '../../data';
import { useCreateDetento } from '../../hooks/use-create-detento';
import { useUpdateDetento } from '../../hooks/use-update-detento';
import { createDetentoSchema, type CreateDetentoSchema } from '../../schemas';
import LoadingButton from '@mui/lab/LoadingButton';

type DetentoFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateDetentoSchema;
  detentoId?: string;
};

const INITIAL_VALUES: CreateDetentoSchema = {
  nome: '',
  mae: '',
  prontuario: '',
  cpf: '',
  data_nascimento: '',
  regime: Regime.FECHADO,
  escolaridade: Escolaridade.FUNDAMENTAL_I_INCOMPLETO,
  unidade_id: '',
};

export const DetentoFormDialog = ({
  defaultValues,
  detentoId,
  onSuccess,
  onClose,
  open,
}: DetentoFormDialogProps) => {
  const isEditing = !!detentoId;

  const { mutateAsync: createDetento, isPending: isCreating } = useCreateDetento();
  const { mutateAsync: updateDetento, isPending: isUpdating } = useUpdateDetento();
  // const { openFichaCadastralCreateDialog } = useDetentoDetalhesStore();

  const isLoading = isEditing ? isUpdating : isCreating;

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 1,
    limit: 1000,
  });

  // Format default values for display - keep date in YYYY-MM-DD format for DatePicker
  const formattedDefaultValues = defaultValues
    ? {
      ...defaultValues,
      // Keep the date in YYYY-MM-DD format for the DatePicker component
      data_nascimento: formatDateToYYYYMMDD(defaultValues.data_nascimento) || '',
    }
    : undefined;

  const methods = useForm({
    resolver: zodResolver(createDetentoSchema),
    defaultValues: isEditing ? formattedDefaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    const payload = {
      ...data,
      data_nascimento: formatDateToYYYYMMDD(data.data_nascimento) || '',
    };

    try {
      // Pre-validação: prontuário único
      const prontuario = String(payload.prontuario || '').trim();
      if (prontuario) {
        const existing = await detentoService.paginate({ page: 1, limit: 1, search: prontuario });
        const found = existing.items?.find((d: any) => String(d.prontuario).trim() === prontuario);
        if (found && (!isEditing || found.id !== detentoId)) {
          methods.setError('prontuario' as any, {
            type: 'manual',
            message: 'Prontuário não está disponível.',
          });
          return;
        }
        payload.prontuario = prontuario;
      } else {
        delete (payload as any).prontuario;
      }

      if (isEditing) {
        await updateDetento({ detentoId, ...payload });
      } else {
        await createDetento(payload);
      }
      methods.reset(INITIAL_VALUES);
      onSuccess();
    } catch (err: any) {
      // Verifica se o erro foi lançado pelo hook com fieldErrors
      if (err?.fieldErrors && Array.isArray(err.fieldErrors)) {
        err.fieldErrors.forEach((fieldError: any) => {
          if (fieldError.field === 'cpf') {
            methods.setError('cpf' as any, {
              type: 'manual',
              message: fieldError.message
            });
          } else if (fieldError.field === 'prontuario') {
            methods.setError('prontuario' as any, {
              type: 'manual',
              message: fieldError.message
            });
          }
        });
        return;
      }

      // Extrai informações do erro original
      const originalError = err?.originalError || err;
      const status = originalError?.response?.status;

      // Tenta extrair a mensagem de várias formas possíveis
      let message: any =
        originalError?.response?.data?.message ||
        originalError?.response?.data?.userMessage ||
        originalError?.message ||
        err?.message;

      if (Array.isArray(message)) message = message.join(' ');
      if (!message || typeof message !== 'string') {
        message = originalError?.response?.data?.detail || 'Erro inesperado.';
      }

      const msg = String(message || '').toLowerCase();

      // Tratamento específico para erro 409 (Conflict)
      if (status === 409) {
        // Verifica se é erro de CPF duplicado (prioridade)
        if (msg.includes('cpf')) {
          const errorMessage = message || 'CPF já cadastrado.';
          methods.setError('cpf' as any, {
            type: 'manual',
            message: errorMessage
          });
          return;
        }

        // Verifica se é erro de Prontuário duplicado
        if (msg.includes('prontuário') || msg.includes('prontuario')) {
          const errorMessage = message || 'Prontuário já cadastrado.';
          methods.setError('prontuario' as any, {
            type: 'manual',
            message: errorMessage
          });
          return;
        }

        // Fallback para outros conflitos 409
        methods.setError('cpf' as any, {
          type: 'manual',
          message: message || 'Dados já cadastrados no sistema.',
        });
        return;
      }

      // Para outros erros, tentar identificar o campo pelo conteúdo da mensagem
      if (msg.includes('cpf')) {
        methods.setError('cpf' as any, { type: 'manual', message: String(message) });
        return;
      }

      if (msg.includes('prontuário') || msg.includes('prontuario')) {
        methods.setError('prontuario' as any, { type: 'manual', message: String(message) });
        return;
      }

      // Se não conseguir identificar o campo, apenas logar o erro
      console.error('Erro ao salvar detento:', err);
    }
  });

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar reeducando' : 'Adicionar reeducando'}</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 1 }}>
          {isEditing
            ? 'Edite os campos abaixo para atualizar o reeducando.'
            : 'Preencha os campos abaixo para adicionar um novo reeducando.'}
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text required name="nome" label="Nome" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text required name="mae" label="Nome da mãe" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text required name="prontuario" label="Prontuário" />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Cpf required name="cpf" label="CPF" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_nascimento" label="Data de nascimento *" disableFuture />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="regime"
                label="Regime"
                required
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {getRegimeOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                required
                name="escolaridade"
                label="Escolaridade"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {getEscolaridadeOptions().map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Field.Select name="unidade_id" label="Unidade Prisional">
                {unidades.map((unidade) => (
                  <MenuItem key={unidade.id} value={unidade.id}>
                    {unidade.nome}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined">
          Cancelar
        </Button>
        <LoadingButton onClick={handleSubmit} variant="contained" loading={isLoading} disabled={isLoading}>
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
