import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import { CtaSection } from '../cta-section';
import { HeroSection } from '../hero-section';
import { StatsSection } from '../stats-section';
import { JourneySection } from '../journey-section';
import { ModulesSection } from '../modules-section';
import { RoadmapSection } from '../roadmap-section';
import { FeaturesSection } from '../features-section';
import { UseCasesSection } from '../use-cases-section';
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
      {/* Hero Section - Azul SAGEP */}
      <HeroSection />

      {/* Journey Section - Logo após Hero! */}
      <JourneySection />

      {/* Stats Section */}
      <StatsSection />

      {/* Use Cases Section - NEW */}
      <UseCasesSection />

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

