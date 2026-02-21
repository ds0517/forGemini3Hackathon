import { VertexAI } from '@google-cloud/vertexai';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '.env.local') });

async function listModels() {
    const projectId = process.env.GOOGLE_PROJECT_ID || 'gen-lang-client-0002958179';
    const regions = ['us-central1', 'asia-northeast1', 'us-west1', 'us-east1', 'europe-west1', 'europe-west4', 'asia-southeast1'];

    console.log(`Listing models for project: ${projectId}`);

    for (const region of regions) {
        console.log(`\n--- Testing Region: ${region} ---`);
        const vertexAI = new VertexAI({ project: projectId, location: region });
        try {
            const model = vertexAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent('Say ok');
            // @ts-ignore
            console.log(`[${region}] Success! Response:`, JSON.stringify(result.response));
            break;
        } catch (err: any) {
            console.log(`[${region}] Failed: ${err.message?.split('\n')[0]}`);
        }
    }
}

listModels();
