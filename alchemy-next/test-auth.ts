import { GoogleAuth } from 'google-auth-library';
import fetch from 'node-fetch';

async function testAuth() {
    try {
        console.log('Starting Auth Test...');
        const auth = new GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/cloud-platform',
        });

        console.log('Getting Project ID...');
        const projectId = await auth.getProjectId();
        console.log('Project ID:', projectId);

        console.log('Getting Access Token...');
        const client = await auth.getClient();
        const accessToken = await client.getAccessToken();
        console.log('Access Token retrieved successfully (Length:', accessToken.token?.length, ')');

        const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models`;
        console.log('Testing connectivity to Vertex AI Models endpoint...');

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${accessToken.token}`,
            }
        });

        console.log('Response Status:', response.status);
        if (response.ok) {
            console.log('Successfully connected to Vertex AI!');
        } else {
            const text = await response.text();
            console.error('API Error:', text);
        }
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testAuth();
