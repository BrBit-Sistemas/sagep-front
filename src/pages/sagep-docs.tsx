
import Box from '@mui/material/Box';

import { FaqSection } from 'src/sections/sagep-docs/faq-section';
import { CtaSection } from 'src/sections/sagep-docs/cta-section';
import { HeroSection } from 'src/sections/sagep-docs/hero-section';
import { MetricsSection } from 'src/sections/sagep-docs/metrics-section';
import { OverviewSection } from 'src/sections/sagep-docs/overview-section';
import { UseCasesSection } from 'src/sections/sagep-docs/use-cases-section';
import { TechStackSection } from 'src/sections/sagep-docs/tech-stack-section';
import { HowItWorksSection } from 'src/sections/sagep-docs/how-it-works-section';
import { MatchingDemoSectionInteractive } from 'src/sections/sagep-docs/matching-demo-section-interactive';

// ----------------------------------------------------------------------

export default function SagepDocsPage() {
  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      <HeroSection />
      <OverviewSection />
      <HowItWorksSection />
      <MatchingDemoSectionInteractive />
      <UseCasesSection />
      <MetricsSection />
      <TechStackSection />
      <FaqSection />
      <CtaSection />
    </Box>
  );
}

