import { ALCHEMISTS, AlchemistType } from '../types/game';

interface AlchemistPanelProps {
    selectedAlchemist: AlchemistType;
    onSelect: (id: AlchemistType) => void;
    onClearCauldron?: () => void;
    onResetInventory?: () => void;
}

export function AlchemistPanel({ selectedAlchemist, onSelect, onClearCauldron, onResetInventory }: AlchemistPanelProps) {
    return (
        <aside className="alchemist-panel glass-panel">
            <div className="panel-header">
                <h2 className="panel-title">合成ルール</h2>
                <p className="panel-desc">錬金術師を切り替えることで、アイテムの組み合わせ結果が変わります。</p>
            </div>

            <div className="alchemist-list">
                {Object.entries(ALCHEMISTS).map(([id, alchemist]) => (
                    <button
                        key={id}
                        onClick={() => {
                            onSelect(id as AlchemistType);
                            if (onClearCauldron) onClearCauldron();
                        }}
                        className={`alchemist-card ${selectedAlchemist === id ? 'active' : ''}`}
                    >
                        <div className="card-header">
                            <span className="emoji">{alchemist.emoji}</span>
                            <h4>{alchemist.name}</h4>
                        </div>
                        <p className="desc">{selectedAlchemist === id ? alchemist.rule : alchemist.description}</p>
                    </button>
                ))}
            </div>

            {onResetInventory && (
                <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                    <button
                        onClick={onResetInventory}
                        className="danger-btn"
                    >
                        <span style={{ fontSize: '1.2rem' }}>🗑️</span> 所持アイテムを初期化
                    </button>
                </div>
            )}
        </aside>
    );
}
