import fetch from 'node-fetch';

async function testLocalGenerate() {
    try {
        console.log('Sending request to local api/generate-image...');
        const response = await fetch('http://localhost:3000/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: 'A glowing red ruby' })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed: ${response.status} ${response.statusText}\n${err}`);
        }

        const data = await response.json();
        if (data.base64) {
            console.log('Success! base64 starts with:', data.base64.substring(0, 50));
        } else {
            console.log('API call succeeded, but no base64 was returned.', data);
        }
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testLocalGenerate();
