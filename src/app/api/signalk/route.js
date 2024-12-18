import { NextResponse } from 'next/server';
import { Client } from '@signalk/client';

const SERVER_HOSTNAME = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'demo.signalk.org';
const SERVER_PORT = process.env.NEXT_PUBLIC_SK_SERVER_PORT || '443';

const client = new Client({
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    useTLS: false,
    reconnect: true,
    autoConnect: true,
    notifications: false,
});

export async function GET() {
    console.log("Connecting to Signal K server...");
    try {
        await client.connect();

        const api = await client.API();
        const rootData = await api.get('/');
        const selfKey = rootData.self;

        if (!selfKey) {
            throw new Error('UUID key not found in root data');
        }

        const vesselData = rootData.vessels?.[selfKey.replace('vessels.', '')];

        if (!vesselData) {
            throw new Error('Vessel data not found under vessels');
        }

        return NextResponse.json({
            message: 'Fetched Raspberry Pi Data:',
            data: vesselData
        });
    } catch (error) {
        console.error("Connection error details: ", error);
        return NextResponse.json({ error: `Error connecting to Signal K server: ${error.message}` }, { status: 500 });
    }
};