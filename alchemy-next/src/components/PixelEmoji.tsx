import { useEffect, useRef } from 'react';

interface PixelEmojiProps {
    emoji: string;
    size?: number; // 表示サイズ（px）
}

export function PixelEmoji({ emoji, size = 32 }: PixelEmojiProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // 内部的な解像度（ドット絵の粗さ） = 16pxに設定
        const pixelSize = 16;

        // キャンバスのリセット
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // テキスト設定
        ctx.font = `${pixelSize - 2}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // 中央に絵文字を描画
        ctx.fillText(emoji, canvas.width / 2, canvas.height / 2 + 1); // OSによる微妙なズレを+1で補正
    }, [emoji]);

    return (
        <canvas
            ref={canvasRef}
            width={16}
            height={16}
            style={{
                width: `${size}px`,
                height: `${size}px`,
                imageRendering: 'pixelated', // これがドット絵感を出す決め手
                display: 'inline-block'
            }}
            title={emoji}
        />
    );
}
