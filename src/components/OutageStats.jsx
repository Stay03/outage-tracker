import React, { useMemo } from 'react';
import { format, differenceInHours, differenceInMinutes, getMonth } from 'date-fns';

const OutageStats = ({ outages }) => {
  const stats = useMemo(() => {
    if (!outages || outages.length === 0) {
      return {
        totalOutages: 0,
        totalHours: 0,
        avgDuration: 0,
        mostAffectedHour: null,
        mostAffectedMonth: null,
        longestOutage: null
      };
    }

    // Calculate total outage hours
    let totalMinutes = 0;
    let hourCounts = Array(24).fill(0);
    let monthCounts = Array(12).fill(0);
    let longestOutage = null;
    let longestDuration = 0;

    outages.forEach(outage => {
      const startDate = new Date(outage.startTime);
      const endDate = new Date(outage.endTime);
      
      // Duration in minutes
      const durationMinutes = differenceInMinutes(endDate, startDate);
      totalMinutes += durationMinutes;
      
      // Track longest outage
      if (durationMinutes > longestDuration) {
        longestDuration = durationMinutes;
        longestOutage = outage;
      }
      
      // Count hours affected (simplistic approach)
      const startHour = startDate.getHours();
      const hoursSpan = Math.ceil(durationMinutes / 60);
      
      for (let i = 0; i < hoursSpan; i++) {
        const hour = (startHour + i) % 24;
        hourCounts[hour]++;
      }
      
      // Count months affected
      monthCounts[getMonth(startDate)]++;
    });

    // Find most affected hour
    const maxHourCount = Math.max(...hourCounts);
    const mostAffectedHour = hourCounts.indexOf(maxHourCount);
    
    // Find most affected month
    const maxMonthCount = Math.max(...monthCounts);
    const mostAffectedMonth = monthCounts.indexOf(maxMonthCount);
    
    // Format hour for display
    const formatHour = (hour) => {
      return format(new Date().setHours(hour, 0, 0, 0), 'h a');
    };
    
    // Format month for display
    const formatMonth = (monthIndex) => {
      return format(new Date(2025, monthIndex, 1), 'MMMM');
    };

    return {
      totalOutages: outages.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      avgDuration: (totalMinutes / outages.length / 60).toFixed(1),
      mostAffectedHour: mostAffectedHour !== null ? formatHour(mostAffectedHour) : 'N/A',
      mostAffectedMonth: mostAffectedMonth !== null ? formatMonth(mostAffectedMonth) : 'N/A',
      longestOutage: longestOutage ? {
        start: format(new Date(longestOutage.startTime), 'MMM d, yyyy h:mm a'),
        end: format(new Date(longestOutage.endTime), 'MMM d, yyyy h:mm a'),
        duration: (longestDuration / 60).toFixed(1)
      } : null
    };
  }, [outages]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Outage Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Total Outages</h3>
          <p className="text-3xl font-bold">{stats.totalOutages}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Total Hours</h3>
          <p className="text-3xl font-bold">{stats.totalHours}h</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Average Duration</h3>
          <p className="text-3xl font-bold">{stats.avgDuration}h</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Most Affected Hour</h3>
          <p className="text-3xl font-bold">{stats.mostAffectedHour}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Most Affected Month</h3>
          <p className="text-3xl font-bold">{stats.mostAffectedMonth}</p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-sm font-medium text-gray-500">Longest Outage</h3>
          {stats.longestOutage ? (
            <div>
              <p className="font-medium">{stats.longestOutage.start}</p>
              <p className="font-medium">to {stats.longestOutage.end}</p>
              <p className="text-xl font-bold mt-1">{stats.longestOutage.duration}h</p>
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OutageStats;