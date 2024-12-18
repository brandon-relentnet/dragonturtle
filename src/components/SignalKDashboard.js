'use client';

import { useState } from 'react';
import { useSignalK } from './SignalKContext';

export default function SignalKDashboard() {
    const { groupedData, error } = useSignalK();
    const [editMode, setEditMode] = useState(false);
    const [selectedData, setSelectedData] = useState({}); // Tracks selected data points

    // Toggle edit mode
    const toggleEditMode = () => setEditMode((prev) => !prev);

    // Handle checkbox changes
    const handleCheckboxChange = (section, key) => {
        setSelectedData((prev) => {
            const updated = { ...prev };
            if (!updated[section]) updated[section] = new Set();

            if (updated[section].has(key)) {
                updated[section].delete(key); // Deselect
                if (updated[section].size === 0) delete updated[section];
            } else {
                updated[section].add(key); // Select
            }

            return updated;
        });
    };

    // Check if a data point is selected
    const isSelected = (section, key) => {
        return selectedData[section]?.has(key) || false;
    };

    return (
        <div className='p-4'>
            <h1 className='text-3xl font-bold mb-4'>SignalK Dashboard</h1>
            {error && <p className='text-red-500'>{error}</p>}

            {/* Edit Mode Toggle Button */}
            <button
                onClick={toggleEditMode}
                className='mb-4 px-4 py-2 bg-blue-500 text-white rounded'
            >
                {editMode ? 'Exit Edit Mode' : 'Enter Edit Mode'}
            </button>

            <div className='mt-4'>
                {Object.keys(groupedData).length > 0 ? (
                    Object.entries(groupedData).map(([section, data]) => (
                        <div key={section} className='mb-4'>
                            <h2 className='text-2xl font-semibold mb-2'>{section.toUpperCase()}</h2>
                            <ul className='list-disc ml-4'>
                                {Object.entries(data).map(([key, value]) => {
                                    // Only show selected data points if not in edit mode
                                    if (!editMode && !isSelected(section, key)) return null;

                                    return (
                                        <li key={key} className='flex items-center'>
                                            {editMode && (
                                                <input
                                                    type='checkbox'
                                                    checked={isSelected(section, key)}
                                                    onChange={() =>
                                                        handleCheckboxChange(section, key)
                                                    }
                                                    className='mr-2'
                                                />
                                            )}
                                            <strong>{key}:</strong>{' '}
                                            {typeof value === 'number'
                                                ? value
                                                : JSON.stringify(value)}
                                        </li>
                                    );
                                })}
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
