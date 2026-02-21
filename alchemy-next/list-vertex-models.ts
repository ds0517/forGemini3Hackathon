import { getVertexAuth } from './src/lib/vertex';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function listModels() {
    try {
        const { projectId, accessToken } = await getVertexAuth();
        const models = [
            'gemini-1.5-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-flash-002',
            'gemini-2.0-flash-exp',
            'gemini-1.0-pro'
        ];

        for (const model of models) {
            const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:generateContent`;
            console.log(`Testing [v1] ${model}...`);
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
            });
            console.log(`[v1] ${model}: ${response.status}`);
            if (response.status === 200) {
                console.log(`SUCCESS: Found working model ${model} at v1`);
                return;
            }

            const urlBeta = `https://us-central1-aiplatform.googleapis.com/v1beta1/projects/${projectId}/locations/us-central1/publishers/google/models/${model}:streamGenerateContent`;
            console.log(`Testing [v1beta1] ${model}...`);
            const responseBeta = await fetch(urlBeta, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contents: [{ parts: [{ text: 'hi' }] }] })
            });
            console.log(`[v1beta1] ${model}: ${responseBeta.status}`);
            if (responseBeta.status === 200) {
                console.log(`SUCCESS: Found working model ${model} at v1beta1`);
                return;
            }
        }
    } catch (err) {
        console.error('List Models Failed:', err);
    }
}

listModels();
