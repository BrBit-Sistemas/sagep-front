import type { ReactNode } from 'react';

import { useWatch, useFormContext } from 'react-hook-form';
import { useRef, useMemo, useState, useEffect } from 'react';

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
  const labelCache = useRef<Map<string, string>>(new Map());
  const { control } = useFormContext();
  const { options: profissoes, loading: loadingProf, hasMinimum: hasMin } =
    useProfissoesAutocomplete(profissaoInput, 3);
  const currentProfissaoId = useWatch({ control, name }) as string | undefined;
  useEffect(() => {
    if (currentProfissaoId && !labelCache.current.has(String(currentProfissaoId))) {
      const api = getProfissoes();
      api
        .findAll({ page: 1, limit: 100 })
        .then((response) => {
          if (response.items) {
            setInitialProfissoes(
              response.items.map((p) => ({ id: String(p.id), nome: p.nome }))
            );
            response.items.forEach((p) => {
              labelCache.current.set(String(p.id), p.nome);
            });
          }
        })
        .catch(() => {});
    }
  }, [currentProfissaoId]);
  useEffect(() => {
    profissoes.forEach((p) => {
      labelCache.current.set(String(p.id), p.nome);
    });
  }, [profissoes]);
  const allOptions = useMemo(() => {
    const combined = [...initialProfissoes, ...profissoes];
    const unique = combined.filter(
      (p, idx, self) => idx === self.findIndex((t) => String(t.id) === String(p.id))
    );
    return unique.map((p) => p.id);
  }, [initialProfissoes, profissoes]);
  const getOptionLabel = (id: unknown): string => {
    const idStr = String(id || '');
    return labelCache.current.get(idStr) || idStr;
  };
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
