import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { Element } from '../types/game';
import { Trash2 } from 'lucide-react';

import { PixelEmoji } from './PixelEmoji';

export function Cauldron({
    items,
    onRemove,
    onClear,
    isSynthesizing,
}: {
    items: Element[],
    onRemove: (id: string) => void,
    onClear: () => void,
    isSynthesizing: boolean,
}) {
    const { isOver, setNodeRef } = useDroppable({
        id: 'cauldron',
    });

    return (
        <div className={`cauldron-container ${isOver ? 'is-over' : ''}`} ref={setNodeRef}>
            <div className="cauldron-header">
                <h2>合成釜 (Cauldron)</h2>
                <button className="icon-btn" onClick={onClear} title="クリア" disabled={isSynthesizing || items.length === 0}>
                    <Trash2 size={18} />
                </button>
            </div>

            <div className="cauldron-workspace">
                {items.length === 0 && !isSynthesizing && (
                    <div className="empty-state">
                        <p>アイテムをドラッグ＆ドロップして合成</p>
                    </div>
                )}

                <div className="cauldron-items">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={`${item.id}-${index}`}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0, transition: { duration: 0.2 } }}
                                className="cauldron-item"
                                onClick={() => !isSynthesizing && onRemove(item.id)}
                                title="クリックして取り除く"
                            >
                                <div className="item-badge in-cauldron">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.name} style={{ width: 32, height: 32, borderRadius: 4, objectFit: 'contain' }} />
                                    ) : (
                                        <PixelEmoji emoji={item.emoji} size={32} />
                                    )}
                                    <span className="name">{item.name}</span>
                                </div>
                                {index === 0 && items.length > 1 && <span className="plus-icon">+</span>}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {isSynthesizing && (
                    <motion.div
                        className="synthesis-loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <div className="spinner"></div>
                        <p>錬成中...</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
