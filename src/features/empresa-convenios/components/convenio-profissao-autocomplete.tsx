import type { ReactNode } from 'react';

import { useWatch, useFormContext } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { getProfissoes } from 'src/api/profissoes/profissoes';

import { Field } from 'src/components/hook-form';

import { useProfissoesAutocomplete } from '../hooks/use-profissoes-options';

type ConvenioProfissaoAutocompleteProps = {
  name: string;
  label: string;
  helperSlot?: ReactNode;
};

export function ConvenioProfissaoAutocomplete({
  name,
  label,
  helperSlot,
}: ConvenioProfissaoAutocompleteProps) {
  const [profissaoInput, setProfissaoInput] = useState('');
  const [initialProfissoes, setInitialProfissoes] = useState<{ id: string; nome: string }[]>([]);
  const [labelVersion, setLabelVersion] = useState(0);
  const labelCache = useRef<Map<string, string>>(new Map());
  const { control } = useFormContext();
  const { options: profissoes, loading: loadingProf, hasMinimum: hasMin } =
    useProfissoesAutocomplete(profissaoInput, 3);
  const currentProfissaoId = useWatch({ control, name }) as string | undefined;
  useEffect(() => {
    const id = String(currentProfissaoId ?? '');
    if (id && !labelCache.current.has(id)) {
      getProfissoes()
        .findOne(id)
        .then((p) => {
          labelCache.current.set(String(p.id), p.nome);
          setInitialProfissoes((prev) => {
            if (prev.some((x) => String(x.id) === String(p.id))) return prev;
            return [...prev, { id: String(p.id), nome: p.nome }];
          });
        })
        .catch(() => {});
    }
  }, [currentProfissaoId]);
  useEffect(() => {
    if (profissoes.length > 0) {
      profissoes.forEach((p) => {
        labelCache.current.set(String(p.id), p.nome);
      });
      setLabelVersion((v) => v + 1);
    }
  }, [profissoes]);
  const allOptions = useMemo(() => {
    const combined = [...initialProfissoes, ...profissoes];
    const unique = combined.filter(
      (p, idx, self) => idx === self.findIndex((t) => String(t.id) === String(p.id))
    );
    return unique.map((p) => p.id);
  }, [initialProfissoes, profissoes]);
  const getOptionLabel = useCallback(
    (id: unknown): string => {
      const idStr = String(id || '');
      return labelCache.current.get(idStr) || idStr;
    },
    [labelVersion] // forces re-evaluation when cache is updated from search results
  );
  return (
    <Field.Autocomplete
      name={name}
      label={label}
      nullToEmptyString
      options={allOptions}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) => String(opt) === String(val)}
      filterSelectedOptions
      loading={loadingProf}
      disablePortal
      onInputChange={(_e, value: string) => setProfissaoInput(value)}
      noOptionsText="Procure uma profissão"
      slotProps={{
        textField: {
          helperText:
            helperSlot ??
            (!hasMin && (profissaoInput?.length || 0) > 0
              ? 'Digite ao menos 3 caracteres'
              : undefined),
        },
        popper: {
          placement: 'bottom-start',
          modifiers: [{ name: 'preventOverflow', options: { boundary: 'viewport' } }],
        },
      }}
    />
  );
}
