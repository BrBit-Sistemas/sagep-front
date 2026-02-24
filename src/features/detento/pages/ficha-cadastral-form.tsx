import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useParams, useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import { fichaCadastralToFormValues } from '../helper';
import { useSuspenseReadDetentoDetails } from '../hooks/use-read-details';
import { useSuspenseGetDetentoFichasCadastrais } from '../hooks/use-get-detento-fichas-cadastrais';
import { DetentoFichaCadastralForm } from '../components/detalhes/detento-ficha-cadastral-dialog-form';

export default function DetentoFichaCadastralFormPage() {
  const navigate = useRouter();
  const { detentoId, fichaCadastralId } = useParams<{
    detentoId: string;
    fichaCadastralId?: string;
  }>();

  const isEditing = Boolean(fichaCadastralId);
  const { data: detento } = useSuspenseReadDetentoDetails(detentoId);
  const { data: fichasCadastrais } = useSuspenseGetDetentoFichasCadastrais(detentoId);

  const selectedFichaCadastral = useMemo(
    () =>
      fichaCadastralId
        ? fichasCadastrais.find((ficha) => ficha.fichacadastral_id === fichaCadastralId) || null
        : null,
    [fichasCadastrais, fichaCadastralId]
  );
  const selectedFichaDefaultValues = useMemo(
    () =>
      selectedFichaCadastral ? fichaCadastralToFormValues(selectedFichaCadastral) : undefined,
    [selectedFichaCadastral]
  );

  const detalhesPath = `${paths.detentos.detalhes(detentoId)}?t=ficha_cadastral`;

  const handleBackToDetails = () => {
    navigate.push(detalhesPath);
  };

  return (
    <DashboardContent>
      <CustomBreadcrumbs
        heading={isEditing ? 'Editar Ficha Cadastral' : 'Nova Ficha Cadastral'}
        links={[
          { name: 'Reeducandos' },
          { name: 'Cadastro de Reeducandos', href: paths.detentos.root },
          { name: 'Detalhes', href: paths.detentos.detalhes(detentoId) },
          { name: isEditing ? 'Editar ficha' : 'Nova ficha' },
        ]}
        action={
          <Button variant="outlined" onClick={handleBackToDetails}>
            Voltar para detalhes
          </Button>
        }
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {isEditing && !selectedFichaCadastral ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={handleBackToDetails}>
              Voltar
            </Button>
          }
        >
          Ficha cadastral não encontrada para este reeducando.
        </Alert>
      ) : (
        <Box sx={{ pb: 3 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Preencha os campos abaixo para {isEditing ? 'editar' : 'criar'} a ficha cadastral.
          </Typography>

          <DetentoFichaCadastralForm
            detento={detento}
            detentoId={detentoId}
            fichaCadastralId={fichaCadastralId}
            defaultValues={selectedFichaDefaultValues}
            onCancel={handleBackToDetails}
            onSuccess={handleBackToDetails}
          />
        </Box>
      )}
    </DashboardContent>
  );
}
