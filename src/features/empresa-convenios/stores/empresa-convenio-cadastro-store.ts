import type { EmpresaConvenio } from '../types';

import { create } from 'zustand';

type Store = {
  isDeleteDialogOpen: boolean;
  openDeleteDialog: (item: EmpresaConvenio) => void;
  closeDeleteDialog: () => void;
  selected: EmpresaConvenio | null;
  setSelected: (item: EmpresaConvenio | null) => void;
};

export const useEmpresaConvenioCadastroStore = create<Store>((set) => ({
  isDeleteDialogOpen: false,
  openDeleteDialog: (item) => set({ isDeleteDialogOpen: true, selected: item }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selected: null }),
  selected: null,
  setSelected: (item) => set({ selected: item }),
}));
