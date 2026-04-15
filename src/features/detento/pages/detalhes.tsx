'use client';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { DetentoDetalhes } from '../components/detalhes/detento-detalhes';

export default function DetentoDetalhesPage() {
  const { detentoId } = useParams<{ detentoId: string }>();

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading="Detalhes"
        links={[
          { name: 'Carceragem' },
          { name: 'Reeducandos', href: paths.carceragem.reeducandos.root },
          { name: 'Detalhes', href: paths.carceragem.reeducandos.detalhes(detentoId) },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DetentoDetalhes detentoId={detentoId} />
    </DashboardContent>
  );
}
