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
    question: 'Como funciona o novo algoritmo simplificado?',
    answer: 'O SAGEP v3.0 usa apenas 2 critérios essenciais: (1) Tempo na Fila (70 pts) - FIFO RIGOROSO, quem espera mais tem prioridade absoluta; (2) Proximidade Geográfica (30 pts) - distância CEP entre reeducando e local de trabalho. Score total: 0-100%. Essa simplificação foca no que realmente importa: tempo de espera e logística. Antes de pontuar, o sistema aplica filtros eliminatórios: artigos vedados, regime incompatível e escolaridade insuficiente. Obs: Blacklist não precisa filtro no matching pois já impede Ficha Cadastral ativa.',
  },
  {
    question: 'O que é a Blacklist e como funciona?',
    answer: 'Sistema automático de controle de reeducandos com desligamentos graves. Quando um contrato é encerrado por motivos como "Desligamento por Comportamento", "Desligamento por Performance" ou "Pedido da Empresa", o reeducando é automaticamente colocado na blacklist. Consequências: (1) Ficha Cadastral atual inativada imediatamente; (2) Sistema IMPEDE criação de nova Ficha Cadastral; (3) Histórico completo preservado para auditoria. Sem Ficha Cadastral ativa, não concorre a vagas automaticamente. REMOÇÃO: Servidor pode remover da blacklist informando ocorrência com justificativa (ex: "Recurso administrativo aprovado"). Tipos que NÃO geram blacklist: "Fim de Contrato" natural, "Pedido do Reeducando", "Progressão de Regime".',
  },
  {
    question: 'Como funciona a gestão granular de vagas?',
    answer: 'Cada vaga de um convênio é controlada individualmente com status próprio: DISPONIVEL, OCUPADA, INDISPONIBILIZADA ou SUSPENSA. Você pode indisponibilizar vagas específicas a qualquer momento (ex: empresa solicitou redução temporária) sem perder histórico. Cada vaga mantém registro completo: quem ocupou, período, motivo de saída, avaliações. Exemplo: Convênio 50 pedreiros → 50 vagas individuais → Vaga #3 suspensa → 49 disponíveis → histórico preservado.',
  },
  {
    question: 'Como a Inteligência Artificial ajuda a criar ocorrências?',
    answer: 'Sistema de assistente inteligente para criar justificativas padronizadas. Quando servidor precisa registrar um desligamento, advertência ou outro evento: (1) Digita descrição livre: "Reeducando faltou 3 dias seguidos sem justificar"; (2) Inteligência Artificial sugere automaticamente: Nome="Falta Injustificada Recorrente", Tipo=DESLIGAMENTO, Gera Blacklist=true, Descrição completa formatada; (3) Servidor revisa e confirma. Ocorrências criadas manualmente também disponíveis. Objetivo: padronizar linguagem, agilizar processo, garantir consistência dos registros.',
  },
  {
    question: 'O servidor pode escolher candidatos fora do Top 5?',
    answer: 'Sim, 100% de liberdade! O servidor pode: (a) Aceitar Top 1 recomendado; (b) Escolher qualquer dos Top 5; (c) Buscar MANUALMENTE qualquer candidato na base. Quando escolhe fora do Top 5, sistema solicita justificativa obrigatória em lista de ocorrências pré-cadastradas (ex: "Indicação da Unidade Prisional", "Experiência prévia comprovada", "Solicitação da empresa"). Todas as decisões são registradas para futuro treinamento de Machine Learning. Sistema aprende com escolhas humanas.',
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

