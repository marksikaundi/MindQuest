import { create } from 'zustand';

type InventoryState = {
  quantities: Record<string, number>;
};

export const initialInventoryState = (): InventoryState => ({ quantities: {} });

export const useInventoryStore = create<InventoryState>(() => initialInventoryState());
