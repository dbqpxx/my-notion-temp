// netlify/functions/notion.js
const https = require('https');

exports.handler = async function (event, context) {
    // Only allow POST requests for this proxy
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const body = JSON.parse(event.body);
        const { endpoint, method, payload } = body;

        // Ensure we have the environment variables
        const token = process.env.NOTION_TOKEN;
        const fileDbId = process.env.NOTION_FILE_DB_ID;
        const journalDbId = process.env.NOTION_JOURNAL_DB_ID;

        if (!token) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Missing NOTION_TOKEN in environment variables' })
            };
        }

        // Special debug endpoint: list all databases the integration can see
        if (endpoint === '/debug/list_databases') {
            const searchPayload = JSON.stringify({
                filter: { value: "database", property: "object" }
            });
            const searchOptions = {
                hostname: 'api.notion.com',
                port: 443,
                path: '/v1/search',
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Notion-Version': '2022-06-28',
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(searchPayload)
                }
            };
            return new Promise((resolve) => {
                const req = https.request(searchOptions, (res) => {
                    let resData = '';
                    res.on('data', (chunk) => { resData += chunk; });
                    res.on('end', () => {
                        resolve({
                            statusCode: res.statusCode,
                            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                            body: resData
                        });
                    });
                });
                req.on('error', (e) => {
                    resolve({ statusCode: 500, body: JSON.stringify({ error: e.message }) });
                });
                req.write(searchPayload);
                req.end();
            });
        }

        // We process custom endpoints to securely inject the DB IDs without sending them from frontend
        let actualEndpoint = endpoint;
        if (endpoint === '/databases/file_db/query') {
            actualEndpoint = `/databases/${fileDbId}/query`;
        } else if (endpoint === '/databases/journal_db/query') {
            actualEndpoint = `/databases/${journalDbId}/query`;
        } else if (endpoint === '/pages/file_db') {
            actualEndpoint = `/pages`;
            payload.parent = { database_id: fileDbId };
        } else if (endpoint === '/pages/journal_db') {
            actualEndpoint = `/pages`;
            payload.parent = { database_id: journalDbId };
        }

        const dataString = payload ? JSON.stringify(payload) : '';

        const options = {
            hostname: 'api.notion.com',
            port: 443,
            path: `/v1${actualEndpoint}`,
            method: method || 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Notion-Version': '2022-06-28',
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(dataString)
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let resData = '';
                res.on('data', (chunk) => {
                    resData += chunk;
                });

                res.on('end', () => {
                    resolve({
                        statusCode: res.statusCode,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*' // Or restrict to your specific Netlify URL
                        },
                        body: resData
                    });
                });
            });

            req.on('error', (e) => {
                console.error(e);
                resolve({
                    statusCode: 500,
                    body: JSON.stringify({ error: e.message })
                });
            });

            if (dataString) {
                req.write(dataString);
            }
            req.end();
        });

    } catch (err) {
        console.error(err);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad Request: ' + err.message })
        };
    }
};
