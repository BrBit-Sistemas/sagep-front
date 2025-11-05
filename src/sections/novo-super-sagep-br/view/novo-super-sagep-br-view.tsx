import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { CtaSection } from '../cta-section';
import { HeroSection } from '../hero-section';
import { StatsSection } from '../stats-section';
import { ModulesSection } from '../modules-section';
import { RoadmapSection } from '../roadmap-section';
import { FeaturesSection } from '../features-section';
import { TechStackSection } from '../tech-stack-section';
import { IntegrationsSection } from '../integrations-section';

// ----------------------------------------------------------------------

export function NovoSuperSagepBrView() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* Modules Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <ModulesSection />
      </Container>

      {/* Integrations Section */}
      <IntegrationsSection />

      {/* Tech Stack Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <TechStackSection />
      </Container>

      {/* Roadmap Section */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <RoadmapSection />
      </Container>

      {/* CTA Section */}
      <CtaSection />
    </Box>
  );
}

