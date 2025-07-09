import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';

import { CONFIG } from 'src/global-config';

import { Iconify } from 'src/components/iconify';

import { DetentoDetailsTab } from './tabs/detento-details-tab';
import { DetentoDetalhesCover } from './detento-detalhes-cover';
import { useSuspenseReadDetentoDetails } from '../../hooks/use-read-details';
import { DetentoFichaCadastralTab } from './tabs/detento-ficha-cadastral-tab';
import { useDetentoDetalhesSearchParams } from '../../hooks/use-dentento-detalhes-search-params';

interface DetentoDetalhesProps {
  detentoId: string;
}

const NAV_ITEMS = [
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

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    setSearchParams({ tab: newValue as 'detalhes' | 'ficha_cadastral' });
  };

  const tabs = {
    detalhes: <DetentoDetailsTab detento={data} />,
    ficha_cadastral: <DetentoFichaCadastralTab detento={data} />,
  };

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
            {NAV_ITEMS.map((_tab) => (
              <Tab key={_tab.value} value={_tab.value} icon={_tab.icon} label={_tab.label} />
            ))}
          </Tabs>
        </Box>
      </Card>
      {tabs[tab as keyof typeof tabs]}
    </>
  );
};
