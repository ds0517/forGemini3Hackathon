"use client";

import { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { useGameStore } from '../store/gameStore';
import { Cauldron } from '../components/Cauldron';
import { AlchemistPanel } from '../components/AlchemistPanel';
import { InventoryPanel } from '../components/InventoryPanel';
import { DebugMenu } from '../components/DebugMenu';
import { useGameCore } from '../hooks/useGameCore';
import { useGameDnd } from '../hooks/useGameDnd';
import { Toaster } from 'sonner';

export default function App() {
  const { elements, selectedAlchemist, setAlchemist } = useGameStore();
  const {
    cauldronItems,
    isSynthesizing,
    handleDropToCauldron,
    removeFromCauldron,
    clearCauldron,
    resetFullGame
  } = useGameCore();

  const { sensors, handleDragEnd } = useGameDnd({
    onDropToCauldron: handleDropToCauldron
  });

  // Hydrationエラー防止（Zustand + dnd-kit）
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);


  if (!isMounted) {
    return <div className="game-layout">Loading...</div>;
  }

  return (
    <div className="game-layout">
      <Toaster position="top-center" richColors />
      <DebugMenu />

      <AlchemistPanel
        selectedAlchemist={selectedAlchemist}
        onSelect={setAlchemist}
        onClearCauldron={clearCauldron}
        onResetInventory={resetFullGame}
      />

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <main className="main-area">
          <Cauldron
            items={cauldronItems}
            onRemove={removeFromCauldron}
            onClear={clearCauldron}
            isSynthesizing={isSynthesizing}
          />
          <InventoryPanel elements={elements} />
        </main>
      </DndContext>
    </div>
  );
}

