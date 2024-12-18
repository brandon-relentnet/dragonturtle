"use client";

import { useEffect, useState } from 'react';

const sk_api = process.env.NEXT_PUBLIC_SK_SERVER_HOSTNAME || 'https://demo.signalk.org/signalk/v1/api/vessels/self';

function SignalKDisplay() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    console.log("SK_API: ", sk_api);

    const generate = () => {
        const fetchData = async () => {
            if (!sk_api) {
                setError("SK_API not set");
                return;
            }

            try {
                const response = await fetch(sk_api);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const result = await response.json();
                setData(result);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchData();
    }

    useEffect(() => {
        generate();
    }, []);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Signal K Display</h1>
            <button
                onClick={generate}
                className='p-4 bg-indigo-500 text-white rounded-lg shadow-lg hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-transform duration-300'
            >
                Refresh Data
            </button>
            <h2>Data</h2>
            <p>Server: {sk_api}</p>
            <p>Signal K data:</p>
            <p>{data.environment.rpi}</p>

            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}

export default SignalKDisplay;