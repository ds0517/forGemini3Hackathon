import { GoogleGenAI } from '@google/genai';
import { Alchemist, CombinationResult, Element } from '../types/game';

// 環境変数からAPIキーを取得
// viteでは import.meta.env.VITE_XXX の形式でアクセスする
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

// APIキーが設定されていない場合はエラーを投げるか、モック用のフォールバックを用意する
if (!apiKey) {
    console.warn("VITE_GEMINI_API_KEY is not set in .env.local!");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

export async function synthesizeElements(
    element1: Element,
    element2: Element,
    alchemist: Alchemist
): Promise<CombinationResult> {
    const systemInstruction = `あなたは「${alchemist.name}」という錬金術師です。
以下のルールに従って、2つの要素を組み合わせて新しい要素（名前、絵文字、理由）を作成してください。

【あなたのルール】
${alchemist.rule}

【出力形式】
必ず以下の形式のJSONで出力してください（マークダウンのコードブロックは不要です）。
{
  "result": "새로운 요소의 이름 (例: 蒸気, モーター, 伝導)",
  "emoji": "代表的な絵文字1つ",
  "reason": "なぜその結果になったのかの短い理由"
}`;

    const prompt = `要素1: ${element1.emoji} ${element1.name}\n要素2: ${element2.emoji} ${element2.name}\n\nこれらを組み合わせると何になりますか？`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // 最新の高速モデルを使用
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json',
            },
        });

        const text = response.text;
        if (!text) {
            throw new Error('APIからテキストが返されませんでした');
        }

        const result = JSON.parse(text) as CombinationResult;
        return result;
    } catch (error: any) {
        console.error('合成エラーの全貌:', error);

        // 開発環境で何が起きているか詳細を投げる
        let errorMsg = '錬金術に失敗しました。';
        if (error.message) {
            errorMsg = `APIエラー: ${error.message}`;
        }
        throw new Error(errorMsg);
    }
}
