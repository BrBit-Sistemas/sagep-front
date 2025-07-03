import type { UnidadePrisional } from '../types';

import { create } from 'zustand';

type UnidadePrisionalCadastroStore = {
  isFormDialogOpen: boolean;

  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (unidade: UnidadePrisional) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (unidade: UnidadePrisional) => void;
  closeDeleteDialog: () => void;

  selectedUnidadePrisional: UnidadePrisional | null;
  setSelectedUnidadePrisional: (unidade: UnidadePrisional | null) => void;
};

export const useUnidadePrisionalCadastroStore = create<UnidadePrisionalCadastroStore>((set) => ({
  isFormDialogOpen: false,

  openCreateDialog: () => set({ isFormDialogOpen: true, selectedUnidadePrisional: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selectedUnidadePrisional: null }),

  openEditDialog: (unidade) => set({ isFormDialogOpen: true, selectedUnidadePrisional: unidade }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selectedUnidadePrisional: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (unidade) =>
    set({ isDeleteDialogOpen: true, selectedUnidadePrisional: unidade }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedUnidadePrisional: null }),

  selectedUnidadePrisional: null,
  setSelectedUnidadePrisional: (unidade) => set({ selectedUnidadePrisional: unidade }),
}));
