import { useState } from 'react';
import { Settings, X, Trash2 } from 'lucide-react';
import { useGameStore } from '../store/gameStore';

export function DebugMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { alwaysGenerateImage, setAlwaysGenerateImage, resetGame, elements } = useGameStore();

    return (
        <>
            <button
                className="debug-toggle-btn"
                onClick={() => setIsOpen(true)}
                title="デバッグメニュー"
            >
                <Settings size={24} />
            </button>

            {isOpen && (
                <div className="debug-overlay" onClick={() => setIsOpen(false)}></div>
            )}

            <div className={`debug-sidebar ${isOpen ? 'open' : ''}`}>
                <div className="debug-header">
                    <h2>開発者メニュー</h2>
                    <button className="icon-btn" onClick={() => setIsOpen(false)}>
                        <X size={20} />
                    </button>
                </div>

                <div className="debug-content">
                    <section className="debug-section">
                        <h3>画像生成設定</h3>
                        <label className="toggle-label">
                            <input
                                type="checkbox"
                                checked={alwaysGenerateImage}
                                onChange={(e) => setAlwaysGenerateImage(e.target.checked)}
                            />
                            <span className="toggle-text">
                                <strong>常にAIで画像を生成する</strong>
                                <span className="caption">（ON: 既存の絵文字を使わず、全アイテムの画像をImagen APIで生成します。時間がかかります。）</span>
                            </span>
                        </label>
                    </section>

                    <section className="debug-section">
                        <h3>データ管理</h3>
                        <p className="stat">現在のインベントリ: {elements.length}個</p>
                        <button className="danger-btn" onClick={() => {
                            if (window.confirm('インベントリを初期状態（基本4要素のみ）に戻しますか？')) {
                                resetGame();
                            }
                        }}>
                            <Trash2 size={16} />
                            インベントリを初期化する
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
}
