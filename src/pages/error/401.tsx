import { CONFIG } from 'src/global-config';

import { UnauthorizedView } from 'src/sections/error';

// ----------------------------------------------------------------------

const metadata = { title: `401 Acesso não autorizado | Error - ${CONFIG.appName}` };

export default function Page() {
  return (
    <>
      <title>{metadata.title}</title>

      <UnauthorizedView />
    </>
  );
}
