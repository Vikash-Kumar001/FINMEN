import React from "react";

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">{title}</div>
            <div className="text-xl font-semibold">{value}</div>
            {icon && <div className="text-2xl mt-2">{icon}</div>}
        </div>
    );
};

export default StatCard;
