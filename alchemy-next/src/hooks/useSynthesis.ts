import { useState } from 'react';
import { Alchemist, Element, CombinationResult } from '../types/game';
import { toast } from 'sonner';

export function useSynthesis() {
    const [isSynthesizing, setIsSynthesizing] = useState(false);

    const performSynthesis = async (
        item1: Element,
        item2: Element,
        alchemist: Alchemist,
        onSuccess: (result: CombinationResult & { imageUrl?: string }) => void
    ) => {
        setIsSynthesizing(true);

        try {
            console.log('--- Calling Backend Synthesis ---');

            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ element1: item1, element2: item2, alchemist }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.details || errorData.error || 'Failed to synthesize');
            }

            const result = await response.json() as CombinationResult;

            if (!result || !result.result) {
                throw new Error('APIから正しい形式のデータが返されませんでした');
            }

            console.log('Synthesis Result:', result);

            // Check Zustand store directly to avoid hook rule violations inside async
            const { useGameStore } = await import('../store/gameStore');
            const alwaysGenerateImage = useGameStore.getState().alwaysGenerateImage;

            // 汎用絵文字判定
            const GENERIC_EMOJIS = ['❓', '✨', '🌀', '🔮', '💡', '💭', '🌫️', '⚡️', '🌟'];

            let imageUrl: string | undefined = undefined;

            if (alwaysGenerateImage || GENERIC_EMOJIS.includes(result.emoji) || result.emoji.length > 2) {
                try {
                    const imgResponse = await fetch('/api/generate-image', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ prompt: result.englishName || result.result }),
                    });

                    if (imgResponse.ok) {
                        const imgData = await imgResponse.json();
                        if (imgData.base64) {
                            imageUrl = `data:image/png;base64,${imgData.base64}`;
                        }
                    }
                } catch (imgError) {
                    console.warn('画像生成スキップ:', imgError);
                }
            }

            onSuccess({ ...result, imageUrl });

            setIsSynthesizing(false);
            toast.success(`${result.emoji} ${result.result}`, {
                description: result.reason,
            });

        } catch (error: unknown) {
            console.error('Synthesis Error:', error);
            const errorMessage = error instanceof Error ? error.message : String(error);
            setIsSynthesizing(false);
            toast.error('錬金術に失敗しました', {
                description: errorMessage,
            });
        }
    };

    return {
        isSynthesizing,
        performSynthesis,
    };
}
