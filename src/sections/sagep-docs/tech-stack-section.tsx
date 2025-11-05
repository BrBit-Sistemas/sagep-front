import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

const STACKS = [
  {
    title: 'Backend',
    icon: 'simple-icons:nestjs',
    color: 'error',
    techs: ['NestJS', 'PostgreSQL', 'TypeORM', 'RabbitMQ', 'Redis'],
  },
  {
    title: 'Frontend',
    icon: 'simple-icons:react',
    color: 'info',
    techs: ['React 18', 'TypeScript', 'Vite', 'Material-UI', 'TanStack Query'],
  },
  {
    title: 'Machine Learning',
    icon: 'simple-icons:python',
    color: 'warning',
    techs: ['Python', 'FastAPI', 'scikit-learn', 'TensorFlow', 'Pandas'],
  },
];

// ----------------------------------------------------------------------

export function TechStackSection() {
  return (
    <Box sx={{ bgcolor: 'background.neutral', py: 10 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" align="center" sx={{ mb: 2 }}>
          🔧 Stack Tecnológico
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 6 }}>
          Tecnologias modernas e robustas para máxima performance
        </Typography>
        
        <Grid container spacing={4}>
          {STACKS.map((stack, index) => (
            <Grid key={index} size={{ md: 4, xs: 12 }}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: `${stack.color}.lighter` }}>
                  <Iconify icon={stack.icon as any} width={48} sx={{ color: `${stack.color}.main` }} />
                </Avatar>
                <Typography variant="h5" gutterBottom>{stack.title}</Typography>
                <Stack spacing={1} sx={{ mt: 2 }}>
                  {stack.techs.map((tech, idx) => (
                    <Chip key={idx} label={tech} />
                  ))}
                </Stack>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Integrações */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h5" align="center" gutterBottom>🔌 Integrações</Typography>
          <Stack direction="row" spacing={2} justifyContent="center" flexWrap="wrap" sx={{ mt: 3 }}>
            <Chip label="TheRetech API - CNPJ" icon={<Iconify icon="solar:file-text-bold" />} color="primary" />
            <Chip label="TheRetech API - Artigos Penais" icon={<Iconify icon="solar:file-text-bold" />} color="primary" />
            <Chip label="TheRetech API - CEP" icon={<Iconify icon="solar:map-point-wave-bold" {...({} as any)} />} color="primary" />
            <Chip label="AWS S3" icon={<Iconify icon="solar:upload-minimalistic-bold" {...({} as any)} />} color="success" />
            <Chip label="WhatsApp Business" icon={<Iconify icon="solar:chat-round-dots-bold" />} color="success" />
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

