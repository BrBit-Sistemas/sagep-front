import { usePopover } from 'minimal-shared/hooks';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  searchParams: {
    nome: string;
    cpf: string;
  };
  onFilterChange: (filters: { nome?: string; cpf?: string }) => void;
};

export function DetentoTableToolbar({ searchParams, onFilterChange }: Props) {
  const [localNome, setLocalNome] = useState(searchParams.nome);
  const [localCpf, setLocalCpf] = useState(searchParams.cpf);
  const menuActions = usePopover();

  // Debounce effect for nome
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localNome !== searchParams.nome) {
        onFilterChange({ nome: localNome });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localNome, searchParams.nome, onFilterChange]);

  // Debounce effect for cpf
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localCpf !== searchParams.cpf) {
        onFilterChange({ cpf: localCpf });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localCpf, searchParams.cpf, onFilterChange]);

  // Sync local state with searchParams when they change externally
  useEffect(() => {
    setLocalNome(searchParams.nome);
  }, [searchParams.nome]);

  useEffect(() => {
    setLocalCpf(searchParams.cpf);
  }, [searchParams.cpf]);

  const handleChangeNome = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalNome(event.target.value);
  }, []);

  const formatCpf = useCallback((value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, '');

    // Aplica a máscara do CPF: 000.000.000-00
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
    } else if (numbers.length <= 9) {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
    } else {
      return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
    }
  }, []);

  const handleChangeCpf = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const formattedValue = formatCpf(event.target.value);
      setLocalCpf(formattedValue);
    },
    [formatCpf]
  );

  return (
    <Box
      sx={{
        p: 2.5,
        gap: 2,
        display: 'flex',
        pr: { xs: 2.5, md: 1 },
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: { xs: 'flex-end', md: 'center' },
      }}
    >
      <TextField
        fullWidth
        value={localNome}
        onChange={handleChangeNome}
        placeholder="Pesquisar por nome..."
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      <TextField
        fullWidth
        value={localCpf}
        onChange={handleChangeCpf}
        placeholder="000.000.000-00"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          },
        }}
      />
    </Box>
  );
}
