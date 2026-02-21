import { getVertexAuth } from './src/lib/vertex';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function printAuth() {
    try {
        const auth = await getVertexAuth();
        console.log('PROJECT_ID=' + auth.projectId);
        console.log('ACCESS_TOKEN=' + auth.accessToken);
    } catch (err) {
        console.error(err);
    }
}

printAuth();
