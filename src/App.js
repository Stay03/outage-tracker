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