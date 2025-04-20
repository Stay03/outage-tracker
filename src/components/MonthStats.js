import React, { useMemo } from 'react';
import { format, differenceInHours, differenceInMinutes, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';

const MonthStats = ({ outages, year, month }) => {
  const stats = useMemo(() => {
    if (!outages || outages.length === 0) {
      return {
        totalOutages: 0,
        totalHours: 0,
        avgDuration: 0,
        mostFrequentHour: null,
        longestOutage: null
      };
    }

    // Create month boundaries
    const monthStart = startOfMonth(new Date(year, month));
    const monthEnd = endOfMonth(new Date(year, month));
    
    // Filter outages for this month
    const monthOutages = outages.filter(outage => {
      const startDate = new Date(outage.startTime);
      const endDate = new Date(outage.endTime);
      
      // Check if outage overlaps with this month
      return (
        isWithinInterval(startDate, { start: monthStart, end: monthEnd }) ||
        isWithinInterval(endDate, { start: monthStart, end: monthEnd }) ||
        (startDate <= monthStart && endDate >= monthEnd)
      );
    });

    if (monthOutages.length === 0) {
      return {
        totalOutages: 0,
        totalHours: 0,
        avgDuration: 0,
        mostFrequentHour: null,
        longestOutage: null
      };
    }

    // Calculate total outage minutes and track hours
    let totalMinutes = 0;
    let hourCounts = Array(24).fill(0);
    let longestOutage = null;
    let longestDuration = 0;

    monthOutages.forEach(outage => {
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
      
      // Count hours affected
      const startHour = startDate.getHours();
      const hoursSpan = Math.ceil(durationMinutes / 60);
      
      for (let i = 0; i < hoursSpan; i++) {
        const hour = (startHour + i) % 24;
        hourCounts[hour]++;
      }
    });

    // Find most frequent hour
    const maxHourCount = Math.max(...hourCounts);
    const mostFrequentHour = hourCounts.indexOf(maxHourCount);
    
    // Format hour for display
    const formatHour = (hour) => {
      return format(new Date().setHours(hour, 0, 0, 0), 'h a');
    };

    return {
      totalOutages: monthOutages.length,
      totalHours: (totalMinutes / 60).toFixed(1),
      avgDuration: (totalMinutes / monthOutages.length / 60).toFixed(1),
      mostFrequentHour: mostFrequentHour !== null ? formatHour(mostFrequentHour) : 'N/A',
      longestOutage: longestOutage ? {
        start: format(new Date(longestOutage.startTime), 'MMM d, yyyy h:mm a'),
        end: format(new Date(longestOutage.endTime), 'MMM d, yyyy h:mm a'),
        duration: (longestDuration / 60).toFixed(1)
      } : null,
      // Calculate percentage of the month affected by outages
      percentageOfMonth: ((totalMinutes / 60) / (24 * new Date(year, month + 1, 0).getDate()) * 100).toFixed(1)
    };
  }, [outages, year, month]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-bold mb-4">
        {format(new Date(year, month), 'MMMM yyyy')} Statistics
      </h3>
      
      <div className="space-y-6">
        {/* Summary at the top */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Month Summary</h4>
          <p className="text-sm">
            In {format(new Date(year, month), 'MMMM')}, you experienced
            <span className="font-bold text-lg ml-1">{stats.totalOutages}</span>
            <span className="mx-1">outages totaling</span>
            <span className="font-bold text-lg">{stats.totalHours}h</span>
            {stats.percentageOfMonth && (
              <span className="ml-1">
                ({stats.percentageOfMonth}% of the month)
              </span>
            )}
          </p>
        </div>
        
        {/* Stat blocks */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Average Duration</h4>
            <p className="text-2xl font-bold">{stats.avgDuration}h</p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="text-sm font-medium text-gray-500">Most Frequent Hour</h4>
            <p className="text-2xl font-bold">{stats.mostFrequentHour}</p>
          </div>
        </div>
        
        {/* Longest outage */}
        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-500">Longest Outage</h4>
          {stats.longestOutage ? (
            <div>
              <p className="font-medium text-sm">{stats.longestOutage.start}</p>
              <p className="font-medium text-sm">to {stats.longestOutage.end}</p>
              <p className="text-xl font-bold mt-1">{stats.longestOutage.duration}h</p>
            </div>
          ) : (
            <p>N/A</p>
          )}
        </div>
        
        {/* Additional insights */}
        {stats.totalOutages > 0 && (
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Month Insights</h4>
            <ul className="text-sm space-y-1">
              {stats.totalHours > 24 && (
                <li className="text-red-600">⚠️ You lost more than 1 full day of power this month!</li>
              )}
              {stats.avgDuration > 3 && (
                <li>Your average outage lasted longer than 3 hours</li>
              )}
              {stats.totalOutages > 5 && (
                <li>You had an above average number of outages this month</li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthStats;