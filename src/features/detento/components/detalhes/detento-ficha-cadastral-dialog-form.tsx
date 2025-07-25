import type { CreateDetentoFichaCadastralSchema } from '../../schemas';

import { useEffect } from 'react';
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

import { detentoService } from '../../data';
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
  // Identificação pessoal
  nome: '',
  cpf: '',
  rg: '',
  rg_expedicao: '',
  rg_orgao_uf: '',
  data_nascimento: '',
  naturalidade: '',
  naturalidade_uf: '',
  filiacao_mae: '',
  filiacao_pai: '',
  // Situação prisional
  regime: '',
  unidade_prisional: '',
  prontuario: '',
  sei: '',
  planilha: '',
  cidade_processo: '',
  // Endereço e contato
  endereco: '',
  regiao_administrativa: '',
  telefone: '',
  // Escolaridade
  escolaridade: '',
  // Saúde
  tem_problema_saude: false,
  problema_saude: '',
  // Restrições de trabalho
  regiao_bloqueada: '',
  // Experiência e qualificação
  experiencia_profissional: '',
  fez_curso_sistema_prisional: '',
  ja_trabalhou_funap: false,
  ano_trabalho_anterior: '',
  profissao_01: '',
  profissao_02: '',
  // Declarações e responsáveis
  declaracao_veracidade: false,
  responsavel_preenchimento: '',
  assinatura: '',
  data_assinatura: '',
  site_codigo: '',
  // Metadados do formulário
  rodape_num_1: '',
  rodape_num_2: '',
  rodape_sei: '',
  // PDF gerado
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

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      await detentoService.createFichaCadastral({ ...data, detento_id: detentoId });
      alert('Ficha cadastral criada com sucesso!');
      methods.reset();
      onClose();
    },
    (errors) => {
      // Loga os erros do zod
      console.error('Zod validation errors:', errors);
    }
  );

  const handleRemovePdf = () => {
    methods.setValue('pdf_path', '');
    console.log('pdf_path', methods.getValues('pdf_path'));
  };

  useEffect(() => {
    if (isEditing) methods.reset(defaultValues);
    else methods.reset(INITIAL_VALUES);
  }, [isEditing, defaultValues, methods]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ficha Cadastral</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Preencha os campos abaixo para adicionar uma nova ficha cadastral.
        </Typography>

        <Form methods={methods} onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* 1. Identificação pessoal */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="nome" label="Nome completo" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="cpf" label="CPF" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rg" label="RG" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rg_expedicao" label="Data de expedição do RG" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rg_orgao_uf" label="Órgão expedidor/UF" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="data_nascimento" label="Data de nascimento" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="naturalidade" label="Naturalidade (Cidade)" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="naturalidade_uf" label="UF de naturalidade" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="filiacao_mae" label="Nome da mãe" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="filiacao_pai" label="Nome do pai (ou N/D)" />
            </Grid>

            {/* 2. Situação prisional */}
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="regime" label="Regime" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="unidade_prisional" label="Unidade prisional" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="prontuario" label="Prontuário" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="sei" label="Número SEI (processo)" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="planilha" label="Planilha" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="cidade_processo" label="Cidade (processo/planilha)" />
            </Grid>

            {/* 3. Endereço e contato */}
            <Grid size={{ md: 8, sm: 12 }}>
              <Field.Text name="endereco" label="Endereço completo" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="regiao_administrativa" label="Região Administrativa (RA)" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="telefone" label="Telefone(s)" />
            </Grid>

            {/* 4. Escolaridade */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="escolaridade" label="Escolaridade" />
            </Grid>

            {/* 5. Saúde */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Switch name="tem_problema_saude" label="Tem problema de saúde?" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="problema_saude" label="Qual(is) problema(s) de saúde?" />
            </Grid>

            {/* 6. Restrições de trabalho */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="regiao_bloqueada"
                label="Região Administrativa onde não pode trabalhar"
              />
            </Grid>

            {/* 7. Experiência e qualificação */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="experiencia_profissional" label="Experiência profissional" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="fez_curso_sistema_prisional"
                label="Fez curso no sistema prisional? Qual?"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Switch name="ja_trabalhou_funap" label="Já trabalhou pela FUNAP?" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text
                name="ano_trabalho_anterior"
                label="Ano do trabalho anterior pela FUNAP"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="profissao_01" label="Profissão 01" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="profissao_02" label="Profissão 02 (opcional)" />
            </Grid>

            {/* 8. Declarações e responsáveis */}
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Switch
                name="declaracao_veracidade"
                label="Declaro que as informações são verídicas"
              />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="responsavel_preenchimento" label="Quem preencheu" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="assinatura" label="Assinatura do interno/responsável" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="data_assinatura" label="Data da assinatura" />
            </Grid>
            <Grid size={{ md: 6, sm: 12 }}>
              <Field.Text name="site_codigo" label="Código/Site" />
            </Grid>

            {/* 9. Metadados do formulário */}
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rodape_num_1" label="Rodapé numérico 1" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rodape_num_2" label="Rodapé numérico 2" />
            </Grid>
            <Grid size={{ md: 4, sm: 12 }}>
              <Field.Text name="rodape_sei" label="Rodapé SEI" />
            </Grid>

            {/* PDF gerado (upload manual, se necessário) */}
            {/* <Grid size={{ sm: 12 }}><Field.Upload name="pdf_path" onDelete={handleRemovePdf} /></Grid> */}
          </Grid>
          <DialogActions>
            <Button variant="contained" color="primary" type="submit">
              Salvar
            </Button>
          </DialogActions>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
