import { useState } from 'react';
import { Element, ALCHEMISTS } from '../types/game';
import { useGameStore } from '../store/gameStore';
import { useSynthesis } from './useSynthesis';

export function useGameCore() {
    const { addElement, selectedAlchemist, resetGame } = useGameStore();
    const [cauldronItems, setCauldronItems] = useState<Element[]>([]);
    const { isSynthesizing, performSynthesis } = useSynthesis();

    const handleDropToCauldron = (item: Element) => {
        if (cauldronItems.length < 2) {
            const newItems = [...cauldronItems, item];
            setCauldronItems(newItems);

            if (newItems.length === 2) {
                startSynthesis(newItems[0], newItems[1]);
            }
        }
    };

    const startSynthesis = async (item1: Element, item2: Element) => {
        const alchemist = ALCHEMISTS[selectedAlchemist];

        await performSynthesis(item1, item2, alchemist, (result) => {
            const newElement: Element = {
                id: result.result, // TODO: generate better ID if needed
                name: result.result,
                emoji: result.emoji,
                imageUrl: result.imageUrl,
                discoveredBy: alchemist.id
            };
            addElement(newElement);
            setCauldronItems([]);
        });
    };

    const removeFromCauldron = (id: string) => {
        setCauldronItems(prev => prev.filter(i => i.id !== id));
    };

    const clearCauldron = () => {
        setCauldronItems([]);
    };

    const resetFullGame = () => {
        resetGame();
        setCauldronItems([]);
    };

    return {
        cauldronItems,
        isSynthesizing,
        handleDropToCauldron,
        removeFromCauldron,
        clearCauldron,
        resetFullGame,
    };
}
