import { create } from 'zustand';

type ValidacaoStore = {
  /** Id da ficha selecionada (drawer/details dialog). */
  selectedFichaId: string | null;
  isDetailsOpen: boolean;
  openDetails: (fichaId: string) => void;
  closeDetails: () => void;

  /** Modal de reprovar com motivo — abre a partir do details dialog. */
  isReprovarOpen: boolean;
  openReprovar: () => void;
  closeReprovar: () => void;

  /** Modal de revalidar (reabrir validação). */
  isRevalidarOpen: boolean;
  openRevalidar: () => void;
  closeRevalidar: () => void;
};

export const useValidacaoStore = create<ValidacaoStore>((set) => ({
  selectedFichaId: null,
  isDetailsOpen: false,
  openDetails: (fichaId) => set({ selectedFichaId: fichaId, isDetailsOpen: true }),
  closeDetails: () =>
    set({
      selectedFichaId: null,
      isDetailsOpen: false,
      isReprovarOpen: false,
      isRevalidarOpen: false,
    }),

  isReprovarOpen: false,
  openReprovar: () => set({ isReprovarOpen: true }),
  closeReprovar: () => set({ isReprovarOpen: false }),

  isRevalidarOpen: false,
  openRevalidar: () => set({ isRevalidarOpen: true }),
  closeRevalidar: () => set({ isRevalidarOpen: false }),
}));
