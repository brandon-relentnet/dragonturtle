import { NextResponse } from 'next/server';
import { Client } from '@signalk/client';

const SERVER_HOSTNAME = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'demo.signalk.org';
const SERVER_PORT = process.env.NEXT_PUBLIC_SK_SERVER_PORT || '443';

const client = new Client({
    hostname: SERVER_HOSTNAME,
    port: SERVER_PORT,
    useTLS: true,
    reconnect: true,
    autoConnect: true,
    notifications: false,
});

client.on('error', (error) => {
    console.error('Connection error: ', error);
});

client.on('notification', (notification) => {
    if (notification.updates) {
        console.warn('Recieved undefined notification');
    } else {
        console.log('Notification: ', notification);
    }
});

export async function GET() {
    console.log("Connecting to Signal K server...");
        try {
            await client.connect();
            return NextResponse.json({ message: 'Connected to Signal K server' });
        } catch (error) {
            console.error("Connection error details: ", error);
            return NextResponse.json({ error: `Error connecting to Signal K server: ${error.message}` }, { status: 500 });
        }
    };