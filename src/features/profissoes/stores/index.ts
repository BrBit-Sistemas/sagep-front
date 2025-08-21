import type { Profissao } from '../types';

import { create } from 'zustand';

interface ProfissaoCadastroState {
  isFormDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  selectedProfissao: Profissao | null;

  openCreateDialog: () => void;
  openEditDialog: (profissao: Profissao) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (profissao: Profissao) => void;
  closeDeleteDialog: () => void;

  setSelectedProfissao: (profissao: Profissao | null) => void;
}

const initialState = {
  isFormDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedProfissao: null,
};

export const useProfissaoCadastroStore = create<ProfissaoCadastroState>((set) => ({
  ...initialState,

  openCreateDialog: () =>
    set({
      isFormDialogOpen: true,
      selectedProfissao: null,
    }),

  openEditDialog: (profissao) =>
    set({
      isFormDialogOpen: true,
      selectedProfissao: profissao,
    }),

  closeFormDialog: () =>
    set({
      isFormDialogOpen: false,
      selectedProfissao: null,
    }),

  openDeleteDialog: (profissao) =>
    set({
      isDeleteDialogOpen: true,
      selectedProfissao: profissao,
    }),

  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      selectedProfissao: null,
    }),

  setSelectedProfissao: (profissao) =>
    set({
      selectedProfissao: profissao,
    }),
}));
