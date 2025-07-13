import type { Regional } from '../types';

import { create } from 'zustand';

interface RegionalCadastroState {
  isFormDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  selectedRegional: Regional | null;

  openCreateDialog: () => void;
  openEditDialog: (regional: Regional) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (regional: Regional) => void;
  closeDeleteDialog: () => void;

  setSelectedRegional: (regional: Regional | null) => void;
}

const initialState = {
  isFormDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedRegional: null,
};

export const useRegionalCadastroStore = create<RegionalCadastroState>((set) => ({
  ...initialState,

  openCreateDialog: () =>
    set({
      isFormDialogOpen: true,
      selectedRegional: null,
    }),

  openEditDialog: (regional) =>
    set({
      isFormDialogOpen: true,
      selectedRegional: regional,
    }),

  closeFormDialog: () =>
    set({
      isFormDialogOpen: false,
      selectedRegional: null,
    }),

  openDeleteDialog: (regional) =>
    set({
      isDeleteDialogOpen: true,
      selectedRegional: regional,
    }),

  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      selectedRegional: null,
    }),

  setSelectedRegional: (regional) =>
    set({
      selectedRegional: regional,
    }),
}));
