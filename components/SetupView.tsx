
import React, { useState, useEffect } from 'react';
import { TripContext, INTEREST_OPTIONS } from '../types';
import { MapPin, Calendar, Check, Sparkles } from 'lucide-react';
import { fetchCitySuggestions } from '../services/geminiService';

interface SetupViewProps {
  onStart: (data: Partial<TripContext>) => void;
  initialData: TripContext;
}

const SetupView: React.FC<SetupViewProps> = ({ onStart, initialData }) => {
  const [destination, setDestination] = useState(initialData.destination);
  const [startDate, setStartDate] = useState(initialData.startDate);
  const [endDate, setEndDate] = useState(initialData.endDate);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialData.interests);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (destination.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await fetchCitySuggestions(destination);
        setSuggestions(results);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [destination]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest) 
        : [...prev, interest]
    );
  };

  const handleStart = () => {
    if (!destination || !startDate || !endDate || selectedInterests.length === 0) {
      alert("Please fill in all fields and select at least one interest.");
      return;
    }
    onStart({ destination, startDate, endDate, interests: selectedInterests });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your next adventure starts here.</h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg">Tell us where you're going and what you love.</p>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl shadow-indigo-100/50 dark:shadow-none border border-slate-100 dark:border-slate-800 space-y-6">
        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Where to?</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
            <input 
              type="text"
              placeholder="Tokyo, Paris, New York..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
              </div>
            )}
          </div>
          {suggestions.length > 0 && (
            <div className="absolute z-20 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden">
              {suggestions.map(s => (
                <button 
                  key={s}
                  onClick={() => { setDestination(s); setSuggestions([]); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-700 dark:text-slate-200 text-sm border-b last:border-0 border-slate-100 dark:border-slate-700"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Departure</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input 
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input 
                type="date"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-slate-900 dark:text-white"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Interests</label>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => toggleInterest(opt.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 border ${
                  selectedInterests.includes(opt.value)
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200 dark:shadow-indigo-900/20'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500'
                }`}
              >
                <span>{opt.icon}</span>
                {opt.label}
                {selectedInterests.includes(opt.value) && <Check className="w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none group"
        >
          <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
          Plan My Trip
        </button>
      </div>
    </div>
  );
};

export default SetupView;
