import type { Secretaria } from 'src/api/generated.schemas';

import { create } from 'zustand';

interface SecretariaCadastroState {
  isFormDialogOpen: boolean;
  isDeleteDialogOpen: boolean;

  selectedSecretaria: Secretaria | null;

  openCreateDialog: () => void;
  openEditDialog: (secretaria: Secretaria) => void;
  closeFormDialog: () => void;
  openDeleteDialog: (secretaria: Secretaria) => void;
  closeDeleteDialog: () => void;

  setSelectedSecretaria: (secretaria: Secretaria | null) => void;
}

const initialState = {
  isFormDialogOpen: false,
  isDeleteDialogOpen: false,
  selectedSecretaria: null,
};

export const useSecretariaCadastroStore = create<SecretariaCadastroState>((set) => ({
  ...initialState,

  openCreateDialog: () =>
    set({
      isFormDialogOpen: true,
      selectedSecretaria: null,
    }),

  openEditDialog: (secretaria) =>
    set({
      isFormDialogOpen: true,
      selectedSecretaria: secretaria,
    }),

  closeFormDialog: () =>
    set({
      isFormDialogOpen: false,
      selectedSecretaria: null,
    }),

  openDeleteDialog: (secretaria) =>
    set({
      isDeleteDialogOpen: true,
      selectedSecretaria: secretaria,
    }),

  closeDeleteDialog: () =>
    set({
      isDeleteDialogOpen: false,
      selectedSecretaria: null,
    }),

  setSelectedSecretaria: (secretaria) =>
    set({
      selectedSecretaria: secretaria,
    }),
}));
