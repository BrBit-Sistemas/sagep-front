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
          { name: 'Detentos' },
          { name: 'Cadastro de Detentos', href: paths.detentos.root },
          { name: 'Detalhes', href: paths.detentos.detalhes(detentoId) },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <DetentoDetalhes detentoId={detentoId} />
    </DashboardContent>
  );
}
