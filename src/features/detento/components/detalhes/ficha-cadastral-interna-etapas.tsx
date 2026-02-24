import { useFormContext } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { getProfissoes } from 'src/api/profissoes/profissoes';
import { ArticlesSelector } from 'src/features/artigos-penais/components/articles-selector';
import { useProfissoesAutocomplete } from 'src/features/empresa-convenios/hooks/use-profissoes-options';

import { Field } from 'src/components/hook-form';
import { EnderecoForm } from 'src/components/forms/endereco-form';

import {
  getRegimeOptions,
  getEscolaridadeOptions,
  getDisponibilidadeTrabalhoOptions,
} from 'src/types/prisional';

import { FichaDocumentosField } from '../ficha-documentos-field';

const ORGAOS_EXPEDIDORES = [
  { value: 'SSP', label: 'SSP - Secretaria de Segurança Pública' },
  { value: 'DIC', label: 'DIC - Diretoria de Identificação Civil' },
  { value: 'PC', label: 'PC - Polícia Civil' },
  { value: 'IFP', label: 'IFP - Instituto Félix Pacheco' },
  { value: 'IGP', label: 'IGP - Instituto Geral de Perícias' },
  { value: 'ITEP', label: 'ITEP - Instituto Técnico-Científico de Perícia' },
  { value: 'SEJUSP', label: 'SEJUSP - Secretaria de Justiça e Segurança Pública' },
  { value: 'SEJSP', label: 'SEJSP - Secretaria de Justiça e Segurança Pública' },
  { value: 'SESP', label: 'SESP - Secretaria de Segurança Pública' },
  { value: 'SESPAP', label: 'SESPAP - Secretaria de Segurança e Administração Penitenciária' },
  { value: 'SESDEC', label: 'SESDEC - Secretaria de Estado de Defesa e Cidadania' },
  { value: 'DETRAN', label: 'DETRAN - Departamento de Trânsito' },
  { value: 'DGPC', label: 'DGPC - Diretoria Geral da Polícia Civil' },
  { value: 'DPMAF', label: 'DPMAF - Divisão de Polícia Marítima, Aérea e de Fronteiras' },
  { value: 'PF', label: 'PF - Polícia Federal' },
  { value: 'DPF', label: 'DPF - Departamento de Polícia Federal' },
  { value: 'PM', label: 'PM - Polícia Militar' },
  { value: 'PTC', label: 'PTC - Polícia Técnico-Científica' },
  { value: 'POLITEC', label: 'POLITEC - Polícia Técnico-Científica' },
];

const ESTADOS_BRASILEIROS = [
  { value: 'AC', label: 'AC - Acre' },
  { value: 'AL', label: 'AL - Alagoas' },
  { value: 'AP', label: 'AP - Amapá' },
  { value: 'AM', label: 'AM - Amazonas' },
  { value: 'BA', label: 'BA - Bahia' },
  { value: 'CE', label: 'CE - Ceará' },
  { value: 'DF', label: 'DF - Distrito Federal' },
  { value: 'ES', label: 'ES - Espírito Santo' },
  { value: 'GO', label: 'GO - Goiás' },
  { value: 'MA', label: 'MA - Maranhão' },
  { value: 'MT', label: 'MT - Mato Grosso' },
  { value: 'MS', label: 'MS - Mato Grosso do Sul' },
  { value: 'MG', label: 'MG - Minas Gerais' },
  { value: 'PA', label: 'PA - Pará' },
  { value: 'PB', label: 'PB - Paraíba' },
  { value: 'PR', label: 'PR - Paraná' },
  { value: 'PE', label: 'PE - Pernambuco' },
  { value: 'PI', label: 'PI - Piauí' },
  { value: 'RJ', label: 'RJ - Rio de Janeiro' },
  { value: 'RN', label: 'RN - Rio Grande do Norte' },
  { value: 'RS', label: 'RS - Rio Grande do Sul' },
  { value: 'RO', label: 'RO - Rondônia' },
  { value: 'RR', label: 'RR - Roraima' },
  { value: 'SC', label: 'SC - Santa Catarina' },
  { value: 'SP', label: 'SP - São Paulo' },
  { value: 'SE', label: 'SE - Sergipe' },
  { value: 'TO', label: 'TO - Tocantins' },
];

const REGIOES_ADMINISTRATIVAS_DF = [
  { value: 'RA I - Brasília', label: 'RA I - Brasília (Plano Piloto)' },
  { value: 'RA II - Gama', label: 'RA II - Gama' },
  { value: 'RA III - Taguatinga', label: 'RA III - Taguatinga' },
  { value: 'RA IV - Brazlândia', label: 'RA IV - Brazlândia' },
  { value: 'RA V - Sobradinho', label: 'RA V - Sobradinho' },
  { value: 'RA VI - Planaltina', label: 'RA VI - Planaltina' },
  { value: 'RA VII - Paranoá', label: 'RA VII - Paranoá' },
  { value: 'RA VIII - Núcleo Bandeirante', label: 'RA VIII - Núcleo Bandeirante' },
  { value: 'RA IX - Ceilândia', label: 'RA IX - Ceilândia' },
  { value: 'RA X - Guará', label: 'RA X - Guará' },
  { value: 'RA XI - Cruzeiro', label: 'RA XI - Cruzeiro' },
  { value: 'RA XII - Samambaia', label: 'RA XII - Samambaia' },
  { value: 'RA XIII - Santa Maria', label: 'RA XIII - Santa Maria' },
  { value: 'RA XIV - São Sebastião', label: 'RA XIV - São Sebastião' },
  { value: 'RA XV - Recanto das Emas', label: 'RA XV - Recanto das Emas' },
  { value: 'RA XVI - Lago Sul', label: 'RA XVI - Lago Sul' },
  { value: 'RA XVII - Riacho Fundo', label: 'RA XVII - Riacho Fundo' },
  { value: 'RA XVIII - Lago Norte', label: 'RA XVIII - Lago Norte' },
  { value: 'RA XIX - Candangolândia', label: 'RA XIX - Candangolândia' },
  { value: 'RA XX - Águas Claras', label: 'RA XX - Águas Claras' },
  { value: 'RA XXI - Riacho Fundo II', label: 'RA XXI - Riacho Fundo II' },
  { value: 'RA XXII - Sudoeste/Octogonal', label: 'RA XXII - Sudoeste/Octogonal' },
  { value: 'RA XXIII - Varjão', label: 'RA XXIII - Varjão' },
  { value: 'RA XXIV - Park Way', label: 'RA XXIV - Park Way' },
  { value: 'RA XXV - SCIA', label: 'RA XXV - SCIA (Estrutural)' },
  { value: 'RA XXVI - Sobradinho II', label: 'RA XXVI - Sobradinho II' },
  { value: 'RA XXVII - Jardim Botânico', label: 'RA XXVII - Jardim Botânico' },
  { value: 'RA XXVIII - Itapoã', label: 'RA XXVIII - Itapoã' },
  { value: 'RA XXIX - SIA', label: 'RA XXIX - SIA' },
  { value: 'RA XXX - Vicente Pires', label: 'RA XXX - Vicente Pires' },
  { value: 'RA XXXI - Fercal', label: 'RA XXXI - Fercal' },
  { value: 'RA XXXII - Sol Nascente/Pôr do Sol', label: 'RA XXXII - Sol Nascente/Pôr do Sol' },
  { value: 'RA XXXIII - Arniqueira', label: 'RA XXXIII - Arniqueira' },
];

type EtapaBaseProps = {
  loading: boolean;
};

type UnidadeOption = {
  id: string;
  nome: string;
};

type ProfissaoFieldProps = {
  name: string;
  label: string;
  excludeValue?: string;
  onLabelUpdate?: (id: string, nome: string) => void;
};

type EtapaExperienciaQualificacaoProps = EtapaBaseProps & {
  onProfissaoLabelUpdate?: (id: string, nome: string) => void;
};

const ProfissaoField = ({ name, label, excludeValue, onLabelUpdate }: ProfissaoFieldProps) => {
  const [profissaoInput, setProfissaoInput] = useState('');
  const [initialProfissoes, setInitialProfissoes] = useState<any[]>([]);
  const labelCache = useRef<Map<string, string>>(new Map());
  const { watch } = useFormContext();

  const {
    options: profissoes,
    loading: loadingProf,
    hasMinimum: hasMin,
  } = useProfissoesAutocomplete(profissaoInput, 3);

  const currentProfissaoId = watch(name);

  useEffect(() => {
    if (currentProfissaoId && !labelCache.current.has(String(currentProfissaoId))) {
      const api = getProfissoes();
      api
        .findAll({ page: 1, limit: 100 })
        .then((response) => {
          if (response.items) {
            setInitialProfissoes(response.items);
            response.items.forEach((p: any) => {
              labelCache.current.set(String(p.id), p.nome);
              onLabelUpdate?.(String(p.id), p.nome);
            });
          }
        })
        .catch(() => {});
    }
  }, [currentProfissaoId]);

  useEffect(() => {
    profissoes.forEach((p: any) => {
      labelCache.current.set(String(p.id), p.nome);
      onLabelUpdate?.(String(p.id), p.nome);
    });
  }, [profissoes, onLabelUpdate]);

  const allOptions = useMemo(() => {
    const combined = [...initialProfissoes, ...profissoes];
    const unique = combined.filter(
      (p, idx, self) => idx === self.findIndex((t) => String(t.id) === String(p.id))
    );
    return unique.map((p: any) => p.id);
  }, [initialProfissoes, profissoes]);

  const getOptionLabel = (id: unknown) => {
    const idStr = String(id || '');
    return labelCache.current.get(idStr) || idStr;
  };

  return (
    <Field.Autocomplete
      name={name}
      label={label}
      nullToEmptyString
      options={allOptions.filter((id) => !excludeValue || String(id) !== String(excludeValue))}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
      filterSelectedOptions
      loading={loadingProf}
      disablePortal={false}
      onInputChange={(_e: any, value: string) => setProfissaoInput(value)}
      noOptionsText="Procure uma profissão"
      slotProps={{
        textField: {
          helperText:
            !hasMin && (profissaoInput?.length || 0) > 0
              ? 'Digite ao menos 3 caracteres'
              : undefined,
        },
        popper: {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ],
        },
      }}
    />
  );
};

export function FichaCadastralInternaEtapaIdentificacaoPessoal({
  loading,
  statusValidacao,
}: EtapaBaseProps & { statusValidacao?: string }) {
  const map: Record<
    string,
    {
      label: string;
      color: 'default' | 'success' | 'warning' | 'error' | 'info';
    }
  > = {
    VALIDADO: { label: 'Validada', color: 'success' },
    AGUARDANDO_VALIDACAO: { label: 'Aguardando validação', color: 'info' },
    REQUER_CORRECAO: { label: 'Requer correção', color: 'warning' },
    REJEITADA: { label: 'Rejeitada', color: 'error' },
    FILA_DISPONIVEL: { label: 'Na fila', color: 'info' },
  };
  const conf = map[statusValidacao || ''] || {
    label: statusValidacao || '-',
    color: 'default' as const,
  };

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: 'primary.main', fontWeight: 600 }}>
          1. Identificação Pessoal
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Status da Ficha:
          </Typography>
          <Chip size="medium" label={conf.label} color={conf.color} variant="soft" sx={{ fontWeight: 600 }} />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text
            required
            name="nome"
            label="Nome completo"
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Cpf
            required
            name="cpf"
            label="CPF"
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          />
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Text required name="rg" label="RG" />
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.DatePicker name="rg_expedicao" label="Data de expedição do RG*" disableFuture />
        </Grid>
        <Grid size={{ md: 2, sm: 6 }}>
          <Field.Select required name="rg_orgao" label="Órgão expedidor" fullWidth>
            <MenuItem value="">
              <em>Órgão</em>
            </MenuItem>
            {ORGAOS_EXPEDIDORES.map((orgao) => (
              <MenuItem key={orgao.value} value={orgao.value}>
                {orgao.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid size={{ md: 2, sm: 6 }}>
          <Field.Select required name="rg_uf" label="UF do RG" fullWidth helperText="Estado emissor">
            <MenuItem value="">
              <em>UF</em>
            </MenuItem>
            {ESTADOS_BRASILEIROS.map((estado) => (
              <MenuItem key={estado.value} value={estado.value}>
                {estado.value}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid size={{ md: 5, sm: 12 }}>
          <Field.DatePicker
            name="data_nascimento"
            label="Data de nascimento*"
            disableFuture
            disabled
            slotProps={{
              textField: {
                helperText: 'Campo preenchido automaticamente com os dados do cadastro do detento',
              },
            }}
          />
        </Grid>
        <Grid size={{ md: 5, sm: 12 }}>
          <Field.Text required name="naturalidade" label="Naturalidade (Cidade)" />
        </Grid>
        <Grid size={{ md: 2, sm: 12 }}>
          <Field.Select required name="naturalidade_uf" label="UF" fullWidth helperText="Estado de nascimento">
            <MenuItem value="">
              <em>UF</em>
            </MenuItem>
            {ESTADOS_BRASILEIROS.map((estado) => (
              <MenuItem key={estado.value} value={estado.value}>
                {estado.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text
            required
            name="filiacao_mae"
            label="Nome da mãe"
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text name="filiacao_pai" label="Nome do pai (ou N/D)" />
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaSituacaoPrisional({
  loading,
  unidades,
}: EtapaBaseProps & { unidades: UnidadeOption[] }) {
  const { setValue } = useFormContext();

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        2. Situação Prisional
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Select
            required
            name="regime"
            label="Regime"
            fullWidth
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          >
            {getRegimeOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Select
            required
            name="unidade_prisional"
            label="Unidade prisional"
            fullWidth
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          >
            {unidades.map((u) => (
              <MenuItem key={u.id} value={u.nome}>
                {u.nome}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
        <Grid size={{ md: 4, sm: 12 }}>
          <Field.Text
            name="prontuario"
            label="Prontuário"
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          />
        </Grid>
        <Grid size={{ md: 12, sm: 12 }}>
          <ArticlesSelector name="artigos_penais" label="Artigos Penais" />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text
            name="sei"
            label="Número SEI (processo)"
            placeholder="Ex: 12345.123456/2024-12"
            helperText="Digite o número SEI do processo digital"
            onInput={(e: any) => {
              const input = e.target;
              const value = input.value.replace(/\D/g, '');
              let formatted = '';

              if (value.length <= 5) {
                formatted = value;
              } else if (value.length <= 11) {
                formatted = `${value.slice(0, 5)}.${value.slice(5)}`;
              } else if (value.length <= 15) {
                formatted = `${value.slice(0, 5)}.${value.slice(5, 11)}/${value.slice(11)}`;
              } else {
                formatted = `${value.slice(0, 5)}.${value.slice(5, 11)}/${value.slice(11, 15)}-${value.slice(15, 17)}`;
              }

              input.value = formatted;
              setValue('sei', value as any);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaEnderecoContato({ loading }: EtapaBaseProps) {
  const { setValue } = useFormContext();

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        3. Endereço e Contato
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <EnderecoForm disabled={loading} />
        </Grid>

        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text
            name="telefone"
            label="Telefone(s)"
            placeholder="Ex: (61) 99999-9999"
            onInput={(e: any) => {
              const input = e.target;
              const value = input.value.replace(/\D/g, '');
              let formatted = '';

              if (value.length <= 2) {
                formatted = value;
              } else if (value.length <= 6) {
                formatted = `(${value.slice(0, 2)}) ${value.slice(2)}`;
              } else if (value.length <= 10) {
                formatted = `(${value.slice(0, 2)}) ${value.slice(2, 6)}-${value.slice(6)}`;
              } else {
                formatted = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7, 11)}`;
              }

              input.value = formatted;
              setValue('telefone', value as any);
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaEscolaridadeSaude({ loading }: EtapaBaseProps) {
  const { watch, setValue } = useFormContext();
  const regiaoPermitida = watch('regiao_administrativa');

  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main', fontWeight: 600 }}>
        4. Escolaridade e Saúde
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Select
            required
            name="escolaridade"
            label="Escolaridade"
            fullWidth
            disabled
            helperText="Campo preenchido automaticamente com os dados do cadastro do detento"
          >
            {getEscolaridadeOptions().map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
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
          <Field.Select
            name="regiao_bloqueada"
            label="Região Administrativa onde não pode trabalhar"
            fullWidth
            helperText="Selecione a RA onde o detento não pode trabalhar (diferente da região onde pode trabalhar)"
            onChange={(e: any) => {
              const selectedValue = e.target.value;
              if (selectedValue && regiaoPermitida === selectedValue) {
                setValue('regiao_administrativa', '');
              }
              setValue('regiao_bloqueada', selectedValue as any);
            }}
          >
            <MenuItem value="">
              <em>Selecione uma RA</em>
            </MenuItem>
            {REGIOES_ADMINISTRATIVAS_DF.filter(
              (ra) => !regiaoPermitida || ra.value !== regiaoPermitida
            ).map((ra) => (
              <MenuItem key={ra.value} value={ra.value}>
                {ra.label}
              </MenuItem>
            ))}
          </Field.Select>
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaExperienciaQualificacao({
  loading,
  onProfissaoLabelUpdate,
}: EtapaExperienciaQualificacaoProps) {
  const { watch, setValue } = useFormContext();
  const disponibilidadeTrabalhoOptions = getDisponibilidadeTrabalhoOptions();

  return (
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
          <Field.Autocomplete
            name="disponibilidade_trabalho"
            label="Disponibilidade de trabalho"
            nullToEmptyString
            options={disponibilidadeTrabalhoOptions.map((option) => option.value)}
            getOptionLabel={(value) =>
              disponibilidadeTrabalhoOptions.find((option) => option.value === value)?.label ||
              String(value || '')
            }
            isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
          />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Switch name="ja_trabalhou_funap" label="Já trabalhou pela FUNAP?" />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <Field.Text
            name="ano_trabalho_anterior"
            label="Ano do trabalho anterior pela FUNAP"
            placeholder="Ex: 2024"
            helperText="Digite o ano no formato AAAA"
            inputProps={{ maxLength: 4 }}
            onInput={(e: any) => {
              const input = e.target;
              let value = input.value.replace(/\D/g, '');

              if (value.length > 4) {
                value = value.slice(0, 4);
              }

              input.value = value;
              setValue('ano_trabalho_anterior', value as any);
            }}
          />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <ProfissaoField
            name="profissao_01"
            label="Profissão 01*"
            excludeValue={watch('profissao_02')}
            onLabelUpdate={onProfissaoLabelUpdate}
          />
        </Grid>
        <Grid size={{ md: 6, sm: 12 }}>
          <ProfissaoField
            name="profissao_02"
            label="Profissão 02 (opcional)"
            excludeValue={watch('profissao_01')}
            onLabelUpdate={onProfissaoLabelUpdate}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaDeclaracoesResponsaveis({ loading }: EtapaBaseProps) {
  return (
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
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export function FichaCadastralInternaEtapaDocumentos({
  loading,
  fichaCadastralId,
  detentoId,
}: EtapaBaseProps & { fichaCadastralId?: string; detentoId: string }) {
  return (
    <Box sx={{ opacity: loading ? 0.6 : 1, pointerEvents: loading ? 'none' : 'auto' }}>
      <FichaDocumentosField
        fichaId={fichaCadastralId}
        detentoId={detentoId}
        title="7. Documentos anexados*"
        helperText="Anexe imagens de documentos relevantes e nomeie cada arquivo para facilitar o controle."
      />
    </Box>
  );
}
