'use client';

import { useState } from 'react';
import { useSignalK } from './SignalKContext';
import Section from './Section';

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

            // Clone the Set if it exists, or create a new Set
            const sectionSet = new Set(updated[section] || []);

            if (sectionSet.has(key)) {
                sectionSet.delete(key); // Unselect the key
                if (sectionSet.size === 0) {
                    delete updated[section]; // Remove empty sections
                } else {
                    updated[section] = sectionSet; // Update section with cloned Set
                }
            } else {
                sectionSet.add(key); // Add new key
                updated[section] = sectionSet; // Update section with cloned Set
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
                        <Section
                            key={section}
                            sectionName={section}
                            data={data}
                            editMode={editMode}
                            isSelected={isSelected}
                            onCheckboxChange={handleCheckboxChange}
                        />
                    ))
                ) : (
                    <p>Waiting for data...</p>
                )}
            </div>
        </div>
    );
}
