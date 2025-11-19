import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Step from '@mui/material/Step';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Container from '@mui/material/Container';
import StepLabel from '@mui/material/StepLabel';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import StepContent from '@mui/material/StepContent';

// ----------------------------------------------------------------------

const PHASES = [
  {
    label: 'Fase 1: Cadastro e Qualificação',
    description: 'Reeducando preenche Ficha Cadastral',
    details: [
      'Dados pessoais e profissionais',
      'Artigos penais e regime',
      'Escolaridade e experiência',
    ],
    status: 'AGUARDANDO_VALIDACAO',
  },
  {
    label: 'Fase 2: Matching Inteligente',
    description: 'Sistema calcula compatibilidade',
    details: [
      'Algoritmo analisa 4 critérios',
      'Score de 0-100% por candidato',
      'Top 5 candidatos exibidos',
    ],
    status: 'EM_PROCESSO_MATCH',
  },
  {
    label: 'Fase 3: Aprovação',
    description: 'Servidor escolhe candidato',
    details: [
      'Visualiza Top 5 recomendados',
      'Pode aceitar ou escolher manualmente',
      'Justificativa obrigatória se manual',
    ],
    status: 'AGUARDANDO_CONTRATO',
  },
  {
    label: 'Fase 4: Assinatura',
    description: 'Contrato gerado e assinado',
    details: [
      'Sistema gera PDF do contrato',
      'Reeducando assina na unidade',
      'Upload do documento assinado',
    ],
    status: 'AGUARDANDO_ASSINATURA',
  },
  {
    label: 'Fase 5: Trabalho Ativo',
    description: 'Reeducando trabalhando',
    details: [
      'Acompanhamento contínuo',
      'Registro de frequência',
      'Avaliações de desempenho',
    ],
    status: 'TRABALHANDO',
  },
];

// ----------------------------------------------------------------------

export function HowItWorksSection() {
  return (
    <Box id="como-funciona" sx={{ bgcolor: 'background.neutral', py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{ mb: 2 }}>
          Como Funciona o SAGEP?
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 8 }}>
          5 fases do cadastro à alocação efetiva
        </Typography>
        
        <Stepper orientation="vertical">
          {PHASES.map((phase, index) => (
            <Step key={index} active expanded>
              <StepLabel>
                <Typography variant="h6">{phase.label}</Typography>
              </StepLabel>
              <StepContent>
                <Card>
                  <CardContent>
                    <Typography variant="subtitle1" gutterBottom>
                      {phase.description}
                    </Typography>
                    <Stack component="ul" spacing={0.5} sx={{ pl: 2, mb: 2 }}>
                      {phase.details.map((detail, idx) => (
                        <Typography key={idx} variant="body2" color="text.secondary" component="li">
                          {detail}
                        </Typography>
                      ))}
                    </Stack>
                    <Chip label={`Status: ${phase.status}`} size="small" color="primary" />
                  </CardContent>
                </Card>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Container>
    </Box>
  );
}

