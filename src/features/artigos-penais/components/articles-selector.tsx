import { useMemo, useState, useEffect } from 'react';

import CircularProgress from '@mui/material/CircularProgress';

import { Field } from 'src/components/hook-form';

import { type ArtigoPenal, listarArtigosPenais } from '../data';

type ArticlesSelectorProps = {
  name: string;
  label?: string;
};

export function ArticlesSelector({ name, label = 'Artigos Penais' }: ArticlesSelectorProps) {
  const [loading, setLoading] = useState(false);
  const [artigos, setArtigos] = useState<ArtigoPenal[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const list = await listarArtigosPenais();
        if (mounted) setArtigos(list);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const options = useMemo(() => artigos.map((a) => a.codigo), [artigos]);
  const getOptionLabel = (codigo: unknown) => {
    const art = artigos.find((a) => String(a.codigo) === String(codigo));
    return art ? `${art.codigoFormatado} — ${art.descricao}` : String(codigo ?? '');
  };

  return (
    <Field.Autocomplete
      name={name}
      label={label}
      multiple
      filterSelectedOptions
      options={options as any}
      getOptionLabel={getOptionLabel as any}
      isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
      loading={loading}
      noOptionsText={loading ? 'Carregando...' : 'Nenhum artigo encontrado'}
      slotProps={{
        endAdornment: loading ? <CircularProgress size={16} /> : undefined,
      } as any}
    />
  );
}


