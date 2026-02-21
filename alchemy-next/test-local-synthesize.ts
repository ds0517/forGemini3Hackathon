import fetch from 'node-fetch';

async function testLocalSynthesize() {
    try {
        console.log('Sending request to local api/synthesize...');
        const response = await fetch('http://localhost:3000/api/synthesize', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                element1: { name: "水", emoji: "💧" },
                element2: { name: "火", emoji: "🔥" },
                alchemist: { name: "見習い", rule: "常識的な結果を返せ" }
            })
        });

        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed: ${response.status} ${response.statusText}\n${err}`);
        }

        const data = await response.json();
        console.log('Success! Synthesize result:', data);
    } catch (err) {
        console.error('Test Failed:', err);
    }
}

testLocalSynthesize();
