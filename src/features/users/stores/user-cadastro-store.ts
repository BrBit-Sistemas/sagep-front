import type { User } from 'src/features/users/types';

import { create } from 'zustand';

type UserCadastroStore = {
  isFormDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  openEditDialog: (user: User) => void;
  closeEditDialog: () => void;

  isDeleteDialogOpen: boolean;
  openDeleteDialog: (user: User) => void;
  closeDeleteDialog: () => void;

  selectedUser: User | null;
  setSelectedUser: (user: User | null) => void;
};

export const useUserCadastroStore = create<UserCadastroStore>((set) => ({
  isFormDialogOpen: false,
  openCreateDialog: () => set({ isFormDialogOpen: true, selectedUser: null }),
  closeCreateDialog: () => set({ isFormDialogOpen: false, selectedUser: null }),
  openEditDialog: (user) => set({ isFormDialogOpen: true, selectedUser: user }),
  closeEditDialog: () => set({ isFormDialogOpen: false, selectedUser: null }),

  isDeleteDialogOpen: false,
  openDeleteDialog: (user) => set({ isDeleteDialogOpen: true, selectedUser: user }),
  closeDeleteDialog: () => set({ isDeleteDialogOpen: false, selectedUser: null }),

  selectedUser: null,
  setSelectedUser: (user) => set({ selectedUser: user }),
}));
