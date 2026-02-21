import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
} from '@dnd-kit/core';
import { ALCHEMISTS, AlchemistType, Element } from './types/game';
import { useGameStore } from './store/gameStore';
import { synthesizeElements } from './lib/gemini';
import { RefreshCcw } from 'lucide-react';
import './App.css';

import { DraggableElement } from './components/DraggableElement';
import { Cauldron } from './components/Cauldron';


export default function App() {
  const { elements, selectedAlchemist, addElement, setAlchemist, resetGame } = useGameStore();
  const [cauldronItems, setCauldronItems] = useState<Element[]>([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisMessage, setSynthesisMessage] = useState<{ text: string, type: 'success' | 'error' | 'info' } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const performSynthesis = async (item1: Element, item2: Element) => {
    setIsSynthesizing(true);
    setSynthesisMessage(null);
    const alchemist = ALCHEMISTS[selectedAlchemist];

    try {
      const result = await synthesizeElements(item1, item2, alchemist);

      const newElementParam: Element = {
        id: result.result, // TODO: generate proper id if needed
        name: result.result,
        emoji: result.emoji,
        discoveredBy: alchemist.id
      };

      addElement(newElementParam);

      // 生成成功アニメーションのために釜の中身を空にしつつ、メッセージを表示
      setCauldronItems([]);
      setSynthesisMessage({
        text: `【成功】${result.emoji} ${result.result} (${result.reason})`,
        type: 'success'
      });

    } catch (err: any) {
      setSynthesisMessage({ text: err.message || '合成に失敗しました', type: 'error' });
    } finally {
      setIsSynthesizing(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && over.id === 'cauldron') {
      const item = active.data.current as Element;

      // 最大2個まで
      if (cauldronItems.length < 2) {
        setCauldronItems(prev => {
          const newItems = [...prev, item];
          // 2個揃ったら自動で合成処理を走らせる
          if (newItems.length === 2) {
            performSynthesis(newItems[0], newItems[1]);
          }
          return newItems;
        });
      }
    }
  };

  return (
    <div className="game-layout">
      {/* 錬金術師選択パネル */}
      <aside className="alchemist-panel">
        <div className="header">
          <h1>AI Alchemy</h1>
          <button className="reset-btn" onClick={resetGame} title="データをリセット">
            <RefreshCcw size={16} />
          </button>
        </div>

        <div className="alchemist-selector">
          <h3>担当の錬金術師を選ぶ</h3>
          <div className="alchemist-list">
            {(Object.keys(ALCHEMISTS) as AlchemistType[]).map(key => {
              const alch = ALCHEMISTS[key];
              const isActive = selectedAlchemist === key;
              return (
                <button
                  key={key}
                  className={`alchemist-card ${isActive ? 'active' : ''}`}
                  onClick={() => setAlchemist(key)}
                  disabled={isSynthesizing}
                >
                  <div className="card-header">
                    <span className="emoji">{alch.emoji}</span>
                    <h4>{alch.name}</h4>
                  </div>
                  <p className="desc">{isActive ? alch.rule : alch.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </aside>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        {/* メインプレイエリア */}
        <main className="main-area">
          <Cauldron
            items={cauldronItems}
            onRemove={(id) => setCauldronItems(prev => prev.filter(i => i.id !== id))}
            onClear={() => { setCauldronItems([]); setSynthesisMessage(null); }}
            isSynthesizing={isSynthesizing}
            synthesisResult={synthesisMessage}
          />

          <div className="inventory-panel">
            <div className="inventory-header">
              <h2>発見済みの素材 ({elements.length})</h2>
              <p>素材を合成釜にドラッグしてください</p>
            </div>

            <div className="inventory-grid">
              {elements.map(el => (
                <DraggableElement key={el.id} element={el} />
              ))}
            </div>
          </div>
        </main>
      </DndContext>
    </div>
  );
}
