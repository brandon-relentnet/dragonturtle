'use client';

import { useEffect, useState } from 'react';
import { Client } from '@signalk/client';

const SERVER_HOSTNAME = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'demo.signalk.org';
const SERVER_PORT = process.env.NEXT_PUBLIC_SK_SERVER_PORT || 443;

export default function SignalKDashboard() {
    const [cpuData, setCpuData] = useState({});
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
                        { path: 'environment.rpi.cpu' },
                    ],
                },
            ]);
        });

        // Handle incoming delta updates
        client.on('delta', (delta) => {
            console.log('Delta Update Received:', delta);
            
            setCpuData((prevCpuData) => {
                const updatedData = { ...prevCpuData };

                delta.updates?.forEach((update) => {
                    update.values?.forEach((value) => {
                        const fullPath = value.path;
                        updatedData[fullPath] = value.value;
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
            <h1>SignalK Real-Time CPU Dashboard</h1>
            {error && <p className='text-red-500'>Error: {error}</p>}
            
            <div className='mt-4'>
                <h2>CPU Data</h2>
                {Object.keys(cpuData).length > 0 ? (
                    <ul>
                        {Object.entries(cpuData).map(([path, value]) => (
                            <li key={path}>
                                <strong>{path}:</strong> {typeof value === 'number' ? value : JSON.stringify(value)}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Waiting for CPU data...</p>
                )}
            </div>
        </div>
    );
}
