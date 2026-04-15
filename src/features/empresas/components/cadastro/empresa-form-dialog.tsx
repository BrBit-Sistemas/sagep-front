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

import { Form, Field } from 'src/components/hook-form';

import { useCreateEmpresa } from '../../hooks/use-create-empresa';
import { useUpdateEmpresa } from '../../hooks/use-update-empresa';
import { createEmpresaSchema, TIPO_EMPRESA_OPTIONS, type CreateEmpresaSchema } from '../../schemas';

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
  tipo: 'PRIVADA',
  inscricao_estadual: '',
  logradouro: '',
  logradouro_numero: '',
  cep: '',
  cidade: '',
  estado: '',
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
    <Dialog data-testid="empresa-form-dialog" open={open} onClose={onClose}>
      <DialogTitle>{isEditing ? 'Editar' : 'Adicionar'} Empresa</DialogTitle>

      <Form methods={methods} onSubmit={handleSubmit}>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            Preencha os campos abaixo para {isEditing ? 'editar' : 'adicionar'} a empresa.
          </Typography>

          <Typography variant="caption" sx={{ color: 'text.secondary', mb: 2, display: 'block' }}>
            * Campos obrigatórios
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Select required name="tipo" label="Tipo">
                {TIPO_EMPRESA_OPTIONS.map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Field.Select>
            </Grid>
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
            <Grid size={{ md: 12, sm: 12 }}>
              <Field.Text name="inscricao_estadual" label="Inscrição Estadual" />
            </Grid>
            <Grid size={{ md: 8, sm: 12 }}>
              <Field.Text required name="logradouro" label="Logradouro" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text
                required
                name="logradouro_numero"
                label="Número"
                inputProps={{ inputMode: 'numeric' }}
              />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text
                required
                name="cep"
                label="CEP"
                placeholder="70040020"
                inputProps={{ maxLength: 8, inputMode: 'numeric' }}
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text required name="cidade" label="Cidade" />
            </Grid>
            <Grid size={{ md: 2, sm: 12 }}>
              <Field.Text
                required
                name="estado"
                label="UF"
                placeholder="DF"
                inputProps={{ maxLength: 2 }}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            data-testid="empresa-form-cancel"
            onClick={onClose}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            data-testid="empresa-form-submit"
            type="submit"
            variant="contained"
            color="primary"
            loading={isLoading}
            disabled={isLoading}
          >
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Form>
    </Dialog>
  );
};
