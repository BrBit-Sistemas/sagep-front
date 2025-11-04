import Stack from '@mui/material/Stack';
import Accordion from '@mui/material/Accordion';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const FAQS = [
  {
    question: 'Como funciona o algoritmo de matching?',
    answer: 'O SAGEP usa um algoritmo de pontuação com 4 critérios: (1) Tempo na fila (50 pts) - FIFO rigoroso, quem espera mais tem prioridade absoluta; (2) Distância geográfica (30 pts) - calculada via CEP usando coordenadas, favorece proximidade ao local de trabalho; (3) Escolaridade (10 pts) - níveis acima do mínimo exigido ganham pontos extras; (4) Experiência (10 pts) - trabalhou na FUNAP, tem experiência na área ou fez cursos no sistema prisional. Score total: 0-100%.',
  },
  {
    question: 'O servidor pode escolher manualmente um candidato?',
    answer: 'Sim, total liberdade! O servidor pode: (a) Aceitar o Top 1 recomendado; (b) Escolher qualquer dos Top 5 sugeridos; (c) Buscar manualmente qualquer candidato fora da lista. Quando escolhe fora do Top 5, o sistema solicita justificativa em lista pré-definida (ex: "Indicação da Unidade Prisional", "Experiência prévia na FUNAP", "Recomendação da empresa"). Todas as decisões alimentam o modelo de Machine Learning futuro.',
  },
  {
    question: 'Como são verificados os artigos penais vedados?',
    answer: 'Sistema integrado com API ThereTech de Artigos Penais: 108 artigos de 5 legislações (CP, LCP, Lei de Drogas, Estatuto do Desarmamento, Lei de Lavagem). Cada artigo tem identificador único (idUnico) no formato "LEGISLACAO:CODIGO" (ex: CP:157, DRG:33, LCP:28) que diferencia artigos com mesmo número mas de leis diferentes. Verificação automática: se reeducando possui qualquer artigo vedado pelo convênio, é ELIMINADO automaticamente e não aparece nas recomendações. Zero risco de compliance.',
  },
  {
    question: 'Quanto tempo um reeducando fica na fila?',
    answer: 'Permanência VITALÍCIA até alocação ou eventos específicos: (1) Alocação em vaga; (2) Progressão/regressão de regime prisional; (3) Cumprimento total da pena; (4) Falecimento; (5) Solicitação de correção da ficha. O sistema garante prioridade FIFO: quanto mais tempo esperando, maior a pontuação relativa (até 50 pontos). Exemplo: candidato com 180 dias sempre terá mais pontos que candidato com 90 dias, mesmo em rodadas diferentes de matching.',
  },
  {
    question: 'Como funciona o Machine Learning e melhoria contínua?',
    answer: 'Sistema registra TODAS as decisões em tabela específica para ML: (1) Top 5 candidatos sugeridos com scores; (2) Candidato efetivamente escolhido; (3) Posição da escolha (1-5 ou manual); (4) Justificativa se manual; (5) Resultado posterior: contrato finalizado, motivo desligamento, avaliação empresa (1-5 estrelas), tempo trabalhado. Após 6-12 meses acumulando dados (~500+ decisões), microserviço Python + FastAPI será treinado para ajustar dinamicamente os pesos do algoritmo baseado em padrões de sucesso.',
  },
];

// ----------------------------------------------------------------------

export function FaqSection() {
  return (
    <Container maxWidth="md" sx={{ py: 10 }}>
      <Typography variant="h2" align="center" sx={{ mb: 2 }}>
        ❓ Perguntas Frequentes
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Tudo que você precisa saber sobre o SAGEP
      </Typography>
      
      <Stack spacing={2}>
        {FAQS.map((faq, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<Iconify icon="solar:alt-arrow-down-outline" {...({} as any)} />}>
              <Typography variant="subtitle1">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}

