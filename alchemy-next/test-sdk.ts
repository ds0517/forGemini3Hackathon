import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';
import path from 'path';

// Force GOOGLE_APPLICATION_CREDENTIALS to absolute path
process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve('./service-account.json');

async function testSDK() {
    try {
        console.log('Starting Vertex AI SDK Test...');
        console.log('Credentials Path:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

        const vertexAI = new VertexAI({
            project: 'gen-lang-client-0002958179',
            location: 'us-central1',
        });

        const model = vertexAI.getGenerativeModel({
            model: 'gemini-1.5-flash',
        });

        console.log('Sending request to Gemini 1.5 Flash via SDK...');
        const result = await model.generateContent('Hello, respond with OK');
        const response = await result.response;
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text;

        console.log('Response:', text);
        console.log('Vertex AI SDK is working!');
    } catch (err) {
        console.error('Vertex AI SDK Test Failed:', err);
    }
}

testSDK();
