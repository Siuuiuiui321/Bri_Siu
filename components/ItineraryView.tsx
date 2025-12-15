
import React from 'react';
import { TripContext, DayPlan } from '../types';
import { Calendar, Download, Share2, Plus, Clock, Navigation } from 'lucide-react';

interface ItineraryViewProps {
  trip: TripContext;
  onBack: () => void;
}

const ItineraryView: React.FC<ItineraryViewProps> = ({ trip, onBack }) => {
  const { destination, startDate, endDate, approvedActivities } = trip;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  
  const itinerary: DayPlan[] = [];
  for (let i = 0; i < daysDiff; i++) {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    itinerary.push({
      date: date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' }),
      activities: []
    });
  }

  approvedActivities.forEach((activity, idx) => {
    const dayIdx = idx % itinerary.length;
    itinerary[dayIdx].activities.push(activity);
  });

  const getMapsUrl = (query: string) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${query} ${destination}`)}`;
  };

  const handlePrint = () => window.print();

  return (
    <div className="max-w-4xl mx-auto pb-20 animate-in fade-in duration-700 print:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Your {destination} Trip</h1>
          <div className="flex items-center gap-4 mt-2 text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {startDate} – {endDate}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
            <span>{approvedActivities.length} Activities</span>
          </div>
        </div>

        <div className="flex gap-2 print:hidden">
          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
            <Download className="w-4 h-4" /> Export PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none">
            <Share2 className="w-4 h-4" /> Share Trip
          </button>
        </div>
      </div>

      <div className="space-y-12">
        {itinerary.map((day, idx) => (
          <div key={idx} className="relative">
            <div className="sticky top-16 z-10 py-4 mb-6 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md flex items-center gap-4 transition-colors">
              <div className="bg-indigo-600 text-white w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-indigo-500/20">
                {idx + 1}
              </div>
              <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{day.date}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-14 border-l-2 border-indigo-100 dark:border-indigo-900/40 pb-4">
              {day.activities.length > 0 ? (
                day.activities.map((act) => (
                  <div key={act.id} className="group bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-900/10 hover:-translate-y-1 transition-all duration-300">
                    <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                      <img src={act.imageUrl} alt={act.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur rounded text-[10px] font-bold text-slate-700 dark:text-slate-300 shadow-sm uppercase">{act.type}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">{act.name}</h3>
                        <a 
                          href={getMapsUrl(act.mapQuery)} 
                          target="_blank" 
                          rel="noreferrer"
                          className="p-2 bg-indigo-50 dark:bg-indigo-950/50 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-colors"
                        >
                          <Navigation className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{act.description}</p>
                      
                      <div className="flex items-center gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                          <Clock className="w-3 h-3" /> 2-3 hours
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-10 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
                  <p className="text-slate-400 dark:text-slate-500 font-medium italic">Time to explore or find a local cafe!</p>
                  <button onClick={onBack} className="mt-4 text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 mx-auto hover:underline">
                    <Plus className="w-4 h-4" /> Add more activities
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 bg-slate-900 dark:bg-slate-900 border border-slate-800 rounded-[2.5rem] p-12 text-center text-white relative overflow-hidden print:hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-indigo-500 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        
        <Sparkles className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold mb-4">Bon Voyage!</h2>
        <p className="text-indigo-200 mb-8 max-w-md mx-auto">Your personalized trip to {destination} is ready. Have an amazing time exploring and making memories.</p>
        <button onClick={onBack} className="px-8 py-4 bg-white text-slate-900 font-black rounded-2xl hover:bg-indigo-50 transition-colors">
          DISCOVER MORE
        </button>
      </div>
    </div>
  );
};

const Sparkles: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V4M12 20V21M4 12H3M21 12H20M5.63604 5.63604L6.34315 6.34315M17.6569 17.6569L18.364 18.364M5.63604 18.364L6.34315 17.6569M17.6569 6.34315L18.364 5.63604M12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default ItineraryView;
