import type { CreateDetentoFichaCadastralSchema } from '../../schemas';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Grid from '@mui/material/Grid';
import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { Form, Field } from 'src/components/hook-form';

import { createDetentoFichaCadastralSchema } from '../../schemas';

type DetentoFichaCadastralDialogFormProps = {
  detentoId: string;
  fichaCadastralId?: string;
  defaultValues?: CreateDetentoFichaCadastralSchema;
  open: boolean;
  onClose: () => void;
};

const INITIAL_VALUES: CreateDetentoFichaCadastralSchema = {
  detento_id: '',
  tem_problema_saude: false,
  regiao_bloqueada: '',
  ja_trabalhou_funap: false,
  ano_trabalho_anterior: 2000,
  pdf_path: '',
};

export const DetentoFichaCadastralDialogForm = ({
  detentoId,
  fichaCadastralId,
  defaultValues,
  open,
  onClose,
}: DetentoFichaCadastralDialogFormProps) => {
  const isEditing = !!fichaCadastralId;

  const methods = useForm({
    resolver: zodResolver(createDetentoFichaCadastralSchema),
    defaultValues: isEditing ? defaultValues : INITIAL_VALUES,
  });

  const handleSubmit = methods.handleSubmit(async (data) => {});

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ficha Cadastral</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para adicionar uma nova ficha cadastral.
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="regiao_bloqueada" label="Região bloqueada" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                type="number"
                name="ano_trabalho_anterior"
                label="Ano de trabalho anterior"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Checkbox name="tem_problema_saude" label="Tem problema de saúde" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Checkbox name="ja_trabalhou_funap" label="Já trabalhou na Funap" />
            </Grid>

            <Grid size={{ sm: 12 }}>
              <Field.Upload name="pdf_path" />
            </Grid>
          </Grid>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" type="submit" onClick={handleSubmit}>
          Salvar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
