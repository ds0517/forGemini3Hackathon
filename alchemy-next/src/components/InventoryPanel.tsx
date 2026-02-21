import { Element } from '../types/game';
import { DraggableElement } from './DraggableElement';

interface InventoryPanelProps {
    elements: Element[];
}

export function InventoryPanel({ elements }: InventoryPanelProps) {
    return (
        <div className="inventory-section">
            <h3 className="section-title">所持アイテム</h3>
            <div className="inventory-grid">
                {elements.map(element => (
                    <DraggableElement key={element.id} element={element} />
                ))}
            </div>
        </div>
    );
}
