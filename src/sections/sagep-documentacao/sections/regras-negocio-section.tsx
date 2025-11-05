import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';
import TableContainer from '@mui/material/TableContainer';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const REGRAS_FICHA_CADASTRAL = [
  {
    regra: '1 FC Ativa por Reeducando',
    tipo: 'Constraint',
    implementacao: 'Service verifica antes de criar',
    consequencia: 'ConflictException',
    cor: 'error',
    icon: 'solar:user-bold',
  },
  {
    regra: 'Mínimo 1 Imagem',
    tipo: 'Validação',
    implementacao: 'Service valida documentos',
    consequencia: 'BadRequestException',
    cor: 'warning',
    icon: 'solar:gallery-bold',
  },
  {
    regra: 'Apenas Imagens',
    tipo: 'MIME Type',
    implementacao: 'Valida image/*',
    consequencia: 'BadRequestException',
    cor: 'warning',
    icon: 'solar:gallery-check-bold',
  },
  {
    regra: 'Mínimo 1 Artigo Penal',
    tipo: 'Array',
    implementacao: '@ArrayMinSize(1)',
    consequencia: 'ValidationException',
    cor: 'error',
    icon: 'solar:document-text-bold',
  },
  {
    regra: 'CEP Obrigatório',
    tipo: 'Formato',
    implementacao: 'Regex 8 dígitos',
    consequencia: 'Form validation',
    cor: 'info',
    icon: 'solar:map-point-bold',
  },
  {
    regra: 'Blacklist Impede FC',
    tipo: 'Negócio',
    implementacao: 'Valida is_blacklisted',
    consequencia: 'ForbiddenException',
    cor: 'error',
    icon: 'solar:shield-warning-bold',
  },
];

const REGRAS_CONVENIO = [
  {
    regra: 'Artigos Vedados Globais',
    tipo: 'Escopo',
    implementacao: 'Campo no convênio',
    consequencia: 'Aplica a TODAS vagas',
    cor: 'error',
    icon: 'solar:shield-cross-bold',
  },
  {
    regra: 'Regimes por Profissão',
    tipo: 'Escopo v3.0',
    implementacao: 'Em quantitativos[]',
    consequencia: 'Cada profissão diferente',
    cor: 'info',
    icon: 'solar:buildings-bold',
  },
  {
    regra: 'Local por Profissão',
    tipo: 'Relacionamento',
    implementacao: 'local_execucao_id',
    consequencia: 'Local específico/profissão',
    cor: 'info',
    icon: 'solar:map-point-bold',
  },
  {
    regra: 'Estado do Quantitativo',
    tipo: 'Disponibilidade',
    implementacao: 'Campo estado',
    consequencia: 'Dashboard só ATIVO',
    cor: 'success',
    icon: 'solar:eye-bold',
  },
  {
    regra: 'Datas YYYY-MM-DD',
    tipo: 'Formato',
    implementacao: '@IsDateString()',
    consequencia: 'ValidationException',
    cor: 'warning',
    icon: 'solar:calendar-bold',
  },
];

const REGRAS_MATCHING = [
  {
    regra: 'Profissão Compatível',
    tipo: 'Eliminatório',
    validacao: 'FC.profissao_01 OU profissao_02 = vaga',
    acao: 'Elimina',
    cor: 'error',
  },
  {
    regra: 'Sem Artigo Vedado',
    tipo: 'Eliminatório',
    validacao: 'FC.artigos ∩ convenio.vedados = ∅',
    acao: 'Elimina',
    cor: 'error',
  },
  {
    regra: 'Regime Permitido',
    tipo: 'Eliminatório',
    validacao: 'FC.regime ∈ vaga.regimes',
    acao: 'Elimina',
    cor: 'error',
  },
  {
    regra: 'Escolaridade Mínima',
    tipo: 'Eliminatório',
    validacao: 'FC.escolaridade >= vaga.minima',
    acao: 'Elimina',
    cor: 'error',
  },
  {
    regra: 'Tempo Espera (70%)',
    tipo: 'Classificatório',
    validacao: 'Proporção data_validacao',
    acao: '0-70 pts',
    cor: 'primary',
  },
  {
    regra: 'Proximidade (30%)',
    tipo: 'Classificatório',
    validacao: 'Distância CEP (km)',
    acao: '0-30 pts',
    cor: 'success',
  },
];

const REGRAS_VAGAS = [
  {
    regra: 'Status Individual',
    descricao: 'Cada vaga tem status próprio',
    valores: 'DISPONIVEL | OCUPADA | INDISPONIBILIZADA | SUSPENSA',
    cor: 'info',
  },
  {
    regra: 'Histórico Preservado',
    descricao: 'Array de alocações passadas',
    valores: 'historico_alocacoes: jsonb[]',
    cor: 'success',
  },
  {
    regra: 'Indisponibilizar ≠ Deletar',
    descricao: 'Muda status, não remove',
    valores: 'status = INDISPONIBILIZADA',
    cor: 'warning',
  },
  {
    regra: 'Contadores Automáticos',
    descricao: 'Calcula por status',
    valores: 'COUNT(*) WHERE status = X',
    cor: 'primary',
  },
];

const REGRAS_BLACKLIST = [
  {
    regra: 'Desligamento → Blacklist',
    gatilho: 'gera_blacklist: true',
    acao: 'is_blacklisted = true',
    permanencia: 'Indefinida',
    cor: 'error',
  },
  {
    regra: 'FC Inativada Auto',
    gatilho: 'Blacklist aplicada',
    acao: 'FC.status = INATIVA',
    permanencia: 'Permanente',
    cor: 'error',
  },
  {
    regra: 'Bloqueio Nova FC',
    gatilho: 'Criar FC blacklisted',
    acao: 'ForbiddenException',
    permanencia: 'Até remoção',
    cor: 'error',
  },
];

const VALIDACOES_FRONTEND = [
  { campo: 'CEP', validacao: '8 dígitos', obrigatorio: true, exemplo: '70000000' },
  { campo: 'Artigos Penais', validacao: 'Mínimo 1', obrigatorio: true, exemplo: '["CP:157"]' },
  { campo: 'Profissão', validacao: '1 ou 2', obrigatorio: true, exemplo: 'profissao_01 obrigatória' },
  { campo: 'Escolaridade', validacao: 'Enum', obrigatorio: true, exemplo: 'MEDIO_COMPLETO' },
  { campo: 'Declaração', validacao: 'Boolean', obrigatorio: true, exemplo: 'true' },
  { campo: 'Imagens', validacao: 'Min 1', obrigatorio: true, exemplo: 'image/jpeg' },
];

// ----------------------------------------------------------------------

export function RegrasNegocioSection() {
  const theme = useTheme();

  return (
    <Stack spacing={5}>
      <Box>
        <Typography variant="h3" gutterBottom>
          📜 Regras de Negócio Consolidadas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Todas as regras, validações e constraints do sistema organizadas por módulo
        </Typography>
      </Box>

      {/* Ficha Cadastral */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📋 Regras de Ficha Cadastral
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="35%"><strong>Regra</strong></TableCell>
                  <TableCell width="20%"><strong>Tipo</strong></TableCell>
                  <TableCell width="25%"><strong>Implementação</strong></TableCell>
                  <TableCell width="20%"><strong>Consequência</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REGRAS_FICHA_CADASTRAL.map((regra, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={regra.icon as any} width={18} color={`${regra.cor}.main`} />
                        <Typography variant="body2" fontWeight={600}>{regra.regra}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={regra.tipo} size="small" color={regra.cor as any} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.implementacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.consequencia}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Convênios */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🏢 Regras de Convênios
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="35%"><strong>Regra</strong></TableCell>
                  <TableCell width="20%"><strong>Tipo</strong></TableCell>
                  <TableCell width="25%"><strong>Implementação</strong></TableCell>
                  <TableCell width="20%"><strong>Consequência</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REGRAS_CONVENIO.map((regra, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Iconify icon={regra.icon as any} width={18} color={`${regra.cor}.main`} />
                        <Typography variant="body2" fontWeight={600}>{regra.regra}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip label={regra.tipo} size="small" color={regra.cor as any} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.implementacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.consequencia}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Matching */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🎯 Regras de Matching
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="25%"><strong>Regra</strong></TableCell>
                  <TableCell width="20%"><strong>Tipo</strong></TableCell>
                  <TableCell width="40%"><strong>Validação</strong></TableCell>
                  <TableCell width="15%"><strong>Ação</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REGRAS_MATCHING.map((regra, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{regra.regra}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={regra.tipo} size="small" color={regra.cor as any} />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        {regra.validacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.acao}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Vagas */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            📍 Regras de Vagas Individuais
          </Typography>
          <Grid container spacing={2}>
            {REGRAS_VAGAS.map((regra, index) => (
              <Grid key={index} size={{ xs: 12, md: 6 }}>
                <Card
                  variant="outlined"
                  sx={{
                    height: '100%',
                    bgcolor: alpha((theme.palette as any)[regra.cor].main, 0.08),
                  }}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                      {regra.regra}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {regra.descricao}
                    </Typography>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                      {regra.valores}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Blacklist */}
      <Card sx={{ bgcolor: alpha(theme.palette.error.main, 0.08) }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            🚫 Regras de Blacklist
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="30%"><strong>Regra</strong></TableCell>
                  <TableCell width="30%"><strong>Gatilho</strong></TableCell>
                  <TableCell width="25%"><strong>Ação</strong></TableCell>
                  <TableCell width="15%"><strong>Permanência</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {REGRAS_BLACKLIST.map((regra, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{regra.regra}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {regra.gatilho}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        {regra.acao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={regra.permanencia} size="small" color={regra.cor as any} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Validações Frontend */}
      <Card>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
            ✅ Validações Frontend (Zod Schema)
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="25%"><strong>Campo</strong></TableCell>
                  <TableCell width="25%"><strong>Validação</strong></TableCell>
                  <TableCell width="20%"><strong>Obrigatório</strong></TableCell>
                  <TableCell width="30%"><strong>Exemplo</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {VALIDACOES_FRONTEND.map((val, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{val.campo}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary">
                        {val.validacao}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={val.obrigatorio ? 'SIM' : 'NÃO'}
                        size="small"
                        color={val.obrigatorio ? 'error' : 'success'}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.7rem' }}>
                        {val.exemplo}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Alertas Importantes */}
      <Stack spacing={2}>
        <Alert severity="error" icon={<Iconify icon="solar:danger-bold" width={24} {...({} as any)} />}>
          <AlertTitle>🚨 Soft Delete SEMPRE</AlertTitle>
          Sistema usa <strong>deletedAt</strong>. Histórico preservado para auditoria e compliance.
        </Alert>
        
        <Alert severity="warning">
          <AlertTitle>⚠️ Timezone nas Datas</AlertTitle>
          Backend salva UTC, frontend exibe local. Usar <code>dayjs</code> para formatar.
        </Alert>

        <Alert severity="info">
          <AlertTitle>📊 Dados para ML</AlertTitle>
          Todas decisões de matching registradas em tabela específica para treinamento futuro.
        </Alert>

        <Alert severity="success">
          <AlertTitle>✅ Formato Artigos</AlertTitle>
          idUnico da ThereTech: &quot;LEGISLACAO:CODIGO&quot; (ex: CP:157, DRG:33, LCP:28).
        </Alert>
      </Stack>
    </Stack>
  );
}


