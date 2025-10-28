import type { Estado, Municipio } from 'src/services/endereco-api.service';

import { useState, useEffect, useRef } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

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
  Tooltip,
  ListItem,
  TextField,
  IconButton,
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
import { REGIOES_ADMINISTRATIVAS_DF } from 'src/constants/regioes-administrativas-df';

import { Iconify } from 'src/components/iconify';

interface EnderecoFormProps {
  disabled?: boolean;
}

export function EnderecoForm({ disabled = false }: EnderecoFormProps) {
  const { control, watch, setValue, formState: { errors } } = useFormContext();
  
  const [estados, setEstados] = useState<Estado[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [loadingEstados, setLoadingEstados] = useState(false);
  const [loadingMunicipios, setLoadingMunicipios] = useState(false);
  const [loadingCep, setLoadingCep] = useState(false);
  const [errorCep, setErrorCep] = useState<string | null>(null);
  
  // Ref para controlar se já carregou o CEP inicial (modo edição)
  const cepInicialCarregado = useRef(false);

  // Modal de busca por endereço
  const [openBuscaEndereco, setOpenBuscaEndereco] = useState(false);
  const [enderecoParaBusca, setEnderecoParaBusca] = useState('');
  const [loadingBuscaEndereco, setLoadingBuscaEndereco] = useState(false);
  const [resultadosBusca, setResultadosBusca] = useState<any[]>([]);
  const [errorBuscaEndereco, setErrorBuscaEndereco] = useState<string | null>(null);
  const [estadoBusca, setEstadoBusca] = useState<string>('');
  const [cidadeBusca, setCidadeBusca] = useState<string>('');
  const [municipiosBusca, setMunicipiosBusca] = useState<Municipio[]>([]);

  const estadoSelecionado = watch('estado');
  const cep = watch('cep');
  const numero = watch('numero');
  const complemento = watch('complemento');
  
  // Campos antigos (para compatibilidade)
  const enderecoAntigo = watch('endereco');
  const regiaoAdministrativa = watch('regiao_administrativa');

  // Verificar se há dados no formato antigo
  const temDadosAntigos = !!(enderecoAntigo || regiaoAdministrativa);

  // Resetar flag quando componente montar (novo formulário)
  useEffect(() => {
    cepInicialCarregado.current = false;
  }, []);

  // Carregar estados na inicialização
  useEffect(() => {
    const carregarEstados = async () => {
      setLoadingEstados(true);
      try {
        const estadosData = await enderecoApiService.listarEstados();
        setEstados(estadosData);
      } catch (error) {
        console.error('Erro ao carregar estados:', error);
      } finally {
        setLoadingEstados(false);
      }
    };

    carregarEstados();
  }, []);

  // Carregar municípios quando estado mudar
  useEffect(() => {
    if (estadoSelecionado) {
      const carregarMunicipios = async () => {
        setLoadingMunicipios(true);
        try {
          const municipiosData = await enderecoApiService.listarMunicipiosPorEstado(estadoSelecionado);
          setMunicipios(municipiosData);
        } catch (error) {
          console.error('Erro ao carregar municípios:', error);
          setMunicipios([]);
        } finally {
          setLoadingMunicipios(false);
        }
      };

      carregarMunicipios();
    } else {
      setMunicipios([]);
    }
  }, [estadoSelecionado]);

  // Buscar CEP quando mudar
  useEffect(() => {
    if (cep && cep.replace(/\D/g, '').length === 8) {
      // Primeira vez que detecta um CEP: verificar se já tem dados (modo edição)
      if (!cepInicialCarregado.current) {
        // Pegar valores atuais de numero e complemento
        const numeroAtual = numero;
        const complementoAtual = complemento;
        
        // Se tem dados, é modo edição - apenas marcar como carregado e não buscar
        if (numeroAtual || complementoAtual) {
          cepInicialCarregado.current = true;
          return;
        }
      }
      
      const buscarCep = async () => {
        setLoadingCep(true);
        setErrorCep(null);
        
        try {
          const dadosCep = await enderecoApiService.buscarCep(cep);
          
          // Preencher campos automaticamente
          setValue('logradouro', dadosCep.logradouro);
          setValue('bairro', dadosCep.bairro);
          setValue('cidade', dadosCep.cidade);
          setValue('estado', dadosCep.estado);
          
          // Limpar número e complemento para usuário preencher
          setValue('numero', '');
          setValue('complemento', '');
          
          // Marcar que já fez uma busca
          cepInicialCarregado.current = true;
          
        } catch (error) {
          setErrorCep(error instanceof Error ? error.message : 'Erro ao buscar CEP');
        } finally {
          setLoadingCep(false);
        }
      };

      buscarCep();
    }
  }, [cep, setValue]); // ✅ REMOVIDO numero e complemento das dependências!

  // Carregar municípios quando estado de busca mudar
  useEffect(() => {
    if (estadoBusca) {
      const carregarMunicipiosBusca = async () => {
        try {
          const municipiosData = await enderecoApiService.listarMunicipiosPorEstado(estadoBusca);
          setMunicipiosBusca(municipiosData);
        } catch (error) {
          console.error('Erro ao carregar municípios para busca:', error);
          setMunicipiosBusca([]);
        }
      };

      carregarMunicipiosBusca();
    } else {
      setMunicipiosBusca([]);
    }
  }, [estadoBusca]);

  // Função para buscar endereço
  const handleBuscarPorEndereco = async () => {
    if (!estadoBusca || !cidadeBusca) {
      setErrorBuscaEndereco('Por favor, selecione estado e cidade');
      return;
    }

    setLoadingBuscaEndereco(true);
    setErrorBuscaEndereco(null);
    
    try {
      const resultados = await enderecoApiService.buscarCepPorEndereco({
        uf: estadoBusca,
        cidade: cidadeBusca,
        logradouro: enderecoParaBusca || undefined,
      });
      
      if (resultados.length === 0) {
        setErrorBuscaEndereco('Nenhum CEP encontrado para os parâmetros informados');
      }
      
      setResultadosBusca(resultados);
    } catch (error) {
      setErrorBuscaEndereco(
        error instanceof Error ? error.message : 'Erro ao buscar endereços'
      );
      setResultadosBusca([]);
    } finally {
      setLoadingBuscaEndereco(false);
    }
  };

  const handleSelecionarCep = (cepSelecionado: string) => {
    setValue('cep', cepSelecionado);
    setOpenBuscaEndereco(false);
    setEnderecoParaBusca('');
    setResultadosBusca([]);
  };

  return (
    <Box>
      {/* Alerta de dados antigos */}
      {temDadosAntigos && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            📋 Endereço cadastrado anteriormente
          </Typography>
          <Typography variant="body2">
            <strong>Endereço:</strong> {enderecoAntigo}
            {regiaoAdministrativa && <> • <strong>RA:</strong> {regiaoAdministrativa}</>}
          </Typography>
        </Alert>
      )}

      <Grid container spacing={2}>
        {/* CEP com botão de busca */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="cep"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="CEP"
                placeholder="00000-000"
                disabled={disabled || loadingCep}
                error={!!errors.cep}
                helperText={(errors.cep?.message as string) || "Ou busque pelo endereço"}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {loadingCep ? (
                        <CircularProgress size={20} />
                      ) : (
                        <Tooltip title="Não sei meu CEP - Buscar por endereço">
                          <IconButton
                            onClick={() => setOpenBuscaEndereco(true)}
                            edge="end"
                            disabled={disabled}
                            sx={{
                              color: 'primary.main',
                              '&:hover': {
                                bgcolor: 'primary.lighter',
                              },
                            }}
                          >
                            <Iconify icon="solar:eye-bold" width={24} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </InputAdornment>
                  ),
                }}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  let formatted = value;
                  
                  if (value.length > 5) {
                    formatted = `${value.slice(0, 5)}-${value.slice(5, 8)}`;
                  }
                  
                  field.onChange(formatted);
                }}
                fullWidth
              />
            )}
          />
          {errorCep && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {errorCep}
            </Alert>
          )}
        </Grid>

        {/* Estado */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="estado"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={estados.find((e) => e.sigla === field.value) || null}
                options={estados}
                getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
                isOptionEqualToValue={(option, value) => option.sigla === value?.sigla}
                loading={loadingEstados}
                disabled={disabled}
                onChange={(_, value) => {
                  field.onChange(value?.sigla || '');
                  // Limpar cidade quando estado mudar
                  setValue('cidade', '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Estado"
                    placeholder="Selecione o estado"
                    error={!!errors.estado}
                    helperText={errors.estado?.message as string}
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
                renderOption={(props, option) => (
                  <li {...props}>
                    <Box>
                      <Box component="span" sx={{ fontWeight: 600 }}>
                        {option.nome}
                      </Box>
                      <Chip 
                        label={option.sigla} 
                        size="small" 
                        sx={{ ml: 1 }} 
                      />
                    </Box>
                  </li>
                )}
              />
            )}
          />
        </Grid>

        {/* Cidade */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="cidade"
            control={control}
            render={({ field }) => (
              <Autocomplete
                value={municipios.find((m) => m.nome === field.value) || null}
                options={municipios}
                getOptionLabel={(option) => option.nome}
                isOptionEqualToValue={(option, value) => option.nome === value?.nome}
                loading={loadingMunicipios}
                disabled={disabled || !estadoSelecionado}
                onChange={(_, value) => field.onChange(value?.nome || '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Cidade"
                    placeholder={estadoSelecionado ? "Selecione a cidade" : "Primeiro selecione o estado"}
                    error={!!errors.cidade}
                    helperText={errors.cidade?.message as string}
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
            )}
          />
        </Grid>

        {/* Logradouro */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Controller
            name="logradouro"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Logradouro"
                placeholder="Rua, Avenida, etc."
                disabled={disabled}
                error={!!errors.logradouro}
                helperText={errors.logradouro?.message as string}
                InputLabelProps={{ shrink: !!field.value || undefined }}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Número */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Controller
            name="numero"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Número"
                placeholder="123"
                disabled={disabled}
                error={!!errors.numero}
                helperText={errors.numero?.message as string}
                InputLabelProps={{ shrink: !!field.value || undefined }}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Complemento */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="complemento"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Complemento"
                placeholder="Apartamento, casa, etc."
                disabled={disabled}
                error={!!errors.complemento}
                helperText={errors.complemento?.message as string}
                InputLabelProps={{ shrink: !!field.value || undefined }}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Bairro */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Controller
            name="bairro"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Bairro"
                placeholder="Nome do bairro"
                disabled={disabled}
                error={!!errors.bairro}
                helperText={errors.bairro?.message as string}
                InputLabelProps={{ shrink: !!field.value || undefined }}
                fullWidth
              />
            )}
          />
        </Grid>

        {/* Região Administrativa - Apenas para DF */}
        {estadoSelecionado === 'DF' && (
          <Grid size={{ xs: 12 }}>
            <Controller
              name="ra_df"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  value={REGIOES_ADMINISTRATIVAS_DF.find((ra) => ra.value === field.value) || null}
                  options={REGIOES_ADMINISTRATIVAS_DF}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) => option.value === value?.value}
                  disabled={disabled}
                  onChange={(_, value) => field.onChange(value?.value || '')}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Região Administrativa (RA)"
                      placeholder="Selecione a Região Administrativa do DF"
                      error={!!errors.ra_df}
                      helperText={errors.ra_df?.message as string}
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <Iconify icon="solar:flag-bold" width={20} sx={{ color: 'primary.main' }} />
                          </InputAdornment>
                        ),
                      }}
                    />
                  )}
                  renderOption={(props, option) => (
                    <li {...props}>
                      <Typography variant="body2">
                        {option.label}
                      </Typography>
                    </li>
                  )}
                />
              )}
            />
          </Grid>
        )}
      </Grid>

      {/* Modal de Busca por Endereço */}
      <Dialog
        open={openBuscaEndereco}
        onClose={() => setOpenBuscaEndereco(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            p: 0.5,
          },
        }}
      >
        <Paper sx={{ borderRadius: 1.5 }}>
        
          <DialogTitle sx={{ pb: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Iconify
                  icon="solar:list-bold"
                  width={32}
                  sx={{ color: 'common.white' }}
                />
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Buscar CEP por Endereço
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Digite o endereço para encontrar o CEP correspondente
                </Typography>
              </Box>
            </Stack>
          </DialogTitle>
          
          <Divider />

          <DialogContent sx={{ pt: 3, pb: 2 }}>
            <Stack spacing={3}>
              {/* Estado e Cidade */}
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Autocomplete
                    value={estados.find((e) => e.sigla === estadoBusca) || null}
                    options={estados}
                    getOptionLabel={(option) => `${option.nome} (${option.sigla})`}
                    isOptionEqualToValue={(option, value) => option.sigla === value?.sigla}
                    loading={loadingEstados}
                    onChange={(_, value) => {
                      setEstadoBusca(value?.sigla || '');
                      setCidadeBusca('');
                      setResultadosBusca([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Estado *"
                        placeholder="Selecione o estado"
                        InputLabelProps={{ shrink: true }}
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
                    value={municipiosBusca.find((m) => m.nome === cidadeBusca) || null}
                    options={municipiosBusca}
                    getOptionLabel={(option) => option.nome}
                    isOptionEqualToValue={(option, value) => option.nome === value?.nome}
                    disabled={!estadoBusca}
                    onChange={(_, value) => {
                      setCidadeBusca(value?.nome || '');
                      setResultadosBusca([]);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Cidade *"
                        placeholder={estadoBusca ? "Selecione a cidade" : "Primeiro selecione o estado"}
                        InputLabelProps={{ shrink: true }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Campo de logradouro (opcional) */}
              <TextField
                fullWidth
                label="Logradouro (opcional)"
                placeholder="Ex: Rua das Flores, Avenida Paulista"
                value={enderecoParaBusca}
                onChange={(e) => setEnderecoParaBusca(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleBuscarPorEndereco();
                  }
                }}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:flag-bold" width={24} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'primary.main',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main',
                    },
                  },
                }}
              />

              {/* Botão de busca */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleBuscarPorEndereco}
                disabled={!estadoBusca || !cidadeBusca || loadingBuscaEndereco}
                startIcon={loadingBuscaEndereco ? <CircularProgress size={20} /> : <Iconify icon="solar:eye-bold" width={20} />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                {loadingBuscaEndereco ? 'Buscando...' : 'Buscar CEPs'}
              </Button>

              {/* Mensagem de erro */}
              {errorBuscaEndereco && (
                <Alert severity="error" sx={{ borderRadius: 1.5 }}>
                  {errorBuscaEndereco}
                </Alert>
              )}

              {/* Mensagem informativa inicial */}
              {!loadingBuscaEndereco && resultadosBusca.length === 0 && !errorBuscaEndereco && (
                <Paper
                  sx={{
                    p: 4,
                    textAlign: 'center',
                    bgcolor: 'background.neutral',
                    borderRadius: 2,
                    border: '2px dashed',
                    borderColor: 'divider',
                  }}
                >
                  <Iconify
                    icon="solar:info-circle-bold"
                    width={64}
                    sx={{ color: 'info.main', mb: 2 }}
                  />
                  <Typography variant="h6" gutterBottom>
                    Como funciona?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Digite o endereço que você conhece (rua, número, bairro, cidade) e
                    encontraremos os CEPs correspondentes.
                  </Typography>
                  <Typography variant="caption" color="text.disabled" sx={{ mt: 1, display: 'block' }}>
                    💡 Dica: Quanto mais detalhes, melhor será o resultado!
                  </Typography>
                </Paper>
              )}

              {/* Lista de resultados */}
              {resultadosBusca.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {resultadosBusca.length} {resultadosBusca.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}
                  </Typography>
                  <List sx={{ p: 0, maxHeight: 400, overflow: 'auto' }}>
                    {resultadosBusca.map((resultado, index) => (
                      <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                          onClick={() => handleSelecionarCep(resultado.cep)}
                          sx={{
                            borderRadius: 1.5,
                            border: '2px solid',
                            borderColor: 'divider',
                            transition: 'all 0.2s',
                            '&:hover': {
                              borderColor: 'primary.main',
                              bgcolor: 'primary.lighter',
                              transform: 'translateY(-2px)',
                              boxShadow: 2,
                            },
                          }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center" width="100%">
                            <Box
                              sx={{
                                p: 1.5,
                                borderRadius: 1.5,
                                bgcolor: 'primary.lighter',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Iconify
                                icon="solar:flag-bold"
                                width={24}
                                sx={{ color: 'primary.main' }}
                              />
                            </Box>
                            <ListItemText
                              primary={
                                <Stack direction="row" spacing={2} alignItems="center">
                                  <Typography variant="h6" color="primary.main">
                                    {resultado.cep}
                                  </Typography>
                                  <Chip
                                    label={resultado.estado}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                              secondary={
                                <Box sx={{ mt: 0.5 }}>
                                  <Typography variant="body2" color="text.primary">
                                    {resultado.logradouro}
                                  </Typography>
                                  {resultado.complemento && (
                                    <Typography variant="caption" color="primary.main" sx={{ display: 'block', fontWeight: 600, mt: 0.25 }}>
                                      📍 {resultado.complemento}
                                    </Typography>
                                  )}
                                  <Typography variant="caption" color="text.secondary">
                                    {resultado.bairro} • {resultado.cidade}/{resultado.estado}
                                  </Typography>
                                </Box>
                              }
                            />
                            <Iconify
                              icon="solar:eye-bold"
                              width={24}
                              sx={{ color: 'text.disabled' }}
                            />
                          </Stack>
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </Stack>
          </DialogContent>

          <Divider />

          <DialogActions sx={{ p: 2.5 }}>
            <Button
              onClick={() => {
                setOpenBuscaEndereco(false);
                setEnderecoParaBusca('');
                setResultadosBusca([]);
                setErrorBuscaEndereco(null);
              }}
              variant="outlined"
              color="inherit"
              size="large"
            >
              Cancelar
            </Button>
          </DialogActions>
        </Paper>
      </Dialog>
    </Box>
  );
}
