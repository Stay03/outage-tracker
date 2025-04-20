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