import type { Detento } from '../types';

import { create } from 'zustand';

type DetentoCadastroStore = {
  isFormDialogOpen: boolean;

  openCreateDialog: () => void;
  closeCreateDialog: () => void;

  openEditDialog: (detento: Detento) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (detento: Detento) => void;
  closeDeleteDialog: () => void;

  selectedDetento: Detento | null;
  setSelectedDetento: (detento: Detento | null) => void;
};

export const useDetentoCadastroStore = create<DetentoCadastroStore>((set) => ({
  isFormDialogOpen: false,

  openCreateDialog: () => set({ isFormDialogOpen: true, selectedDetento: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selectedDetento: null }),

  openEditDialog: (detento) => set({ isFormDialogOpen: true, selectedDetento: detento }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selectedDetento: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (detento) => set({ isDeleteDialogOpen: true, selectedDetento: detento }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedDetento: null }),

  selectedDetento: null,
  setSelectedDetento: (detento) => set({ selectedDetento: detento }),
}));
