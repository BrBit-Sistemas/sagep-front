import type { Empresa } from '../types';

import { create } from 'zustand';

type EmpresaCadastroStore = {
  isFormDialogOpen: boolean;

  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (empresa: Empresa) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (empresa: Empresa) => void;
  closeDeleteDialog: () => void;

  selectedEmpresa: Empresa | null;
  setSelectedEmpresa: (empresa: Empresa | null) => void;
};

export const useEmpresaCadastroStore = create<EmpresaCadastroStore>((set) => ({
  isFormDialogOpen: false,

  openCreateDialog: () => set({ isFormDialogOpen: true, selectedEmpresa: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selectedEmpresa: null }),

  openEditDialog: (empresa) => set({ isFormDialogOpen: true, selectedEmpresa: empresa }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selectedEmpresa: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (empresa) => set({ isDeleteDialogOpen: true, selectedEmpresa: empresa }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedEmpresa: null }),

  selectedEmpresa: null,
  setSelectedEmpresa: (empresa) => set({ selectedEmpresa: empresa }),
}));
