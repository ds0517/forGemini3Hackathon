import { NextResponse } from 'next/server';
import { getVertexAuth } from '../../../lib/vertex';
import https from 'https';
import { IncomingMessage } from 'http';

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

        // 共通化されたユーティリティ関数を使ってプロジェクトIDとアクセストークンを取得
        const { projectId, accessToken } = await getVertexAuth();


        // Vertex AI の REST API エンドポイント
        // us-central1 で imagen-3.0-generate-001 を呼び出します
        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;

        const requestBody = {
            instances: [
                {
                    prompt: `A single 16-bit pixel art icon of ${prompt}, an inanimate RPG game item asset. Clean, isolated on a transparent white background. Masterpiece, no characters unless it is a creature.`
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: '1:1',
                outputOptions: { mimeType: 'image/png' }
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

        const base64 = responseData.predictions?.[0]?.bytesBase64Encoded;

        if (!base64) {
            throw new Error('No image generated (or blocked by safety filters)');
        }

        return NextResponse.json({ base64 });

    } catch (error: unknown) {
        console.error('Image Generation Error Details (Raw):', error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            error: 'Image generation failed',
            details: errorMessage
        }, { status: 500 });
    }
}
