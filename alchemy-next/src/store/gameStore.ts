import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AlchemistType, Element, INITIAL_ELEMENTS } from '../types/game';

interface GameState {
    elements: Element[];
    selectedAlchemist: AlchemistType;
    alwaysGenerateImage: boolean;
    addElement: (element: Element) => void;
    setAlchemist: (alchemist: AlchemistType) => void;
    setAlwaysGenerateImage: (value: boolean) => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set) => ({
            elements: INITIAL_ELEMENTS,
            selectedAlchemist: 'naturalist',
            alwaysGenerateImage: false,

            addElement: (newElement) => set((state) => {
                if (state.elements.some(e => e.id === newElement.id)) {
                    return state;
                }
                return { elements: [...state.elements, { ...newElement, isNew: true }] };
            }),

            setAlchemist: (alchemist) => set({ selectedAlchemist: alchemist }),
            setAlwaysGenerateImage: (value) => set({ alwaysGenerateImage: value }),

            resetGame: () => set((state) => ({
                elements: INITIAL_ELEMENTS,
                selectedAlchemist: 'naturalist',
                alwaysGenerateImage: state.alwaysGenerateImage
            })),
        }),
        {
            name: 'alchemy-game-storage',
        }
    )
);
