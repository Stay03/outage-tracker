import React from 'react';
import { format } from 'date-fns';

const OutageDay = ({ date, outageHours, outages = [], size = 'w-6 h-6', textSize = 'text-xs' }) => {
  // Determine color based on outage hours
  const getColorClass = (hours) => {
    if (hours === 0) return 'bg-green-100 hover:bg-green-200';
    if (hours < 1) return 'bg-orange-100 hover:bg-orange-200';
    if (hours < 3) return 'bg-orange-200 hover:bg-orange-300';
    if (hours < 6) return 'bg-orange-300 hover:bg-orange-400';
    if (hours < 12) return 'bg-orange-400 hover:bg-orange-500';
    if (hours < 18) return 'bg-orange-500 hover:bg-orange-600';
    return 'bg-red-600 hover:bg-red-700';
  };

  // Format outage times for tooltip
  const formatOutageDetails = () => {
    if (outages.length === 0) return 'No outages';
    
    return outages.map(outage => {
      const startTime = format(new Date(outage.startTime), 'h:mm a');
      const endTime = format(new Date(outage.endTime), 'h:mm a');
      const duration = ((new Date(outage.endTime) - new Date(outage.startTime)) / (1000 * 60 * 60)).toFixed(1);
      
      return `${startTime} - ${endTime} (${duration}h)`;
    }).join('\n');
  };
  
  // Get day number from date
  const dayNumber = format(date, 'd');

  return (
    <div 
      className={`${size} rounded-sm ${getColorClass(outageHours)} cursor-pointer transition-colors duration-200 flex items-center justify-center ${textSize}`}
      title={`${format(date, 'MMM d, yyyy')}\n${formatOutageDetails()}`}
      aria-label={`${format(date, 'MMMM d, yyyy')}: ${outageHours.toFixed(1)} hours of outage`}
    >
      {dayNumber}
      <span className="sr-only">{outageHours.toFixed(1)} hours of power outage</span>
    </div>
  );
};

export default OutageDay;