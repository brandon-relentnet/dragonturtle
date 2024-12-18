'use client';

import { useEffect, useState } from 'react';
import { Client } from '@signalk/client';

const SERVER_HOSTNAME = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'demo.signalk.org';
const SERVER_PORT = process.env.NEXT_PUBLIC_SK_SERVER_PORT || 443;

export default function SignalKDashboard() {
    const [groupedData, setGroupedData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        // Initialize the Signal K client
        const client = new Client({
            hostname: SERVER_HOSTNAME,
            port: SERVER_PORT,
            useTLS: false,
            reconnect: true,
            autoConnect: true,
            notifications: false,
            deltaStreamBehaviour: 'self',
        });

        console.log('Connecting to Signal K server...');

        // Handle WebSocket connection
        client.on('connected', () => {
            console.log('WebSocket connected to Signal K server');

            // Subscribe to paths
            client.subscribe([
                {
                    context: 'vessels.self',
                    subscribe: [
                        { path: '' },
                    ],
                },
            ]);
        });

        // Handle incoming delta updates
        client.on('delta', (delta) => {
            console.log('Delta Update Received:', delta);

            setGroupedData((prevData) => {
                const updatedData = { ...prevData };

                delta.updates?.forEach((update) => {
                    update.values?.forEach((value) => {
                        const fullPath = value.path;
                        const [section, ...rest] = fullPath.split('.');
                        const key = rest.join('.');

                        if (!updatedData[section]) {
                            updatedData[section] = {};
                        }

                        updatedData[section][key] = value.value;
                    });
                });

                return updatedData;
            });
        });

        client.on('error', (err) => {
            console.error('WebSocket error:', err);
            setError(`WebSocket error: ${err.message}`);
        });

        return () => {
            console.log('Closing WebSocket connection');
            client.disconnect();
        };
    }, []);

    return (
        <div className='p-4'>
            <h1>SignalK Real-Time Dashboard</h1>
            {error && <p className='text-red-500'>Error: {error}</p>}

            <div className='mt-4'>
                {Object.keys(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([section, data]) => (
                        <div key={section} className='mb-4'>
                            <h2 className='text-2xl font-semibold mb-2'>{section}</h2>
                            <ul className='list-disc ml-4'>
                                {Object.entries(data).map(([key, value]) => (
                                    <li key={key}>
                                        <strong>{key}:</strong> {typeof value === 'number' ? value : JSON.stringify(value)}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))
                ) : (
                    <p>Waiting for data...</p>
                )}
            </div>
        </div>
    );
}
