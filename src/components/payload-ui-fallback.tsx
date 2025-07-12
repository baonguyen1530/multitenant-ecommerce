import React from 'react';

// Fallback component for PayloadCMS UI assets that require sharp
export const PayloadUIFallback: React.FC<{ src: string; alt: string; className?: string }> = ({ 
  src, 
  alt, 
  className 
}) => {
  // Return a simple div with background color instead of the image
  return (
    <div 
      className={className}
      style={{
        backgroundColor: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '12px'
      }}
    >
      {alt}
    </div>
  );
};

export default PayloadUIFallback; 