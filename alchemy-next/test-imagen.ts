import { getVertexAuth } from './src/lib/vertex';
import fetch from 'node-fetch';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

async function testImagen() {
    try {
        console.log('Authenticating...');
        const { projectId, accessToken } = await getVertexAuth();

        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`;

        const requestBody = {
            instances: [
                {
                    prompt: `A single 16-bit pixel art icon of Apple, an inanimate RPG game item asset. Clean, isolated on a transparent white background. Masterpiece, no characters unless it is a creature.`
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: '1:1',
                outputOptions: { mimeType: 'image/png' }
            }
        };

        console.log('Sending request to Imagen 3 API...');
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch: ${response.status} ${response.statusText}\n${errorText}`);
        }

        const data = await response.json();
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (base64) {
            const buffer = Buffer.from(base64, 'base64');
            const outputPath = path.join(process.cwd(), 'test-output.png');
            fs.writeFileSync(outputPath, buffer);
            console.log(`Success! Image saved to ${outputPath}`);
        } else {
            console.log('API call succeeded, but no image was returned.');
        }

    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testImagen();
