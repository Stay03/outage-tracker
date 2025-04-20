# Codebase Documentation

{
  "Extraction Date": "2025-04-20 02:29:30",
  "Include Paths": [
    "src/components/OutageCalendar.jsx",
    "src/components/OutageDay.jsx",
    "src/components/OutageForm.jsx",
    "src/components/OutageStats.jsx",
    "src/utils/outageUtils.js",
    "src/App.js"
  ],
  "List-Only Paths": [
    "src"
  ]
}

### src\App.css [List Only]

### src\App.js
```
import React, { useState, useEffect } from 'react';
import OutageCalendar from './components/OutageCalendar';
import OutageForm from './components/OutageForm';
import OutageStats from './components/OutageStats';
import { loadOutageData, saveOutageData } from './utils/outageUtils';

function App() {
  const [outages, setOutages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('calendar'); // 'calendar', 'add', 'stats'
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(null); // null means show all months

  // Load outage data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await loadOutageData();
        setOutages(data);
        setError(null);
      } catch (err) {
        setError('Failed to load outage data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle adding a new outage
  const handleAddOutage = async (newOutage) => {
    // Generate a unique ID
    newOutage.id = Date.now().toString();
    
    // Add to state
    const updatedOutages = [...outages, newOutage];
    setOutages(updatedOutages);
    
    // Save to storage
    await saveOutageData(updatedOutages);
    
    // Switch back to calendar view
    setActiveTab('calendar');
  };

  // Handle year change for calendar
  const handleYearChange = (newYear) => {
    setYear(parseInt(newYear, 10));
  };

  // Handle month change for calendar
  const handleMonthChange = (newMonth) => {
    setMonth(newMonth === "all" ? null : parseInt(newMonth, 10));
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your outage data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Power Outage Tracker</h1>
          <p className="text-gray-600 mt-2">
            Track and visualize your electricity downtime
          </p>
        </header>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
            <p>{error}</p>
          </div>
        )}

        {/* Navigation tabs */}
        <div className="mb-6 flex justify-center border-b border-gray-200">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'calendar'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar View
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'add'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('add')}
          >
            Add Outage
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'stats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('stats')}
          >
            Statistics
          </button>
        </div>

        {/* Year and Month selectors (only for calendar view) */}
        {activeTab === 'calendar' && (
          <div className="mb-6 flex justify-center gap-4">
            <div className="flex items-center">
              <label htmlFor="year-select" className="mr-2 font-medium">
                Year:
              </label>
              <select
                id="year-select"
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="border-gray-300 rounded-md"
              >
                {[2022, 2023, 2024, 2025, 2026].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center">
              <label htmlFor="month-select" className="mr-2 font-medium">
                Month:
              </label>
              <select
                id="month-select"
                value={month === null ? "all" : month}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="border-gray-300 rounded-md"
              >
                <option value="all">All Months</option>
                <option value="0">January</option>
                <option value="1">February</option>
                <option value="2">March</option>
                <option value="3">April</option>
                <option value="4">May</option>
                <option value="5">June</option>
                <option value="6">July</option>
                <option value="7">August</option>
                <option value="8">September</option>
                <option value="9">October</option>
                <option value="10">November</option>
                <option value="11">December</option>
              </select>
            </div>
          </div>
        )}

        {/* Main content area */}
        <main>
          {activeTab === 'calendar' && (
            <OutageCalendar outages={outages} year={year} month={month} />
          )}
          
          {activeTab === 'add' && (
            <OutageForm onAddOutage={handleAddOutage} />
          )}
          
          {activeTab === 'stats' && (
            <OutageStats outages={outages} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
```

### src\App.test.js [List Only]

### src\index.css [List Only]

### src\index.js [List Only]

### src\logo.svg [List Only]

### src\reportWebVitals.js [List Only]

### src\setupTests.js [List Only]

### src\components\MonthStats.js [List Only]

### src\components\OutageCalendar.jsx
```
import React, { useMemo } from 'react';
import { startOfYear, endOfYear, startOfMonth, endOfMonth, eachDayOfInterval, format, isEqual, isSameDay, isSameMonth, getMonth } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import OutageDay from './OutageDay';
import MonthStats from './MonthStats';

const OutageCalendar = ({ outages, year = new Date().getFullYear(), month = null }) => {
  // Generate days based on selected year and month
  const days = useMemo(() => {
    if (month === null) {
      // Generate all days of the year
      const yearStart = startOfYear(new Date(year, 0, 1));
      const yearEnd = endOfYear(new Date(year, 0, 1));
      return eachDayOfInterval({ start: yearStart, end: yearEnd });
    } else {
      // Generate days for the selected month
      const monthStart = startOfMonth(new Date(year, month, 1));
      const monthEnd = endOfMonth(new Date(year, month, 1));
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    }
  }, [year, month]);

  // Calculate outage hours for each day
  const getOutageHoursForDay = (day) => {
    // Filter outages that occur on this day
    const dayOutages = outages.filter(outage => {
      const startDate = new Date(outage.startTime);
      const endDate = new Date(outage.endTime);
      
      // Check if this outage overlaps with the current day
      return (
        isSameDay(startDate, day) || 
        isSameDay(endDate, day) ||
        (startDate < day && endDate > day)
      );
    });

    if (dayOutages.length === 0) return { hours: 0, outages: [] };

    // Calculate total outage hours for this day
    let totalHours = 0;
    
    // Process each outage
    dayOutages.forEach(outage => {
      const startDate = new Date(outage.startTime);
      const endDate = new Date(outage.endTime);
      
      // Set day start and end boundaries
      const dayStart = new Date(day);
      dayStart.setHours(0, 0, 0, 0);
      
      const dayEnd = new Date(day);
      dayEnd.setHours(23, 59, 59, 999);
      
      // Calculate the overlap between the outage and this day
      const overlapStart = startDate < dayStart ? dayStart : startDate;
      const overlapEnd = endDate > dayEnd ? dayEnd : endDate;
      
      // Calculate hours (as a decimal)
      const hours = (overlapEnd - overlapStart) / (1000 * 60 * 60);
      totalHours += hours;
    });

    return { hours: totalHours, outages: dayOutages };
  };

  // Group days by month for better display
  const daysByMonth = useMemo(() => {
    const months = {};
    days.forEach(day => {
      const monthKey = format(day, 'MMM');
      if (!months[monthKey]) {
        months[monthKey] = [];
      }
      months[monthKey].push(day);
    });
    return months;
  }, [days]);

  // Calendar title based on selection
  const calendarTitle = month === null 
    ? `Power Outage Calendar ${year}` 
    : `Power Outage Calendar - ${format(new Date(year, month, 1), 'MMMM yyyy')}`;

  // Calculate the size of day cells based on view
  const dayCellSize = month === null ? 'w-6 h-6' : 'w-10 h-10';
  const dayTextSize = month === null ? 'text-xs' : 'text-base';
  const gapSize = month === null ? 'gap-1' : 'gap-1';

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const monthVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  // Render different layouts based on view type
  if (month === null) {
    // Year view (all months)
    return (
      <motion.div 
        className="w-full max-w-6xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">{calendarTitle}</h2>
        
        <motion.div 
          className="flex flex-wrap gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {Object.entries(daysByMonth).map(([monthName, monthDays]) => (
            <motion.div 
              key={monthName} 
              className="mb-6 mr-6"
              variants={monthVariants}
              layoutId={`month-${monthName}`}
            >
              <h3 className="text-sm font-medium mb-2">
                {monthName}
              </h3>
              <div className={`grid grid-cols-7 ${gapSize}`}>
                {/* Add empty cells for alignment */}
                {[...Array(new Date(monthDays[0]).getDay())].map((_, i) => (
                  <div key={`empty-${i}`} className={dayCellSize}></div>
                ))}
                
                {/* Render days */}
                {monthDays.map(day => {
                  const { hours, outages: dayOutages } = getOutageHoursForDay(day);
                  return (
                    <OutageDay 
                      key={format(day, 'yyyy-MM-dd')}
                      date={day}
                      outageHours={hours}
                      outages={dayOutages}
                      size={dayCellSize}
                      textSize={dayTextSize}
                    />
                  );
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Calendar legend */}
        <div className="mt-6 flex items-center text-sm">
          <span className="mr-2">Less</span>
          <div className="flex gap-1">
            <div className="w-4 h-4 bg-green-100 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-100 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-200 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-300 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
            <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
            <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
          </div>
          <span className="ml-2">More</span>
        </div>
      </motion.div>
    );
  } else {
    // Month view (side-by-side layout)
    const monthName = format(new Date(year, month), 'MMM');
    const monthDays = daysByMonth[monthName] || [];
    
    return (
      <motion.div 
        className="w-full max-w-6xl mx-auto p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-6">{calendarTitle}</h2>
        
        {/* Side-by-side layout for month view */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Stats card (left side) */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <MonthStats outages={outages} year={year} month={month} />
          </motion.div>
          
          {/* Calendar (right side) */}
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            layoutId={`month-${monthName}`}
          >
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-medium mb-4 text-center">
                {monthName}
              </h3>
              
              <div className={`grid grid-cols-7 ${gapSize} justify-center`}>
                {/* Day of week headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 mb-2">
                    {day}
                  </div>
                ))}
                
                {/* Add empty cells for alignment */}
                {monthDays.length > 0 && [...Array(new Date(monthDays[0]).getDay())].map((_, i) => (
                  <div key={`empty-${i}`} className={dayCellSize}></div>
                ))}
                
                {/* Render days */}
                {monthDays.map(day => {
                  const { hours, outages: dayOutages } = getOutageHoursForDay(day);
                  return (
                    <OutageDay 
                      key={format(day, 'yyyy-MM-dd')}
                      date={day}
                      outageHours={hours}
                      outages={dayOutages}
                      size={dayCellSize}
                      textSize={dayTextSize}
                    />
                  );
                })}
              </div>
              
              {/* Calendar legend */}
              <div className="mt-6 flex items-center text-sm justify-center">
                <span className="mr-2">Less</span>
                <div className="flex gap-1">
                  <div className="w-4 h-4 bg-green-100 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-100 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-200 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-300 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-400 rounded-sm"></div>
                  <div className="w-4 h-4 bg-orange-500 rounded-sm"></div>
                  <div className="w-4 h-4 bg-red-600 rounded-sm"></div>
                </div>
                <span className="ml-2">More</span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
};

export default OutageCalendar;
```

### src\components\OutageDay.jsx
```
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
```

### src\components\OutageForm.jsx
```
import React, { useState } from 'react';
import { format } from 'date-fns';

const OutageForm = ({ onAddOutage }) => {
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!startDate || !startTime || !endDate || !endTime) {
      setError('All fields are required');
      return;
    }
    
    // Create date objects for comparison
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    // Validate date/time logic
    if (endDateTime <= startDateTime) {
      setError('End time must be after start time');
      return;
    }
    
    // Create outage object
    const newOutage = {
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString()
    };
    
    // Call parent handler
    onAddOutage(newOutage);
    
    // Reset form
    setStartDate('');
    setStartTime('');
    setEndDate('');
    setEndTime('');
    setError('');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Power Outage</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time
            </label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200"
        >
          Add Outage
        </button>
      </form>
    </div>
  );
};

export default OutageForm;
```

### src\components\OutageStats.jsx
```
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
```

### src\utils\outageUtils.js
```
import { 
    isSameDay, 
    eachDayOfInterval, 
    format, 
    startOfDay, 
    endOfDay 
  } from 'date-fns';
  
  /**
   * Loads outage data from the JSON file
   * @returns {Promise<Array>} Array of outage objects
   */
  export const loadOutageData = async () => {
    try {
      const response = await fetch('/data.json');
      if (!response.ok) {
        throw new Error('Failed to load outage data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading outage data:', error);
      return [];
    }
  };
  
  /**
   * Saves outage data to the JSON file (in a real app, this would be a server API call)
   * @param {Array} outages - Array of outage objects
   * @returns {Promise<boolean>} Success status
   */
  export const saveOutageData = async (outages) => {
    try {
      // In a real app, this would be an API call to save to the server
      // For a demo, we might use localStorage instead
      localStorage.setItem('outageData', JSON.stringify(outages));
      return true;
    } catch (error) {
      console.error('Error saving outage data:', error);
      return false;
    }
  };
  
  /**
   * Splits an outage that spans multiple days into day segments
   * @param {Object} outage - Outage object with startTime and endTime
   * @returns {Array} Array of day-specific outage objects
   */
  export const splitOutageByDays = (outage) => {
    const startDate = new Date(outage.startTime);
    const endDate = new Date(outage.endTime);
    
    // If same day, no need to split
    if (isSameDay(startDate, endDate)) {
      return [outage];
    }
    
    // Get all days in the interval
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Create day-specific outage objects
    return days.map((day, index) => {
      if (index === 0) {
        // First day: from start time to end of day
        return {
          ...outage,
          endTime: endOfDay(day).toISOString(),
          _originalId: outage.id || null // Keep reference to original
        };
      } else if (index === days.length - 1) {
        // Last day: from start of day to end time
        return {
          ...outage,
          startTime: startOfDay(day).toISOString(),
          _originalId: outage.id || null
        };
      } else {
        // Middle days: full day
        return {
          ...outage,
          startTime: startOfDay(day).toISOString(),
          endTime: endOfDay(day).toISOString(),
          _originalId: outage.id || null
        };
      }
    });
  };
  
  /**
   * Calculates outage duration in hours
   * @param {Object} outage - Outage object with startTime and endTime
   * @returns {number} Duration in hours
   */
  export const calculateOutageDuration = (outage) => {
    const startDate = new Date(outage.startTime);
    const endDate = new Date(outage.endTime);
    
    // Duration in milliseconds
    const durationMs = endDate - startDate;
    
    // Convert to hours
    return durationMs / (1000 * 60 * 60);
  };
  
  /**
   * Determines color intensity based on outage duration
   * @param {number} hours - Outage duration in hours
   * @returns {number} Color intensity scale (0-6)
   */
  export const getColorIntensity = (hours) => {
    if (hours === 0) return 0;
    if (hours < 1) return 1;
    if (hours < 3) return 2;
    if (hours < 6) return 3;
    if (hours < 12) return 4;
    if (hours < 18) return 5;
    return 6;
  };
  
  /**
   * Format an outage for display
   * @param {Object} outage - Outage object
   * @returns {string} Formatted outage string
   */
  export const formatOutage = (outage) => {
    const startDate = new Date(outage.startTime);
    const endDate = new Date(outage.endTime);
    
    const startStr = format(startDate, 'MMM d, yyyy h:mm a');
    const endStr = format(endDate, 'MMM d, yyyy h:mm a');
    const duration = calculateOutageDuration(outage).toFixed(1);
    
    return `${startStr} to ${endStr} (${duration}h)`;
  };
```

