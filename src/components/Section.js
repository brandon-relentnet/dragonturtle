"use client";

import DataPoint from "./DataPoint";

export default function Section({
    sectionName,
    data,
    editMode,
    isSelected,
    onCheckboxChange,
}) {
    const filteredData = editMode
        ? data
        : Object.entries(data).reduce((acc, [key, value]) => {
            if (isSelected(sectionName, key)) {
                acc[key] = value;
            }
            return acc;
        }, {});
    
    if (!editMode && Object.keys(filteredData).length === 0) {
        return null;
    }

    return (
        <div className="mb-4">
            <h2 className="text-2xl font-semibold mb-2">{sectionName.toUpperCase()}</h2>
            <ul className="list-disc ml-4">
                {Object.entries(filteredData).map(([key, value]) => (
                    <DataPoint
                        key={key}
                        section={sectionName}
                        keyName={key}
                        value={value}
                        editMode={editMode}
                        isSelected={isSelected}
                        onCheckboxChange={onCheckboxChange}
                    />
                ))}
            </ul>
        </div>
    );
}