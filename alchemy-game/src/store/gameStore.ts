import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AlchemistType, Element, INITIAL_ELEMENTS } from '../types/game';

interface GameState {
    elements: Element[];
    selectedAlchemist: AlchemistType;
    addElement: (element: Element) => void;
    setAlchemist: (alchemist: AlchemistType) => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            elements: INITIAL_ELEMENTS,
            selectedAlchemist: 'naturalist',

            addElement: (newElement) => set((state) => {
                // すでに存在するかチェック
                if (state.elements.some(e => e.id === newElement.id)) {
                    return state;
                }
                return { elements: [...state.elements, { ...newElement, isNew: true }] };
            }),

            setAlchemist: (alchemist) => set({ selectedAlchemist: alchemist }),

            resetGame: () => set({
                elements: INITIAL_ELEMENTS,
                selectedAlchemist: 'naturalist'
            }),
        }),
        {
            name: 'alchemy-game-storage',
        }
    )
);
