import { motion } from 'framer-motion';
import { useDraggable } from '@dnd-kit/core';
import { Element } from '../types/game';

export function DraggableElement({ element }: { element: Element }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: element.id,
        data: element
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 50 : 1,
        opacity: isDragging ? 0.8 : 1,
    } : undefined;

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`item-badge ${element.isNew ? 'is-new' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={element.isNew ? { scale: 0, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
            <span className="emoji">{element.emoji}</span>
            <span className="name">{element.name}</span>
        </motion.div>
    );
}
