"use client";

import { useSignalK } from './SignalKContext';

export default function SignalKDashboard() {
    const { groupedData, error } = useSignalK();

    return (
        <div className='p-4'>
            <h1 className='text-3xl font-bold mb-4'>SignalK Dashboard</h1>
            {error && <p className='text-red-500'>{error}</p>}

            <div className='mt-4'>
                {Object.keys(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([section, data]) => (
                        <div key={section} className='mb-4'>
                            <h2 className='text-2xl font-semibold mb-2'>{section.toUpperCase()}</h2>
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
