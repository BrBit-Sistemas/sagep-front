import {
  Box,
  Card,
  List,
  Stack,
  Button,
  Divider,
  ListItem,
  Container,
  Typography,
  CardHeader,
  CardContent,
  ListItemText,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components/router-link';

import { useAuthContext } from 'src/auth/hooks/use-auth-context';

export default function HowToFichaCadastralPage() {
  const { authenticated } = useAuthContext();

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h3" gutterBottom>
            Como criar a Ficha Cadastral
          </Typography>
          <Typography color="text.secondary">
            Siga os passos abaixo para criar sua conta e, em seguida, preencher a Ficha Cadastral
            Externa.
          </Typography>
        </Box>

        <Card>
          <CardHeader
            title="1) Acessar ou criar sua conta"
            subheader="Você precisa estar autenticado."
          />
          <CardContent>
            {authenticated ? (
              <>
                <List sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary="Você já está autenticado"
                      secondary="Siga para o painel ou para a Ficha Cadastral Externa."
                    />
                  </ListItem>
                </List>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    href={paths.dashboard.root}
                  >
                    Ir para o painel
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    href="/ficha-cadastral-externa"
                  >
                    Ir para Ficha Cadastral Externa
                  </Button>
                </Stack>
              </>
            ) : (
              <>
                <List sx={{ mb: 2 }}>
                  <ListItem>
                    <ListItemText
                      primary="Já tem conta? Entrar no sistema"
                      secondary="Use seu e-mail e senha para acessar."
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText
                      primary="Ainda não tem conta? Crie uma agora"
                      secondary="O cadastro é rápido e necessário para criar fichas-cadastrais externas."
                    />
                  </ListItem>
                </List>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    component={RouterLink}
                    href="/auth/jwt/sign-in"
                  >
                    Entrar
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    href="/auth/jwt/sign-up"
                  >
                    Criar conta
                  </Button>
                </Stack>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader
            title="2) Criar a Ficha Cadastral Externa"
            subheader="Informe o CPF do detento e siga as instruções na tela."
          />
          <CardContent>
            <List sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText
                  primary="Acesse a página de Ficha Cadastral Externa"
                  secondary="Digite o CPF para validar e iniciar o preenchimento."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Se já existir uma ficha ativa, não será possível criar outra"
                  secondary="Você poderá visualizar/atualizar a ficha ativa se necessário."
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Se o detento não existir, confirme o CPF e complete os dados"
                  secondary="O sistema criará o cadastro do detento automaticamente."
                />
              </ListItem>
            </List>
            <Button
              size="large"
              variant="contained"
              component={RouterLink}
              href="/ficha-cadastral-externa"
            >
              Ir para Ficha Cadastral Externa
            </Button>
          </CardContent>
        </Card>

        <Divider />

        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Precisa de ajuda?
          </Typography>
          <Typography color="text.secondary">
            Em caso de dúvidas, entre em contato com o suporte. Você também pode ir direto para a
            página de Ficha Cadastral Externa pelo botão acima.
          </Typography>
        </Box>
      </Stack>
    </Container>
  );
}
