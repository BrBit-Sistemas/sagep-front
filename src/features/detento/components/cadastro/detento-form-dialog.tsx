import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  Switch,
  MenuItem,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import { Regime, Escolaridade } from '../../types';
import { useCreateDetento } from '../../hooks/use-create-detento';
import { useUpdateDetento } from '../../hooks/use-update-detento';
import { createDetentoSchema, type CreateDetentoSchema } from '../../schemas';
import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';
import { detentoDetalhesSearchQuerySerializer } from '../../hooks/use-dentento-detalhes-search-params';

type DetentoFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateDetentoSchema;
  detentoId?: string;
};

const INITIAL_VALUES: CreateDetentoSchema = {
  nome: '',
  prontuario: '',
  cpf: '',
  data_nascimento: '',
  regime: Regime.FECHADO,
  escolaridade: Escolaridade.FUNDAMENTAL,
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

  const [fillFichaCadastral, setFillFichaCadastral] = useState(false);

  const { mutateAsync: createDetento, isPending: isCreating } = useCreateDetento();
  const { mutateAsync: updateDetento, isPending: isUpdating } = useUpdateDetento();
  const { openFichaCadastralCreateDialog } = useDetentoDetalhesStore();

  const router = useRouter();

  const isLoading = isEditing ? isUpdating : isCreating;

  const { data: unidadesData, isLoading: isLoadingUnidades } = useUnidadePrisionalList({
    page: 1,
    limit: 100,
  });

  const unidades = unidadesData?.items || [];

  const methods = useForm({
    resolver: zodResolver(createDetentoSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    let _detentoId: string;

    if (isEditing) {
      await updateDetento({ detentoId, ...data });
      _detentoId = detentoId;
    } else {
      const newDetento = await createDetento(data);
      _detentoId = newDetento.detento_id;
    }

    if (fillFichaCadastral) {
      const path = paths.detentos.detalhes(_detentoId);
      const url = detentoDetalhesSearchQuerySerializer(path, { tab: 'ficha_cadastral' });
      openFichaCadastralCreateDialog();
      router.push(url);
    } else {
      const path = paths.detentos.detalhes(_detentoId);
      router.push(path);
    }

    methods.reset(INITIAL_VALUES);
    onSuccess();
  });

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Adicionar detento</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para adicionar um novo detento.
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="nome" label="Nome" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="prontuario" label="Prontuário" />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Cpf name="cpf" label="CPF" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.DatePicker name="data_nascimento" label="Data de nascimento" disableFuture />
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="regime"
                label="Regime"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {Object.values(Regime).map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="escolaridade"
                label="Escolaridade"
                slotProps={{ inputLabel: { shrink: true } }}
              >
                {Object.values(Escolaridade).map((option) => (
                  <MenuItem key={option} value={option} sx={{ textTransform: 'capitalize' }}>
                    {option}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>

            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Select
                fullWidth
                name="unidade_id"
                label="Unidade"
                slotProps={{ inputLabel: { shrink: true } }}
                disabled={isLoadingUnidades}
              >
                {isLoadingUnidades ? (
                  <MenuItem value="" disabled>
                    Carregando...
                  </MenuItem>
                ) : (
                  unidades.map((unidade) => (
                    <MenuItem
                      key={unidade.unidade_id}
                      value={unidade.unidade_id}
                      sx={{ textTransform: 'capitalize' }}
                    >
                      {unidade.nome}
                    </MenuItem>
                  ))
                )}
              </Field.Select>
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
        <FormControlLabel
          control={<Switch checked={fillFichaCadastral} />}
          label="Preencher ficha cadastral?"
          onChange={(_, checked) => setFillFichaCadastral(checked)}
          checked={fillFichaCadastral}
          sx={{ mr: 'auto' }}
        />
        <Button onClick={onClose} variant="outlined" color="primary">
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          loading={isLoading}
          disabled={isLoading}
        >
          {isEditing ? 'Atualizar' : 'Adicionar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
