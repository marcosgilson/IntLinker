import React from 'react';

export default function PageContainer({ children, className = '', maxWidthClass = 'max-w-7xl' }) {
    return (
        <div className={`mx-auto ${maxWidthClass} px-4 sm:px-6 lg:px-8 ${className}`.trim()}>
            {children}
        </div>
    );
}
