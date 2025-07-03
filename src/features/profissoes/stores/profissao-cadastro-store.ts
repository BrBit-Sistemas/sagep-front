import type { Profissao } from '../types';

import { create } from 'zustand';

type ProfissaoCadastroStore = {
  isFormDialogOpen: boolean;

  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (profissao: Profissao) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (profissao: Profissao) => void;
  closeDeleteDialog: () => void;

  selectedProfissao: Profissao | null;
  setSelectedProfissao: (profissao: Profissao | null) => void;
};

export const useProfissaoCadastroStore = create<ProfissaoCadastroStore>((set) => ({
  isFormDialogOpen: false,

  openCreateDialog: () => set({ isFormDialogOpen: true, selectedProfissao: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selectedProfissao: null }),

  openEditDialog: (profissao) => set({ isFormDialogOpen: true, selectedProfissao: profissao }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selectedProfissao: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (profissao) => set({ isDeleteDialogOpen: true, selectedProfissao: profissao }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedProfissao: null }),

  selectedProfissao: null,
  setSelectedProfissao: (profissao) => set({ selectedProfissao: profissao }),
}));
