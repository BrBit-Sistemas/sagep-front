import type { EmpresaConvenio } from '../types';

import { create } from 'zustand';

type Store = {
  isFormDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (item: EmpresaConvenio) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (item: EmpresaConvenio) => void;
  closeDeleteDialog: () => void;

  selected: EmpresaConvenio | null;
  setSelected: (item: EmpresaConvenio | null) => void;
};

export const useEmpresaConvenioCadastroStore = create<Store>((set) => ({
  isFormDialogOpen: false,

  openCreateDialog: () => set({ isFormDialogOpen: true, selected: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selected: null }),

  openEditDialog: (item) => set({ isFormDialogOpen: true, selected: item }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selected: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (item) => set({ isDeleteDialogOpen: true, selected: item }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selected: null }),

  selected: null,
  setSelected: (item) => set({ selected: item }),
}));

