import { GoogleAuth } from 'google-auth-library';
import https from 'https';

let cachedAuth: GoogleAuth | null = null;
let cachedProjectId: string | null = null;

/**
 * Ensures GoogleAuth is initialized and returns the authenticated client and projectId.
 * Useful for Next.js API routes that need to make REST calls to Vertex AI.
 */
export async function getVertexAuth() {
    if (!cachedAuth) {
        cachedAuth = new GoogleAuth({
            scopes: [
                'https://www.googleapis.com/auth/cloud-platform',
                'https://www.googleapis.com/auth/generative-language'
            ],
        });


        // Use a more stable transporter to avoid fetch-related ECONNRESET
        // google-auth-library handles this internally but we can try to influence it.
    }

    if (!cachedProjectId) {
        cachedProjectId = await cachedAuth.getProjectId();
    }

    const client = await cachedAuth.getClient();

    // Attempt to get token - if this still fails with ECONNRESET, we'll try raw https fallback
    const accessToken = await client.getAccessToken();

    if (!accessToken.token) {
        throw new Error('Failed to retrieve access token from GoogleAuth');
    }

    return {
        projectId: cachedProjectId,
        accessToken: accessToken.token,
    };
}

