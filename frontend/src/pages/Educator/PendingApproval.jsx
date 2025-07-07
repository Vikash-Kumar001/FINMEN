import React from "react";

const PendingApproval = () => {
    return (
        <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                    🚧 Pending Approval
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                    Your educator account is currently under review. You will be notified once approved.
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
