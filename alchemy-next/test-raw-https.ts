import https from 'https';

function testConnection(host: string, path: string) {
    console.log(`\n--- Testing https://${host}${path} ---`);
    const options = {
        hostname: host,
        port: 443,
        path: path,
        method: 'GET',
        agent: false, // Disable pooling
        headers: {
            'User-Agent': 'NodeJS/Test',
            'Connection': 'close'
        }
    };

    const req = https.request(options, (res) => {
        console.log(`[${host}] Status: ${res.statusCode} ${res.statusMessage}`);
        res.on('data', (d) => {
            // console.log(`[${host}] Data: ${d.toString().substring(0, 50)}...`);
        });
    });

    req.on('error', (e) => {
        console.error(`[${host}] Connection Error:`, e.message);
    });

    req.end();
}

testConnection('oauth2.googleapis.com', '/.well-known/openid-configuration');
testConnection('generativelanguage.googleapis.com', '/v1beta/models');
testConnection('us-central1-aiplatform.googleapis.com', '/');
