import type { DetentoFichaCadastral } from '../types';

import { create } from 'zustand';

interface DetentoDetalhesStore {
  isFichaCadastralDialogOpen: boolean;
  selectedFichaCadastral: DetentoFichaCadastral | null;

  openFichaCadastralEditDialog: (fichaCadastral: DetentoFichaCadastral) => void;
  openFichaCadastralCreateDialog: () => void;

  closeFichaCadastralDialog: () => void;
}

export const useDetentoDetalhesStore = create<DetentoDetalhesStore>((set) => ({
  isFichaCadastralDialogOpen: false,
  selectedFichaCadastral: null,

  openFichaCadastralEditDialog: (fichaCadastral) =>
    set({ isFichaCadastralDialogOpen: true, selectedFichaCadastral: fichaCadastral }),
  openFichaCadastralCreateDialog: () => set({ isFichaCadastralDialogOpen: true }),

  closeFichaCadastralDialog: () =>
    set({ isFichaCadastralDialogOpen: false, selectedFichaCadastral: null }),
}));
