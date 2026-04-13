import type { ReactNode } from 'react';
import type { ContratoPreviewDto } from 'src/api/empresa-convenios/empresa-convenios';
import type { CodigoTemplateContrato } from 'src/api/empresa-convenios/convenio-contrato-catalog';
import type { ResponsavelBeneficio, TipoCalculoRemuneracao } from 'src/api/empresa-convenios/convenio-enums';

import { useParams, useNavigate } from 'react-router';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';

import { formatCnpj } from 'src/utils/format-string';
import { formatDateToDDMMYYYY } from 'src/utils/format-date';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { regimesOptions } from '../data';
import { useContratoPreview } from '../hooks/use-contrato-preview';

const formatBRL = (value: number): string =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const formatCepDisplay = (cep?: string | null): string => {
  const digits = (cep || '').replace(/\D/g, '');
  if (digits.length !== 8) return cep || '—';
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
};

const modalidadeLabels: Record<string, string> = {
  INTRAMUROS: 'Intramuros',
  EXTRAMUROS: 'Extramuros',
};

const tipoCalculoLabels: Record<TipoCalculoRemuneracao, string> = {
  MENSAL: 'Mensal',
  HORA: 'Por hora',
  HIBRIDO: 'Híbrido',
};

const responsavelBeneficioLabels: Record<ResponsavelBeneficio, string> = {
  FUNAP: 'FUNAP',
  EMPRESA: 'Contratante (empresa)',
  NENHUM: 'Não aplicável',
};

const tipoResponsavelLabels: Record<string, string> = {
  REPRESENTANTE_LEGAL: 'Representante legal',
  PREPOSTO_OPERACIONAL: 'Preposto operacional',
};

const NIVEIS_ORDEM: Array<'I' | 'II' | 'III'> = ['I', 'II', 'III'];

const templatePorCodigo: Record<
  CodigoTemplateContrato,
  { titulo: string; descricao: string }
> = {
  PADRAO_FUNAP: {
    titulo: 'Padrão FUNAP',
    descricao:
      'Montagem do preview segue o perfil FUNAP. Campos obrigatórios e cláusulas finais no PDF ainda serão parametrizados por este código.',
  },
  PADRAO_FUNAP_BENEFICIOS_CONTRATANTE: {
    titulo: 'FUNAP — benefícios pelo contratante',
    descricao:
      'Modelo orientado a transporte/alimentação assumidos pelo contratante. Use a política de benefícios e o resumo jurídico abaixo como base da cláusula.',
  },
  PADRAO_BONIFICACAO: {
    titulo: 'Bonificação / produtividade',
    descricao:
      'Ênfase em bônus por produtividade quando habilitado; confira tabela e percentuais na seção de remuneração.',
  },
  PADRAO_INTRAMUROS: {
    titulo: 'Intramuros',
    descricao:
      'Jornada, escala e horários são obrigatórios neste modelo (ex.: escala 12x36 e faixas de horário). O preview destaca esta seção para conferência da cláusula.',
  },
  PADRAO_ORGAO_PUBLICO_GDF: {
    titulo: 'Órgão público — GDF',
    descricao:
      'Exige quantitativo por nível I, II e III maior que zero; a soma deve respeitar o máximo de reeducandos quando informado.',
  },
};

const regimeLabel = (code: number): string =>
  regimesOptions.find((o) => Number(o.value) === code)?.label ?? String(code);

const computeSumQuantidadesNivel = (data: ContratoPreviewDto): number =>
  (data.quantidade_nivel_i ?? 0) + (data.quantidade_nivel_ii ?? 0) + (data.quantidade_nivel_iii ?? 0);

const quantidadeNoNivel = (data: ContratoPreviewDto, nivel: 'I' | 'II' | 'III'): number => {
  if (nivel === 'I') return data.quantidade_nivel_i ?? 0;
  if (nivel === 'II') return data.quantidade_nivel_ii ?? 0;
  return data.quantidade_nivel_iii ?? 0;
};

const hasJornadaPreenchida = (data: ContratoPreviewDto): boolean =>
  Boolean(
    data.jornada_tipo?.trim() ||
      data.carga_horaria_semanal != null ||
      data.escala?.trim() ||
      data.horario_inicio?.trim() ||
      data.horario_fim?.trim(),
  );

const papelBeneficio = (t: ResponsavelBeneficio): string => {
  if (t === 'FUNAP') return 'FUNAP';
  if (t === 'EMPRESA') return 'contratante (empresa contratada)';
  return 'não aplicável a este benefício';
};

const buildResumoBeneficiosConvenio = (
  rb: ContratoPreviewDto['remuneracao_beneficios']
): string => {
  const variacao = rb.beneficio_variavel_por_dia
    ? 'Os valores podem variar conforme os dias efetivamente trabalhados.'
    : 'Valores tratados como referência fixa (sem variação por dia).';
  return (
    `Transporte: ${papelBeneficio(rb.transporte_responsavel)}. ` +
    `Alimentação: ${papelBeneficio(rb.alimentacao_responsavel)}. ` +
    `${variacao} Valores: transporte ${formatBRL(rb.valor_transporte)}, alimentação ${formatBRL(rb.valor_alimentacao)}.`
  );
};

const PreviewSection = ({
  title,
  chip,
  children,
}: {
  title: string;
  chip?: ReactNode;
  children: ReactNode;
}) => (
  <Stack spacing={1.5} sx={{ mb: 3 }}>
    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
      <Typography variant="subtitle1" fontWeight={600}>
        {title}
      </Typography>
      {chip}
    </Stack>
    {children}
  </Stack>
);

const PreviewField = ({ label, value }: { label: string; value: ReactNode }) => (
  <Stack spacing={0.25}>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value ?? '—'}</Typography>
  </Stack>
);

function renderPreviewBody(data: ContratoPreviewDto) {
  const codigo = data.template_codigo;
  const meta = templatePorCodigo[codigo];
  const isIntramuros = codigo === 'PADRAO_INTRAMUROS';
  const isGdf = codigo === 'PADRAO_ORGAO_PUBLICO_GDF';
  const somaNiveis = computeSumQuantidadesNivel(data);
  const maxR = data.max_reeducandos;
  const maxNum = maxR != null && maxR > 0 ? maxR : null;
  const gdfNivelInvalido = isGdf && NIVEIS_ORDEM.some((nio) => quantidadeNoNivel(data, nio) <= 0);
  return (
    <Stack divider={<Divider flexItem />} spacing={0}>
      <PreviewSection title="Modelo de contrato">
        <Alert severity="info" sx={{ mb: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            {meta.titulo}
          </Typography>
          <Typography variant="body2">{meta.descricao}</Typography>
        </Alert>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
          <PreviewField label="Template" value={data.template.nome} />
          <PreviewField label="Código" value={data.template_codigo} />
          <Chip size="small" label={meta.titulo} color="primary" variant="outlined" />
        </Stack>
      </PreviewSection>

      <PreviewSection title="Contratada">
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <PreviewField label="Razão social" value={data.empresa.razao_social} />
          <PreviewField label="CNPJ" value={formatCnpj(data.empresa.cnpj)} />
        </Stack>
      </PreviewSection>

      <PreviewSection title="Convênio">
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Modalidade"
              value={modalidadeLabels[data.modalidade_execucao] ?? data.modalidade_execucao}
            />
            <PreviewField
              label="Vigência"
              value={`${formatDateToDDMMYYYY(data.data_inicio)} — ${data.data_fim ? formatDateToDDMMYYYY(data.data_fim) : 'Sem data fim'}`}
            />
          </Stack>
          <PreviewField
            label="Regimes permitidos"
            value={data.regimes_permitidos.map(regimeLabel).join(', ') || '—'}
          />
          <PreviewField
            label="Artigos vedados (cód.)"
            value={data.artigos_vedados.length ? data.artigos_vedados.join(', ') : '—'}
          />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField label="Máx. reeducandos" value={data.max_reeducandos ?? '—'} />
            <PreviewField
              label="Variação de quantidade"
              value={data.permite_variacao_quantidade ? 'Sim' : 'Não'}
            />
          </Stack>

          <Typography variant="subtitle2">Quantitativo por nível (convênio)</Typography>
          <Stack spacing={0.75}>
            {NIVEIS_ORDEM.map((nio) => {
              const q = quantidadeNoNivel(data, nio);
              return (
                <Typography key={nio} variant="body2">
                  <strong>Nível {nio}</strong> = {q}
                </Typography>
              );
            })}
          </Stack>
          <Table size="small" sx={{ maxWidth: 480 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nível</TableCell>
                <TableCell align="right">Quantidade</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {NIVEIS_ORDEM.map((nio) => (
                <TableRow key={nio}>
                  <TableCell>{nio}</TableCell>
                  <TableCell align="right">{quantidadeNoNivel(data, nio)}</TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>Total (I + II + III)</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>{somaNiveis}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
          {maxNum != null ? (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Comparativo com o máximo de reeducandos informado: <strong>{maxNum}</strong>.
              </Typography>
              {somaNiveis > maxNum ? (
                <Alert severity="error">
                  A soma dos níveis ({somaNiveis}) ultrapassa o máximo ({maxNum}). Corrija no cadastro —
                  estado inconsistente para cláusula contratual.
                </Alert>
              ) : null}
              {somaNiveis < maxNum ? (
                <Alert severity="warning">
                  A soma dos níveis ({somaNiveis}) é menor que o máximo ({maxNum}). Se o contrato exigir
                  aderência exata, ajuste os quantitativos ou o teto.
                </Alert>
              ) : null}
              {somaNiveis === maxNum ? (
                <Alert severity="success" variant="outlined">
                  Soma dos níveis igual ao máximo informado ({maxNum}).
                </Alert>
              ) : null}
            </Stack>
          ) : null}
          {isGdf && gdfNivelInvalido ? (
            <Alert severity="error">
              Modelo GDF exige quantidade <strong>maior que zero</strong> nos níveis I, II e III.
            </Alert>
          ) : null}
        </Stack>
      </PreviewSection>

      <PreviewSection title="Distribuição das vagas por profissão">
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Distribuição operacional das vagas conforme cadastrado no convênio (independente de catálogos).
        </Typography>
        {data.distribuicao_profissoes.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Profissão</TableCell>
                <TableCell align="right">Qtd.</TableCell>
                <TableCell>Nível</TableCell>
                <TableCell>Obs.</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.distribuicao_profissoes.map((row) => (
                <TableRow key={row.convenio_vaga_id}>
                  <TableCell>{row.profissao_nome ?? row.profissao_id}</TableCell>
                  <TableCell align="right">{row.quantidade}</TableCell>
                  <TableCell>{row.nivel ?? '—'}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {row.observacao || '—'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell>
                  <strong>Total (linhas)</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {data.distribuicao_profissoes.reduce((s, r) => s + r.quantidade, 0)}
                  </strong>
                </TableCell>
                <TableCell colSpan={2} />
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhuma profissão informada na distribuição.
          </Typography>
        )}
        {data.observacao_operacional ? (
          <Box sx={{ mt: 2 }}>
            <PreviewField
              label="Observação operacional"
              value={
                <Typography component="span" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {data.observacao_operacional}
                </Typography>
              }
            />
          </Box>
        ) : null}
      </PreviewSection>

      {isIntramuros || hasJornadaPreenchida(data) ? (
        <PreviewSection
          title="Jornada, escala e horários"
          chip={
            isIntramuros ? (
              <Chip size="small" color="warning" label="Obrigatório neste template (intramuros)" />
            ) : null
          }
        >
          <Stack spacing={2}>
            {isIntramuros && !hasJornadaPreenchida(data) ? (
              <Alert severity="warning">
                Template intramuros exige tipo de jornada, carga horária semanal, escala e horários de
                início e fim — dados ausentes no cadastro.
              </Alert>
            ) : null}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <PreviewField label="Tipo de jornada" value={data.jornada_tipo || '—'} />
              <PreviewField
                label="Carga horária semanal (h)"
                value={data.carga_horaria_semanal ?? '—'}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <PreviewField label="Escala" value={data.escala || '—'} />
              <PreviewField
                label="Horário"
                value={
                  data.horario_inicio || data.horario_fim
                    ? `${data.horario_inicio ?? '—'} às ${data.horario_fim ?? '—'}`
                    : '—'
                }
              />
            </Stack>
          </Stack>
        </PreviewSection>
      ) : (
        <PreviewSection title="Jornada, escala e horários">
          <Typography variant="body2" color="text.secondary">
            Não preenchido para este modelo. No template <strong>Intramuros</strong>, estes campos são
            obrigatórios.
          </Typography>
        </PreviewSection>
      )}

      <PreviewSection title="Seguro de acidente pessoal">
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Seguro acidente"
              value={data.possui_seguro_acidente ? 'Sim' : 'Não'}
            />
            <PreviewField label="Tipo de cobertura" value={data.tipo_cobertura_seguro || '—'} />
          </Stack>
          {data.observacao_seguro ? (
            <PreviewField label="Observações do seguro" value={data.observacao_seguro} />
          ) : null}
        </Stack>
      </PreviewSection>

      <PreviewSection
        title="Remuneração e benefícios"
        chip={
          codigo === 'PADRAO_BONIFICACAO' ? (
            <Chip size="small" label="Ênfase em bonificação" variant="outlined" />
          ) : null
        }
      >
        <Stack spacing={2}>
          {codigo === 'PADRAO_BONIFICACAO' ? (
            <Alert severity="info">
              Confira bônus por produtividade, percentuais e tabela abaixo — este modelo prioriza a cláusula
              de bonificação quando habilitada.
            </Alert>
          ) : null}
          {codigo === 'PADRAO_FUNAP_BENEFICIOS_CONTRATANTE' ? (
            <Alert severity="info">
              Os valores abaixo refletem o que foi salvo no convênio (transporte/alimentação e responsáveis).
            </Alert>
          ) : null}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Tipo de cálculo"
              value={tipoCalculoLabels[data.remuneracao_beneficios.tipo_calculo_remuneracao]}
            />
            <PreviewField
              label="Usa nível"
              value={data.remuneracao_beneficios.usa_nivel ? 'Sim' : 'Não'}
            />
          </Stack>
          <Table size="small" sx={{ maxWidth: 400 }}>
            <TableHead>
              <TableRow>
                <TableCell>Nível</TableCell>
                <TableCell align="right">Valor (bolsa)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {NIVEIS_ORDEM.map((nio) => {
                const v =
                  nio === 'I'
                    ? data.remuneracao_beneficios.valor_nivel_i
                    : nio === 'II'
                      ? data.remuneracao_beneficios.valor_nivel_ii
                      : data.remuneracao_beneficios.valor_nivel_iii;
                return (
                  <TableRow key={nio}>
                    <TableCell>{nio}</TableCell>
                    <TableCell align="right">{v != null ? formatBRL(Number(v)) : '—'}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Divider />
          <Typography variant="body2" fontWeight={600}>
            Benefícios (dados do convênio)
          </Typography>
          <Alert severity="info" icon={false}>
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
              Resumo para cláusula
            </Typography>
            <Typography variant="body2">{buildResumoBeneficiosConvenio(data.remuneracao_beneficios)}</Typography>
          </Alert>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Transporte"
              value={responsavelBeneficioLabels[data.remuneracao_beneficios.transporte_responsavel]}
            />
            <PreviewField
              label="Alimentação"
              value={responsavelBeneficioLabels[data.remuneracao_beneficios.alimentacao_responsavel]}
            />
          </Stack>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Valor transporte"
              value={formatBRL(data.remuneracao_beneficios.valor_transporte)}
            />
            <PreviewField
              label="Valor alimentação"
              value={formatBRL(data.remuneracao_beneficios.valor_alimentacao)}
            />
          </Stack>
          <PreviewField
            label="Varia conforme dias trabalhados"
            value={data.remuneracao_beneficios.beneficio_variavel_por_dia ? 'Sim' : 'Não'}
          />
          {data.remuneracao_beneficios.observacao_beneficio ? (
            <PreviewField
              label="Observação benefício"
              value={
                <Typography component="span" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {data.remuneracao_beneficios.observacao_beneficio}
                </Typography>
              }
            />
          ) : null}
          <Divider />
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <PreviewField
              label="Bônus produtividade"
              value={data.permite_bonus_produtividade ? 'Sim' : 'Não'}
            />
            <PreviewField label="% Gestão" value={data.percentual_gestao ?? '—'} />
            <PreviewField label="% Contrapartida" value={data.percentual_contrapartida ?? '—'} />
          </Stack>
          {data.bonus_produtividade_descricao ? (
            <PreviewField
              label="Descrição do bônus"
              value={
                <Typography component="span" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {data.bonus_produtividade_descricao}
                </Typography>
              }
            />
          ) : null}
          {data.bonus_produtividade_tabela_json && data.bonus_produtividade_tabela_json.length > 0 ? (
            <PreviewField
              label="Tabela JSON (bônus)"
              value={
                <Typography component="span" variant="caption" sx={{ fontFamily: 'monospace' }}>
                  {JSON.stringify(data.bonus_produtividade_tabela_json)}
                </Typography>
              }
            />
          ) : null}
          {data.tabela_produtividade ? (
            <Stack spacing={1}>
              <Typography variant="caption" color="text.secondary">
                Tabela cadastrada: {data.tabela_produtividade.nome}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Código / faixa</TableCell>
                    <TableCell>Descrição</TableCell>
                    <TableCell align="right">% ou valor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.tabela_produtividade.itens.map((it) => (
                    <TableRow key={it.tabela_produtividade_item_id}>
                      <TableCell>{it.codigo_ou_faixa}</TableCell>
                      <TableCell>{it.descricao || '—'}</TableCell>
                      <TableCell align="right">{it.percentual_ou_valor}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          ) : null}
        </Stack>
      </PreviewSection>

      <PreviewSection title="Cláusulas e observações">
        <Stack spacing={2}>
          {(
            [
              'observacao_juridica',
              'clausula_adicional',
              'descricao_complementar_objeto',
              'observacao_operacional',
              'observacoes',
            ] as const
          ).flatMap((key) => {
            const v = data[key];
            if (typeof v !== 'string' || !v.trim()) return [];
            const labels = {
              observacao_juridica: 'Observação jurídica',
              clausula_adicional: 'Cláusula adicional',
              descricao_complementar_objeto: 'Descrição complementar do objeto',
              observacao_operacional: 'Observação operacional',
              observacoes: 'Observações gerais',
            } as const;
            return [
              <PreviewField
                key={key}
                label={labels[key]}
                value={
                  <Typography component="span" variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                    {v}
                  </Typography>
                }
              />,
            ];
          })}
        </Stack>
      </PreviewSection>

      <PreviewSection title="Responsáveis">
        {data.responsaveis.length ? (
          <Stack spacing={2}>
            {data.responsaveis.map((r) => (
              <Box
                key={`${r.tipo}-${r.nome}`}
                sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1, p: 2 }}
              >
                <Typography variant="subtitle2" gutterBottom>
                  {tipoResponsavelLabels[r.tipo] ?? r.tipo}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <PreviewField label="Nome" value={r.nome} />
                  <PreviewField label="Cargo" value={r.cargo || '—'} />
                  <PreviewField label="Documento" value={r.documento || '—'} />
                </Stack>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 1 }}>
                  <PreviewField label="E-mail" value={r.email || '—'} />
                  <PreviewField label="Telefone" value={r.telefone || '—'} />
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum responsável cadastrado.
          </Typography>
        )}
      </PreviewSection>

      <PreviewSection title="Locais de execução">
        {data.locais_execucao.length ? (
          <Stack spacing={2}>
            {data.locais_execucao.map((loc) => (
              <Box
                key={loc.local_id}
                sx={{ border: (t) => `1px solid ${t.palette.divider}`, borderRadius: 1, p: 2 }}
              >
                <Typography variant="body2">
                  {[loc.logradouro, loc.numero].filter(Boolean).join(', ')}
                  {loc.complemento ? ` — ${loc.complemento}` : ''}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {[loc.bairro, loc.cidade, loc.estado].filter(Boolean).join(' · ')}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  CEP {formatCepDisplay(loc.cep)}
                  {loc.referencia ? ` · Ref.: ${loc.referencia}` : ''}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Nenhum local cadastrado.
          </Typography>
        )}
      </PreviewSection>
    </Stack>
  );
}

export default function ConvenioContratoPreviewPage() {
  const navigate = useNavigate();
  const { convenioId } = useParams<{ convenioId: string }>();
  const { data, isLoading, isError, error, refetch } = useContratoPreview(convenioId);

  const handlePrint = (): void => {
    window.print();
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Preview do contrato"
        links={[
          { name: 'Laboral' },
          { name: 'Convênios', href: paths.laboral.convenios.root },
          { name: 'Preview do contrato' },
        ]}
        action={
          <Stack direction="row" spacing={1} sx={{ '@media print': { display: 'none' } }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
              onClick={() =>
                convenioId
                  ? navigate(paths.laboral.convenios.edit(convenioId))
                  : navigate(paths.laboral.convenios.root)
              }
            >
              Voltar à edição
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:printer-minimalistic-bold" />}
              onClick={handlePrint}
              disabled={!data}
            >
              Imprimir
            </Button>
          </Stack>
        }
        sx={{ mb: { xs: 3, md: 5 }, '@media print': { mb: 2 } }}
      />

      {isError ? (
        <Alert severity="error" action={<Button onClick={() => refetch()}>Tentar novamente</Button>}>
          {(error as Error)?.message ?? 'Não foi possível carregar o preview do contrato.'}
        </Alert>
      ) : data ? (
        <Card
          id="contrato-preview-documento"
          sx={{
            p: { xs: 2, md: 4 },
            '@media print': { boxShadow: 'none', borderRadius: 0 },
          }}
        >
          <Typography variant="h5" sx={{ mb: 1 }}>
            Pré-visualização contratual
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Documento informativo para conferência dos dados cadastrados no convênio. O layout segue o
            código do template selecionado; a geração do PDF definitivo usará o mesmo perfil.
          </Typography>
          {renderPreviewBody(data)}
        </Card>
      ) : null}
    </DashboardContent>
  );
}
