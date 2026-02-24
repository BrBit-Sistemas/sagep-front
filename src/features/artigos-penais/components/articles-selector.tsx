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
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setLoadError(null);
        const list = await listarArtigosPenais();
        if (mounted) setArtigos(list);
      } catch (error) {
        console.error('Erro ao carregar artigos penais:', error);
        if (mounted) {
          setArtigos([]);
          setLoadError('Nao foi possivel carregar os artigos penais.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const options = useMemo(() => artigos.map((a) => a.idUnico), [artigos]);
  const getOptionLabel = (idUnico: unknown) => {
    const art = artigos.find((a) => String(a.idUnico) === String(idUnico));
    return art ? `${art.codigoFormatado} — ${art.descricao}` : String(idUnico ?? '');
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
      disablePortal={false}
      helperText={loadError ?? undefined}
      noOptionsText={
        loading
          ? 'Carregando...'
          : loadError || 'Nenhum artigo encontrado'
      }
      slotProps={{
        endAdornment: loading ? <CircularProgress size={16} /> : undefined,
        popper: {
          placement: 'bottom-start',
          modifiers: [
            {
              name: 'preventOverflow',
              options: {
                boundary: 'viewport',
              },
            },
          ],
        },
      } as any}
    />
  );
}


