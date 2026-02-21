import { useSensor, useSensors, PointerSensor, DragEndEvent } from '@dnd-kit/core';
import { Element } from '../types/game';

interface UseGameDndProps {
    onDropToCauldron: (item: Element) => void;
}

export function useGameDnd({ onDropToCauldron }: UseGameDndProps) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && over.id === 'cauldron') {
            const item = active.data.current as Element;
            if (item) {
                onDropToCauldron(item);
            }
        }
    };

    return {
        sensors,
        handleDragEnd,
    };
}
