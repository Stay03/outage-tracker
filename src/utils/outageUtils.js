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