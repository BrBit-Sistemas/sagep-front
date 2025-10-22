import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Grid,
  Button,
  Dialog,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { Form, Field } from 'src/components/hook-form';

import { useCreateEmpresa } from '../../hooks/use-create-empresa';
import { useUpdateEmpresa } from '../../hooks/use-update-empresa';
import { createEmpresaSchema, type CreateEmpresaSchema } from '../../schemas';

type EmpresaFormDialogProps = {
  onSuccess: () => void;
  onClose: () => void;
  open: boolean;
  defaultValues?: CreateEmpresaSchema;
  empresaId?: string;
};

const INITIAL_VALUES: CreateEmpresaSchema = {
  razao_social: '',
  cnpj: '',
};

export const EmpresaFormDialog = ({
  defaultValues,
  empresaId,
  onSuccess,
  onClose,
  open,
}: EmpresaFormDialogProps) => {
  const isEditing = !!empresaId;
  const { mutateAsync: createEmpresa, isPending: isCreating } = useCreateEmpresa();
  const { mutateAsync: updateEmpresa, isPending: isUpdating } = useUpdateEmpresa();

  const isLoading = isEditing ? isUpdating : isCreating;

  const methods = useForm({
    resolver: zodResolver(createEmpresaSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (isEditing) {
      await updateEmpresa({ empresaId, ...data });
    } else {
      await createEmpresa(data);
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
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Empresa</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para {isEditing ? 'editar' : 'adicionar'} a empresa.
        </Typography>

        <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
          * Campos obrigatórios
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text required name="razao_social" label="Razão Social" />
            </Grid>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text
                required
                name="cnpj"
                label="CNPJ"
                placeholder="12345678000199"
                inputProps={{ maxLength: 14 }}
              />
            </Grid>
          </Grid>
        </Form>
      </DialogContent>

      <DialogActions>
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
