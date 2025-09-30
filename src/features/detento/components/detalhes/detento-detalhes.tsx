import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { usePermissionCheck } from 'src/auth/guard/permission-guard';

import { DetentoDetailsTab } from './tabs/detento-details-tab';
import { DetentoDetalhesCover } from './detento-detalhes-cover';
import { useSuspenseReadDetentoDetails } from '../../hooks/use-read-details';
import { DetentoFichaCadastralTab } from './tabs/detento-ficha-cadastral-tab';
import { useDetentoDetalhesStore } from '../../stores/detento-detalhes-store';
import { useDetentoDetalhesSearchParams } from '../../hooks/use-dentento-detalhes-search-params';

interface DetentoDetalhesProps {
  detentoId: string;
}

const NAV_BASE = [
  { value: 'detalhes', label: 'Detalhes', icon: <Iconify icon="solar:user-id-bold" /> },
  {
    value: 'ficha_cadastral',
    label: 'Ficha Cadastral',
    icon: <Iconify icon="solar:user-id-bold" />,
  },
];

export const DetentoDetalhes = ({ detentoId }: DetentoDetalhesProps) => {
  const { data } = useSuspenseReadDetentoDetails(detentoId);
  const [{ tab }, setSearchParams] = useDetentoDetalhesSearchParams();
  const { isFichaCadastralDialogOpen } = useDetentoDetalhesStore();
  const { isLoading, hasPermission, hasAny } = usePermissionCheck();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue as 'detalhes' | 'ficha_cadastral' });
  };

  // Ensure the ficha cadastral tab is active if the dialog is opened externally
  useEffect(() => {
    if (isFichaCadastralDialogOpen && tab !== 'ficha_cadastral') {
      setSearchParams({ tab: 'ficha_cadastral' });
    }
  }, [isFichaCadastralDialogOpen, tab, setSearchParams]);

  const tabs = {
    detalhes: <DetentoDetailsTab detento={data} />,
    ficha_cadastral: <DetentoFichaCadastralTab detento={data} />,
  };

  const canSeeDetalhes = hasPermission({ action: 'read', subject: 'detentos' });
  const canSeeFicha = hasAny([
    { action: 'read', subject: 'ficha_cadastral_interno' },
    { action: 'read', subject: 'detentos' },
  ]);

  const allowedNav = NAV_BASE.filter(
    (n) =>
      (n.value === 'detalhes' && canSeeDetalhes) || (n.value === 'ficha_cadastral' && canSeeFicha)
  );

  useEffect(() => {
    if (isLoading) return;
    const allowedValues = allowedNav.map((n) => n.value);
    if (!allowedValues.includes(tab)) {
      setSearchParams({
        tab: (allowedNav[0]?.value as 'detalhes' | 'ficha_cadastral') || 'detalhes',
      });
    }
  }, [isLoading, tab, allowedNav, setSearchParams]);

  return (
    <>
      <Card sx={{ height: 290 }}>
        <DetentoDetalhesCover
          name={data.nome}
          prontuario={data.prontuario}
          coverUrl={`${CONFIG.assetsDir}/assets/background/detento-banner.webp`}
          avatarUrl="https://via.placeholder.com/150"
        />

        <Box
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            px: { md: 3 },
            display: 'flex',
            position: 'absolute',
            bgcolor: 'background.paper',
            justifyContent: { xs: 'center', md: 'flex-end' },
          }}
        >
          <Tabs value={tab} onChange={handleTabChange}>
            {allowedNav.map((_tab) => (
              <Tab key={_tab.value} value={_tab.value} icon={_tab.icon} label={_tab.label} />
            ))}
          </Tabs>
        </Box>
      </Card>
      {tabs[tab as keyof typeof tabs]}
    </>
  );
};
