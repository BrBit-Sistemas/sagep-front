import { isAxiosError } from 'axios';
import { useDropzone } from 'react-dropzone';
import { useState, useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import {
  Box,
  Card,
  Chip,
  Alert,
  Stack,
  Tooltip,
  TextField,
  CardHeader,
  IconButton,
  Typography,
  CardContent,
  LinearProgress,
} from '@mui/material';

import { getFichasCadastrais } from 'src/api/fichas-cadastrais';

import { Iconify } from 'src/components/iconify';

const dropZoneStyles = (isActive: boolean) => ({
  borderRadius: 2,
  border: '1px dashed',
  borderColor: isActive ? 'primary.main' : 'divider',
  bgcolor: isActive ? 'primary.lighter' : 'background.neutral',
  cursor: 'pointer',
  p: 4,
  textAlign: 'center',
  transition: (theme: any) => theme.transitions.create(['border-color', 'background-color']),
  '&:hover': {
    borderColor: 'primary.main',
    bgcolor: 'primary.lighter',
  },
});

type PendingUpload = {
  id: string;
  file: File;
  previewUrl: string;
  status: 'uploading' | 'error';
  error?: string;
};

type DocumentoFormValue = {
  id?: string;
  nome: string;
  s3_key: string;
  mime_type: string;
  file_size: number;
  url?: string;
  previewUrl?: string;
};

type FichaDocumentosFieldProps = {
  name?: string;
  fichaId?: string;
  detentoId?: string;
  title?: string;
  helperText?: string;
};

const fichasApi = getFichasCadastrais();

const humanizeFileName = (value: string) =>
  value
    .replace(/\.[^.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const formatSize = (bytes: number) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const size = bytes / 1024 ** exponent;
  return `${size.toFixed(size >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

const extractErrorMessage = (error: unknown) => {
  if (isAxiosError(error)) {
    return (
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.details ||
      error.message
    );
  }
  if (error instanceof Error) return error.message;
  return 'Não foi possível enviar o documento.';
};

const releasePreview = (url?: string) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};

export function FichaDocumentosField({
  name = 'documentos',
  fichaId,
  detentoId,
  title = 'Documentos comprobatórios',
  helperText = 'Arraste e solte arquivos em formato de imagem ou clique para procurar.',
}: FichaDocumentosFieldProps) {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ control, name });

  const documentos: DocumentoFormValue[] = watch(name) || [];
  const fieldError = (errors as Record<string, any>)?.[name];

  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      acceptedFiles.forEach((file) => {
        const id = crypto.randomUUID();
        const previewUrl = URL.createObjectURL(file);
        setPendingUploads((prev) => [
          ...prev,
          { id, file, previewUrl, status: 'uploading' },
        ]);

        fichasApi
          .uploadDocumento(file, detentoId)
          .then((uploaded) => {
            append({
              nome: humanizeFileName(file.name) || file.name,
              s3_key: uploaded.key,
              mime_type: uploaded.mime_type,
              file_size: uploaded.file_size,
              url: uploaded.url,
              previewUrl,
            });
            setPendingUploads((prev) => prev.filter((item) => item.id !== id));
          })
          .catch((error) => {
            const message = extractErrorMessage(error);
            setPendingUploads((prev) =>
              prev.map((item) =>
                item.id === id ? { ...item, status: 'error', error: message } : item
              )
            );
          });
      });
    },
    [append, detentoId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    multiple: true,
    onDrop,
  });

  useEffect(() => {
    if (!fichaId) return;

    documentos.forEach((doc) => {
      if (!doc.id || doc.previewUrl || signedUrls[doc.id]) return;

      fichasApi
        .getDocumentoUrl(fichaId, doc.id)
        .then(({ url }) => {
          setSignedUrls((prev) => ({ ...prev, [doc.id as string]: url }));
        })
        .catch(() => undefined);
    });
  }, [documentos, fichaId, signedUrls]);

  useEffect(
    () => () => {
      pendingUploads.forEach((upload) => releasePreview(upload.previewUrl));
      documentos.forEach((doc) => releasePreview(doc.previewUrl));
    },
    [documentos, pendingUploads]
  );

  const handleRetry = useCallback(
    (pending: PendingUpload) => {
      setPendingUploads((prev) =>
        prev.map((item) =>
          item.id === pending.id ? { ...item, status: 'uploading', error: undefined } : item
        )
      );

      fichasApi
        .uploadDocumento(pending.file, detentoId)
        .then((uploaded) => {
          append({
            nome: humanizeFileName(pending.file.name) || pending.file.name,
            s3_key: uploaded.key,
            mime_type: uploaded.mime_type,
            file_size: uploaded.file_size,
            url: uploaded.url,
            previewUrl: pending.previewUrl,
          });
          setPendingUploads((prev) => prev.filter((item) => item.id !== pending.id));
        })
        .catch((error) => {
          const message = extractErrorMessage(error);
          setPendingUploads((prev) =>
            prev.map((item) =>
              item.id === pending.id
                ? { ...item, status: 'error', error: message }
                : item
            )
          );
        });
    },
    [append, detentoId]
  );

  const handleRemovePending = useCallback((pending: PendingUpload) => {
    releasePreview(pending.previewUrl);
    setPendingUploads((prev) => prev.filter((item) => item.id !== pending.id));
  }, []);

  const handleRemoveDocumento = useCallback(
    (index: number) => {
      const doc = documentos[index];
      if (!doc) return;
      releasePreview(doc?.previewUrl);
      remove(index);
    },
    [documentos, remove]
  );

  const handleUpdateNome = useCallback(
    (index: number, value: string) => {
      setValue(`${name}.${index}.nome`, value, { shouldDirty: true, shouldTouch: true });
    },
    [name, setValue]
  );

  const handleOpenPreview = useCallback(
    (doc: DocumentoFormValue) => {
      const preview = doc.previewUrl || (doc.id ? signedUrls[doc.id] : undefined) || doc.url;
      if (preview) {
        window.open(preview, '_blank', 'noopener,noreferrer');
      }
    },
    [signedUrls]
  );

  return (
    <Card variant="outlined">
      <CardHeader
        title={title}
        subheader={
          <Alert severity="info" sx={{ mt: 1 }}>
            <strong>Atenção:</strong> Os documentos devem ser os do reeducando que está em busca da oportunidade de emprego, por meio desta ficha cadastral.
          </Alert>
        }
      />
      <CardContent>
        <Box {...getRootProps()} sx={dropZoneStyles(isDragActive)}>
          <input {...getInputProps()} />
          <Stack spacing={1} alignItems="center">
            <Iconify icon="eva:cloud-upload-fill" width={36} />
            <Typography variant="subtitle1">Arraste imagens aqui</Typography>
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Formatos aceitos: JPG, JPEG, PNG. Tamanho máximo 10 MB por arquivo.
            </Typography>
          </Stack>
        </Box>

        {!!pendingUploads.length && (
          <Stack spacing={2} sx={{ mt: 3 }}>
            {pendingUploads.map((pending) => (
              <Card
                key={pending.id}
                sx={{
                  border: '1px solid',
                  borderColor: pending.status === 'error' ? 'error.light' : 'divider',
                  bgcolor: pending.status === 'error' ? 'error.lighter' : 'background.paper',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        width: 72,
                        height: 72,
                        borderRadius: 1,
                        overflow: 'hidden',
                        bgcolor: 'background.default',
                        boxShadow: 1,
                      }}
                    >
                      <Box
                        component="img"
                        src={pending.previewUrl}
                        alt={pending.file.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Stack spacing={0.5} flexGrow={1}>
                      <Typography variant="subtitle2" noWrap>
                        {pending.file.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatSize(pending.file.size)}
                      </Typography>
                      {pending.status === 'uploading' && <LinearProgress sx={{ mt: 1 }} />}
                      {pending.status === 'error' && (
                        <Typography variant="caption" color="error.main">
                          {pending.error}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" spacing={1}>
                      {pending.status === 'error' ? (
                        <Tooltip title="Tentar novamente">
                          <IconButton color="primary" onClick={() => handleRetry(pending)}>
                            <Iconify icon="solar:restart-bold" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Remover">
                        <IconButton color="error" onClick={() => handleRemovePending(pending)}>
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        )}

        <Box
          sx={{
            mt: documentos.length ? 3 : 0,
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
          }}
        >
          {fields.map((field, index) => {
            const doc = (documentos[index] ?? field) as DocumentoFormValue;
            const preview = doc.previewUrl || (doc.id && signedUrls[doc.id]) || doc.url;
            return (
              <Box key={field.id ?? `${doc.s3_key}-${index}`}>
                <Card
                  variant="outlined"
                  sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      <Box
                        onClick={() => handleOpenPreview(doc)}
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: 1,
                          overflow: 'hidden',
                          position: 'relative',
                          bgcolor: 'background.default',
                          boxShadow: 1,
                          cursor: preview ? 'pointer' : 'default',
                        }}
                      >
                        {preview ? (
                          <Box
                            component="img"
                            src={preview}
                            alt={doc.nome}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <Stack
                            alignItems="center"
                            justifyContent="center"
                            sx={{ width: '100%', height: '100%', color: 'text.disabled' }}
                          >
                            <Iconify icon="solar:gallery-circle-outline" width={32} />
                          </Stack>
                        )}
                      </Box>
                      <Stack spacing={1} flexGrow={1}>
                        <TextField
                          fullWidth
                          label="Nome do documento"
                          value={doc.nome}
                          onChange={(event) => handleUpdateNome(index, event.target.value)}
                        />
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            label={doc.mime_type.split('/')[1]?.toUpperCase() || doc.mime_type}
                          />
                          <Typography variant="caption" color="text.secondary">
                            {formatSize(doc.file_size)}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Tooltip title="Remover documento">
                        <IconButton
                          color="error"
                          onClick={() => handleRemoveDocumento(index)}
                          sx={{ mt: -1 }}
                        >
                          <Iconify icon="solar:trash-bin-trash-bold" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            );
          })}
        </Box>

        {!pendingUploads.length && !documentos.length && (
          <Typography variant="body2" color="text.disabled" sx={{ mt: 3, textAlign: 'center' }}>
            Nenhum documento adicionado até o momento.
          </Typography>
        )}

        {fieldError?.message && (
          <Typography variant="caption" color="error.main" sx={{ mt: 2, display: 'block' }}>
            {fieldError.message}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
