import React from 'react';
import './LoadingSkeleton.css';

interface LoadingSkeletonProps {
  type: 'text' | 'rectangle' | 'circle';
  width?: string;
  height?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ type, width, height }) => {
  return (
    <div 
      className={`skeleton skeleton-${type}`}
      style={{ width, height }}
    >
      <div className="skeleton-animation"></div>
    </div>
  );
};

export default LoadingSkeleton; 