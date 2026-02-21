import { NextResponse } from 'next/server';
import { getVertexAuth } from '../../../lib/vertex';
import https from 'https';
import { IncomingMessage } from 'http';

export async function POST(req: Request) {
    try {
        const { element1, element2, alchemist } = await req.json();

        if (!element1 || !element2 || !alchemist) {
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        const { projectId, accessToken } = await getVertexAuth();

        // Testing gemini-2.0-flash-exp as it responded with 400 (not 404) in prior tests
        const url = `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/us-central1/publishers/google/models/gemini-2.0-flash-exp:generateContent`;

        console.log('--- Synthesis Request (Vertex gemini-2.0-flash-exp) ---');
        console.log('URL:', url);

        const systemInstruction = `あなたは「${alchemist.name}」という錬金術師です。\n以下のルールに従って、2つの要素を組み合わせて新しい要素（名前、英名、絵文字、理由）を作成してください。\n\n【あなたのルール】\n${alchemist.rule}\n\n【出力形式】\n必ず以下の形式のJSONで出力してください。\n{\n  "result": "新しい要素の名前",\n  "englishName": "English name",\n  "emoji": "代表的な絵文字1つ",\n  "reason": "短い理由"\n}`;

        const prompt = `要素1: ${element1.emoji} ${element1.name}\n要素2: ${element2.emoji} ${element2.name}\n\nこれらは組み合わさると何になりますか？`;

        const requestBody = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            systemInstruction: { parts: [{ text: systemInstruction }] },
            generationConfig: {
                responseMimeType: 'application/json',
            }
        };

        // Use native https instead of fetch to avoid ECONNRESET issues with Vertex AI endpoints in Node
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const responseData = await new Promise<any>((resolve, reject) => {
            const reqUrl = new URL(url);
            const options = {
                hostname: reqUrl.hostname,
                path: reqUrl.pathname,
                method: 'POST',
                timeout: 30000, // 30 seconds timeout
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                }
            };

            const httpsReq = https.request(options, (res: IncomingMessage) => {
                let data = '';
                res.on('data', (chunk: Buffer | string) => { data += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(data);
                        if (res.statusCode && res.statusCode >= 400) {
                            reject(new Error(`Failed to fetch from Vertex AI: ${res.statusCode} ${JSON.stringify(parsed)}`));
                        } else {
                            resolve(parsed);
                        }
                    } catch (e) {
                        reject(new Error(`Failed to parse response: ${data}`));
                    }
                });
            });

            httpsReq.on('error', (e) => reject(e));
            httpsReq.on('timeout', () => {
                httpsReq.destroy();
                reject(new Error('Vertex AI Request Timeout. The server is not responding.'));
            });
            httpsReq.write(JSON.stringify(requestBody));
            httpsReq.end();
        });

        const text = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error('APIからテキストが返されませんでした');
        }

        try {
            const parsedData = JSON.parse(text);
            return NextResponse.json(parsedData);
        } catch (parseError) {
            console.error('Failed to parse Gemini response as JSON:', text);
            throw new Error('APIからの応答が正しいJSON形式ではありませんでした');
        }



    } catch (error: unknown) {
        console.error('Synthesis Error Details (Raw):', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            error: 'Synthesis failed',
            details: errorMessage
        }, { status: 500 });
    }
}
