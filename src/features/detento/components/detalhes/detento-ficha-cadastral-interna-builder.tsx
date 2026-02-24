import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';

import {
  FichaCadastralInternaEtapaDocumentos,
  FichaCadastralInternaEtapaEnderecoContato,
  FichaCadastralInternaEtapaEscolaridadeSaude,
  FichaCadastralInternaEtapaSituacaoPrisional,
  FichaCadastralInternaEtapaIdentificacaoPessoal,
  FichaCadastralInternaEtapaExperienciaQualificacao,
  FichaCadastralInternaEtapaDeclaracoesResponsaveis,
} from './ficha-cadastral-interna-etapas';

type UnidadeOption = {
  id: string;
  nome: string;
};

type DetentoFichaCadastralInternaBuilderProps = {
  loading: boolean;
  statusValidacao?: string;
  unidades: UnidadeOption[];
  onProfissaoLabelUpdate?: (id: string, nome: string) => void;
  fichaCadastralId?: string;
  detentoId: string;
};

export const DetentoFichaCadastralInternaBuilder = ({
  loading,
  statusValidacao,
  unidades,
  onProfissaoLabelUpdate,
  fichaCadastralId,
  detentoId,
}: DetentoFichaCadastralInternaBuilderProps) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
    <FichaCadastralInternaEtapaIdentificacaoPessoal
      loading={loading}
      statusValidacao={statusValidacao}
    />

    <Divider />

    <FichaCadastralInternaEtapaSituacaoPrisional loading={loading} unidades={unidades} />

    <Divider />

    <FichaCadastralInternaEtapaEnderecoContato loading={loading} />

    <Divider />

    <FichaCadastralInternaEtapaEscolaridadeSaude loading={loading} />

    <Divider />

    <FichaCadastralInternaEtapaExperienciaQualificacao
      loading={loading}
      onProfissaoLabelUpdate={onProfissaoLabelUpdate}
    />

    <FichaCadastralInternaEtapaDeclaracoesResponsaveis loading={loading} />

    <Divider />

    <FichaCadastralInternaEtapaDocumentos
      loading={loading}
      fichaCadastralId={fichaCadastralId}
      detentoId={detentoId}
    />
  </Box>
);
