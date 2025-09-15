import { useSetState } from 'minimal-shared/hooks';

export interface IDetentoTableFilters {
  nome: string;
  cpf: string;
}

const initialState: IDetentoTableFilters = {
  nome: '',
  cpf: '',
};

export const useDetentoFilters = () => {
  const filters = useSetState(initialState);

  const hasActiveFilters = () => filters.state.nome !== '' || filters.state.cpf !== '';

  return {
    ...filters,
    hasActiveFilters,
  };
};
