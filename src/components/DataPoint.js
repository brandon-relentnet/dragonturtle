"use client";

export default function DataPoint({
    section,
    keyName,
    value,
    editMode,
    isSelected,
    onCheckboxChange,
}) {
    return (
        <li className="flex items-center">
            {editMode && (
                <input
                    type="checkbox"
                    checked={isSelected(section, keyName)}
                    onChange={() => onCheckboxChange(section, keyName)}
                    className="mr-2"
                />
            )}
            <strong>{keyName}:</strong>{" "}
            {typeof value === "number" ? value : JSON.stringify(value)}
        </li>
    );
}