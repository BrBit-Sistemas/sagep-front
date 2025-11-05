import { useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

import { VagasFlowSection } from '../sections/vagas-flow-section';
import { MatchingFlowSection } from '../sections/matching-flow-section';
import { BlacklistFlowSection } from '../sections/blacklist-flow-section';
import { RegrasNegocioSection } from '../sections/regras-negocio-section';
import { OcorrenciasFlowSection } from '../sections/ocorrencias-flow-section';
import { FichaCadastralFlowSection } from '../sections/ficha-cadastral-flow-section';
import { EmpresasConveniosFlowSection } from '../sections/empresas-convenios-flow-section';

// ----------------------------------------------------------------------

const SECTIONS = [
  { 
    value: 'empresas-convenios', 
    label: '🏢 Empresas & Convênios', 
    icon: 'solar:buildings-bold',
    component: EmpresasConveniosFlowSection 
  },
  { 
    value: 'ficha-cadastral', 
    label: '📋 Ficha Cadastral', 
    icon: 'solar:document-text-bold',
    component: FichaCadastralFlowSection 
  },
  { 
    value: 'matching', 
    label: '🎯 Matching + IA', 
    icon: 'solar:target-bold',
    component: MatchingFlowSection 
  },
  { 
    value: 'vagas', 
    label: '📍 Gestão de Vagas', 
    icon: 'solar:chart-square-bold',
    component: VagasFlowSection 
  },
  { 
    value: 'blacklist', 
    label: '🚫 Blacklist', 
    icon: 'solar:shield-warning-bold',
    component: BlacklistFlowSection 
  },
  { 
    value: 'ocorrencias', 
    label: '🤖 Ocorrências + IA', 
    icon: 'solar:stars-bold',
    component: OcorrenciasFlowSection 
  },
  { 
    value: 'regras', 
    label: '📜 Regras de Negócio', 
    icon: 'solar:checklist-bold',
    component: RegrasNegocioSection 
  },
];

// ----------------------------------------------------------------------

export function DocumentacaoView() {
  const [currentTab, setCurrentTab] = useState('empresas-convenios');

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  };

  const CurrentSection = SECTIONS.find((s) => s.value === currentTab)?.component;

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', py: 5 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h2" sx={{ mb: 2 }}>
            📚 Documentação Técnica - SAGEP
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Processos detalhados, regras de negócio e fluxos visuais do sistema
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ mb: 5, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              '& .MuiTab-root': {
                minHeight: 48,
                textTransform: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
              },
            }}
          >
            {SECTIONS.map((section) => (
              <Tab
                key={section.value}
                value={section.value}
                label={section.label}
                icon={<Iconify icon={section.icon as any} width={20} />}
                iconPosition="start"
              />
            ))}
          </Tabs>
        </Box>

        {/* Content */}
        {CurrentSection && <CurrentSection />}
      </Container>
    </Box>
  );
}

