import type { SecretariaListParams } from 'src/features/secretarias/types';

import { useQuery } from '@tanstack/react-query';

import { secretariaKeys } from './keys';
import { secretariaService } from '../data';

export const useListSecretarias = (params: SecretariaListParams) =>
  useQuery({
    queryKey: secretariaKeys.list(params),
    queryFn: () => secretariaService.paginate(params),
  });
