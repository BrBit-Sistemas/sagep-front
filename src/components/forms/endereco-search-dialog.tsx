import { Icon as Iconify } from '@iconify/react';
import { useMemo, useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Grid,
  List,
  Alert,
  Paper,
  Stack,
  Button,
  Dialog,
  Divider,
  ListItem,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  ListItemText,
  DialogActions,
  DialogContent,
  InputAdornment,
  ListItemButton,
  CircularProgress,
} from '@mui/material';

import { enderecoApiService } from 'src/services/endereco-api.service';

type EnderecoSearchDialogProps = {
  open: boolean;
  onClose: () => void;
  onSelectCep: (cep: string) => void;
  initialUf?: string;
  initialCidade?: string;
  initialLogradouro?: string;
};

export function EnderecoSearchDialog({ open, onClose, onSelectCep, initialUf, initialCidade, initialLogradouro }: EnderecoSearchDialogProps) {
  const [estados, setEstados] = useState<{ nome: string; sigla: string }[]>([]);
  const [municipios, setMunicipios] = useState<{ nome: string }[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);

  const [uf, setUf] = useState(initialUf || '');
  const [cidade, setCidade] = useState(initialCidade || '');
  const [logradouro, setLogradouro] = useState(initialLogradouro || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resultados, setResultados] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        setLoadingEstados(true);
        const data = await enderecoApiService.listarEstados();
        setEstados(data);
      } finally {
        setLoadingEstados(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!uf) {
      setMunicipios([]);
      return;
    }
    (async () => {
      try {
        setLoadingMunicipios(true);
        const data = await enderecoApiService.listarMunicipiosPorEstado(uf);
        setMunicipios(data);
      } finally {
        setLoadingMunicipios(false);
      }
    })();
  }, [uf]);

  const canSearch = useMemo(() => Boolean(uf && cidade), [uf, cidade]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await enderecoApiService.buscarCepPorEndereco({ uf, cidade, logradouro });
      setResultados(list);
      if (!list.length) setError('Nenhum CEP encontrado para os parâmetros informados');
    } catch (e: any) {
      setError(e?.message || 'Erro ao buscar endereços');
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePick = (cep: string) => {
    onSelectCep(cep);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'transparent',
          boxShadow: 'none',
        },
      }}
    >
      <Box sx={{ p: 0.5, borderRadius: 2, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Paper sx={{ borderRadius: 1.5 }}>
          <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  p: 1.25,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify icon="solar:list-bold" width={28} color="#fff" />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 0.25 }}>
                  Buscar CEP por Endereço
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Digite o endereço para encontrar o CEP correspondente
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>

          <Divider />

          <DialogContent sx={{ pt: 3 }}>
            <Stack spacing={3}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              value={estados.find((e) => e.sigla === uf) || null}
              options={estados}
              getOptionLabel={(o) => `${o.nome} (${o.sigla})`}
              isOptionEqualToValue={(o, v) => o.sigla === v?.sigla}
              loading={loadingEstados}
              onChange={(_, value) => {
                setUf(value?.sigla || '');
                setCidade('');
                setResultados([]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Estado *"
                  placeholder="Selecione o estado"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingEstados ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
            <Autocomplete
              value={municipios.find((m) => m.nome === cidade) || null}
              options={municipios}
              getOptionLabel={(o) => o.nome}
              isOptionEqualToValue={(o, v) => o.nome === v?.nome}
              loading={loadingMunicipios}
              disabled={!uf}
              onChange={(_, value) => {
                setCidade(value?.nome || '');
                setResultados([]);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cidade *"
                  placeholder={uf ? 'Selecione a cidade' : 'Primeiro selecione o estado'}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loadingMunicipios ? <CircularProgress size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Logradouro (opcional)"
                    placeholder="Ex: Rua Conde de São João das Duas Barras"
                    value={logradouro}
                    onChange={(e) => setLogradouro(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="solar:flag-bold" width={20} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleSearch}
                    disabled={!canSearch || loading}
                    startIcon={loading ? <CircularProgress size={15} /> : <Iconify icon="solar:eye-bold" width={20} />}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      },
                    }}
                  >
                    {loading ? 'Buscando...' : 'Buscar CEPs'}
                  </Button>
                </Grid>
                <Grid size={{ xs: 12 }}>
                  {error && <Alert severity="warning">{error}</Alert>}
                </Grid>

                {!!resultados.length && (
                  <Grid size={{ xs: 12 }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                      {resultados.length} {resultados.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                    </Typography>
                    <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                      {resultados.map((r, idx) => (
                        <ListItem key={`${r.cep}-${idx}`} disablePadding sx={{ mb: 1 }}>
                          <ListItemButton
                            onClick={() => handlePick(r.cep)}
                            sx={{
                              borderRadius: 1.5,
                              border: '2px solid',
                              borderColor: 'divider',
                              '&:hover': { borderColor: 'primary.main', bgcolor: 'primary.lighter' },
                            }}
                          >
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={1.5} alignItems="center">
                                  <Typography variant="h6" color="primary.main">
                                    {r.cep}
                                  </Typography>
                                  <Chip label={r.estado} size="small" color="primary" variant="outlined" />
                                </Stack>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.primary">
                                    {r.logradouro}
                                  </Typography>
                                  {!!r.complemento && (
                                    <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontWeight: 600, mt: 0.25 }}>
                                      📍 {r.complemento}
                                    </Typography>
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {r.bairro} • {r.cidade}/{r.estado}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Iconify icon="solar:arrow-right-up-linear" width={18} />
                          </ListItemButton>
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                )}
              </Grid>
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2.5 }}>
            <Button variant="outlined" onClick={onClose}>
              Cancelar
            </Button>
          </DialogActions>
        </Paper>
      </Box>
    </Dialog>
  );
}


