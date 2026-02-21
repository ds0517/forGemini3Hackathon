import { motion, AnimatePresence } from 'framer-motion';
import { useDroppable } from '@dnd-kit/core';
import { Element } from '../types/game';
import { Sparkles, Trash2, Zap } from 'lucide-react';

export function Cauldron({
    items,
    onRemove,
    onClear,
    isSynthesizing,
    synthesisResult
}: {
    items: Element[],
    onRemove: (id: string) => void,
    onClear: () => void,
    isSynthesizing: boolean,
    synthesisResult: { text: string, type: 'success' | 'error' | 'info' } | null
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
                {items.length === 0 && !isSynthesizing && !synthesisResult && (
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
                                    <span className="emoji">{item.emoji}</span>
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

            <AnimatePresence>
                {synthesisResult && (
                    <motion.div
                        className={`synthesis-result ${synthesisResult.type}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        {synthesisResult.type === 'success' && <Sparkles size={16} className="mr-2" />}
                        {synthesisResult.type === 'error' && <Zap size={16} className="mr-2" />}
                        <p>{synthesisResult.text}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
