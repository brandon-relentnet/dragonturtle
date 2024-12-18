'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { Client } from '@signalk/client';

const SignalKContext = createContext();

export function SignalKProvider({ children }) {
    const [groupedData, setGroupedData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const SERVER_HOSTNAME = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'demo.signalk.org';
        const SERVER_PORT = process.env.NEXT_PUBLIC_SK_SERVER_PORT || 443;

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

        client.on('connected', () => {
            console.log('WebSocket connected to Signal K server');

            client.subscribe([
                {
                    context: 'vessels.self',
                    subscribe: [{ path: '' }],
                },
            ]);
        });

        client.on('delta', (delta) => {
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
        <SignalKContext.Provider value={{ groupedData, error }}>
            {children}
        </SignalKContext.Provider>
    );
}

export function useSignalK() {
    return useContext(SignalKContext);
}
