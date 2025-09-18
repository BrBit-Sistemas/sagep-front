import type { Detento } from '../../types';
import type { CreateDetentoFichaCadastralSchema } from '../../schemas';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';

import { formatDateToDDMMYYYY, formatDateToYYYYMMDD } from 'src/utils/format-date';

import { useProfissoesOptions } from 'src/features/empresa-convenios/hooks/use-profissoes-options';
import { useUnidadePrisionalList } from 'src/features/unidades-prisionais/hooks/use-unidade-prisional-list';

import { Form, Field } from 'src/components/hook-form';

import { detentoService } from '../../data';
import { detentoKeys } from '../../hooks/keys';
import { Escolaridade, Regime } from '../../../detento/types';
import { createDetentoFichaCadastralSchema } from '../../schemas';
import { useDetentoDetalhesSearchParams } from '../../hooks/use-dentento-detalhes-search-params';

type DetentoFichaCadastralDialogFormProps = {
  detento: Detento;
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
  responsavel_preenchimento: '',
  assinatura: '',
  data_assinatura: formatDateToYYYYMMDD(new Date()),
  // PDF gerado
  pdf_path: '',
};

export const DetentoFichaCadastralDialogForm = ({
  detento,
  detentoId,
  fichaCadastralId,
  defaultValues,
  open,
  onClose,
}: DetentoFichaCadastralDialogFormProps) => {
  const isEditing = !!fichaCadastralId;
  const queryClient = useQueryClient();
  const [, setSearchParams] = useDetentoDetalhesSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: { items: unidades } = { items: [] } } = useUnidadePrisionalList({
    page: 0,
    limit: 1000,
  });

  // Find the unit name for display
  const getUnidadeName = (unidadeId: string) => {
    const unidade = unidades.find((u) => u.id === unidadeId);
    return unidade?.nome || unidadeId;
  };

  console.log('detento', detento);

  // Preenche valores iniciais com dados do detento se não for edição
  const initialValues = isEditing
    ? defaultValues
    : {
        ...INITIAL_VALUES,
        detento_id: detento.id,
        nome: detento.nome,
        cpf: detento.cpf,
        prontuario: detento.prontuario,
        data_nascimento: detento.data_nascimento
          ? formatDateToDDMMYYYY(detento.data_nascimento)
          : '',
        regime: detento.regime,
        escolaridade: detento.escolaridade,
        unidade_prisional: getUnidadeName(detento.unidade_id),
      };

  const methods = useForm({
    resolver: zodResolver(createDetentoFichaCadastralSchema),
    defaultValues: initialValues,
  });

  const { ids: profissaoIds, labelMap: profissaoLabels } = useProfissoesOptions('');

  useEffect(() => {
    const p1 = methods.watch('profissao_01');
    const p2 = methods.watch('profissao_02');
    if (p1 && p2 && String(p1) === String(p2)) {
      methods.setValue('profissao_02', '');
    }
  }, [methods.watch('profissao_01'), methods.watch('profissao_02')]);

  const handleSubmit = methods.handleSubmit(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        // Pre-validação: prontuário único (bloqueia antes da criação)
        const prontuario = String((data as any).prontuario || '').trim();
        if (prontuario) {
          const existing = await detentoService.paginate({ page: 0, limit: 1, search: prontuario });
          const found = existing.items?.find(
            (d: any) => String(d.prontuario).trim() === prontuario
          );
          if (found && found.id !== detentoId) {
            methods.setError('prontuario' as any, {
              type: 'manual',
              message: 'Prontuário não está disponível.',
            });
            setLoading(false);
            return;
          }
        }

        if (isEditing && fichaCadastralId) {
          await detentoService.updateFichaCadastral(fichaCadastralId, {
            ...data,
            detento_id: detentoId,
          });
          alert('Ficha cadastral atualizada com sucesso!');
        } else {
          await detentoService.createFichaCadastral({ ...data, detento_id: detentoId });
          alert('Ficha cadastral criada com sucesso!');
        }
        await queryClient.invalidateQueries({ queryKey: detentoKeys.fichasCadastrais(detentoId) });
        methods.reset();
        onClose();
        // Keep user on ficha cadastral tab after submit
        setSearchParams({ tab: 'ficha_cadastral' });
      } catch (err: any) {
        const status = err?.response?.status;
        let message: any = err?.response?.data?.message ?? err?.message;
        if (Array.isArray(message)) message = message.join(' ');
        if (!message || typeof message !== 'string') {
          message = err?.response?.data?.detail || 'Erro inesperado.';
        }
        if (status === 409) {
          const msg = String(message || '');
          if (
            msg.toLowerCase().includes('prontuário') ||
            msg.toLowerCase().includes('prontuario')
          ) {
            methods.setError('prontuario' as any, { type: 'manual', message: msg });
          } else {
            setError('Prontuário não está disponível.');
          }
        } else {
          setError(String(message));
        }
        console.error('Erro ao salvar ficha cadastral:', err);
      } finally {
        setLoading(false);
      }
    },
    (errors) => {
      // Loga os erros do zod
      console.error('Zod validation errors:', errors);
    }
  );

  // const handleRemovePdf = () => {
  //   methods.setValue('pdf_path', '');
  //   console.log('pdf_path', methods.getValues('pdf_path'));
  // };

  useEffect(() => {
    if (isEditing) {
      methods.reset(defaultValues);
    } else if (open) {
      // Preenche os campos com os dados do detento ao abrir para criar
      methods.reset({
        ...INITIAL_VALUES,
        detento_id: detento.id,
        nome: detento.nome,
        cpf: detento.cpf,
        prontuario: detento.prontuario,
        data_nascimento: detento.data_nascimento
          ? formatDateToDDMMYYYY(detento.data_nascimento)
          : '',
        regime: detento.regime,
        escolaridade: detento.escolaridade,
        unidade_prisional: getUnidadeName(detento.unidade_id),
      });
    }
  }, [isEditing, defaultValues, open, detento, methods, unidades]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Ficha Cadastral
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Preencha os campos abaixo para adicionar uma nova ficha cadastral.
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pb: 0 }}>
        <Form methods={methods} onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {loading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress />
              </Box>
            )}
            {/* 1. Identificação Pessoal */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                1. Identificação Pessoal
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="nome" label="Nome completo" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Cpf name="cpf" label="CPF" />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text name="rg" label="RG" />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                    <Field.DatePicker name="rg_expedicao" label="Data de expedição do RG" disableFuture />
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text name="rg_orgao_uf" label="Órgão expedidor/UF" />
                </Grid>
                <Grid size={{ md: 5, sm: 12 }}>
                    <Field.DatePicker name="data_nascimento" label="Data de nascimento" disableFuture />
                </Grid>
                <Grid size={{ md: 5, sm: 12 }}>
                  <Field.Text name="naturalidade" label="Naturalidade (Cidade)" />
                </Grid>
                <Grid size={{ md: 2, sm: 12 }}>
                    <Field.Text 
                      name="naturalidade_uf" 
                      label="UF de naturalidade" 
                      slotProps={{ 
                        inputLabel: { shrink: true },
                        input: { 
                          style: { textTransform: 'uppercase' }
                        }
                      }}
                      inputProps={{ maxLength: 2 }}
                      onChange={(e: any) => {
                        const value = e.target.value.toUpperCase().slice(0, 2);
                        e.target.value = value;
                        methods.setValue('naturalidade_uf', value);
                      }}
                    />
                  </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="filiacao_mae" label="Nome da mãe" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="filiacao_pai" label="Nome do pai (ou N/D)" />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 2. Situação Prisional */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                2. Situação Prisional
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Select name="regime_id" label="Regime" fullWidth>
                    {Object.values(Regime).map((regime) => (
                      <MenuItem key={regime} value={regime}>
                        {regime}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                    <Field.Select name="unidade_id" label="Unidade prisional" fullWidth>
                      {unidades.map((u) => (
                        <MenuItem key={u.id} value={u.id}>
                          {u.nome}
                        </MenuItem>
                      ))}
                    </Field.Select>
                </Grid>
                <Grid size={{ md: 4, sm: 12 }}>
                  <Field.Text name="prontuario" label="Prontuário" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="sei" label="Número SEI (processo)" />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 3. Endereço e Contato */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                3. Endereço e Contato
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 12, sm: 12 }}>
                  <Field.Text name="endereco" label="Endereço completo" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="regiao_administrativa" label="Região Administrativa (RA)" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="telefone" label="Telefone(s)" />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 4. Escolaridade e Saúde */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                4. Escolaridade e Saúde
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Select name="escolaridade_id" label="Escolaridade" fullWidth>
                    {Object.values(Escolaridade).map((escolaridade) => (
                      <MenuItem key={escolaridade} value={escolaridade}>
                        {escolaridade}
                      </MenuItem>
                    ))}
                  </Field.Select>
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Switch name="tem_problema_saude" label="Tem problema de saúde?" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="problema_saude" label="Qual(is) problema(s) de saúde?" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text
                    name="regiao_bloqueada"
                    label="Região Administrativa onde não pode trabalhar"
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 5. Experiência e Qualificação */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                5. Experiência e Qualificação
              </Typography>
              <Grid container spacing={2}>
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
                  <Field.Autocomplete
                    name="profissao_01"
                    label="Profissão 01"
                    nullToEmptyString
                    options={profissaoIds.filter(
                      (id: unknown) => String(id) !== String(methods.watch('profissao_02') || '')
                    )}
                    getOptionLabel={(id: unknown) => profissaoLabels.get(String(id)) || String(id)}
                    isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
                    filterSelectedOptions
                  />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Autocomplete
                    name="profissao_02"
                    label="Profissão 02 (opcional)"
                    nullToEmptyString
                    options={profissaoIds.filter(
                      (id: unknown) => String(id) !== String(methods.watch('profissao_01') || '')
                    )}
                    getOptionLabel={(id: unknown) => profissaoLabels.get(String(id)) || String(id)}
                    isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
                    filterSelectedOptions
                  />
                </Grid>
              </Grid>
            </Box>

            <Divider />

            {/* 6. Declarações e Responsáveis */}
            <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                6. Declarações e Responsáveis
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.Text name="responsavel_preenchimento" label="Nome de quem preencheu" />
                </Grid>
                <Grid size={{ md: 6, sm: 12 }}>
                  <Field.DatePicker 
                    name="data_assinatura" 
                    label="Data da abertura ficha" 
                    readOnly 
                    slotProps={{
                      textField: {
                        InputProps: {
                          readOnly: true,
                        },
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* PDF gerado (upload manual, se necessário) */}
            {/* <Box>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
                8. Documento PDF
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ sm: 12 }}>
                  <Field.Upload name="pdf_path" onDelete={handleRemovePdf} />
                </Grid>
              </Grid>
            </Box> */}
          </Box>
        </Form>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
