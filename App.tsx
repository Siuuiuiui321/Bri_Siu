
import React, { useState, useEffect } from 'react';
import { AppStep, Activity, TripContext } from './types';
import SetupView from './components/SetupView';
import ActivityDeck from './components/ActivityDeck';
import ItineraryView from './components/ItineraryView';
import { Plane, Sun, Moon } from 'lucide-react';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>(AppStep.SETUP);
  const [isDarkMode, setIsDarkMode] = useState(true); // Defaulting to black mode as requested
  const [trip, setTrip] = useState<TripContext>({
    destination: '',
    startDate: '',
    endDate: '',
    interests: [],
    approvedActivities: [],
  });

  const handleStartDiscovery = (data: Partial<TripContext>) => {
    setTrip(prev => ({ ...prev, ...data }));
    setStep(AppStep.DISCOVERY);
  };

  const handleFinishDiscovery = (liked: Activity[]) => {
    setTrip(prev => ({ ...prev, approvedActivities: liked }));
    setStep(AppStep.ITINERARY);
  };

  const handleRestart = () => {
    setStep(AppStep.SETUP);
    setTrip({
      destination: '',
      startDate: '',
      endDate: '',
      interests: [],
      approvedActivities: [],
    });
  };

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen transition-colors duration-300`}>
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleRestart}
            >
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Plane className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight">WanderGen<span className="text-indigo-600">AI</span></span>
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <div className={`flex items-center gap-2 ${step === AppStep.SETUP ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === AppStep.SETUP ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>1</div>
                Setup
              </div>
              <div className={`flex items-center gap-2 ${step === AppStep.DISCOVERY ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === AppStep.DISCOVERY ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>2</div>
                Discovery
              </div>
              <div className={`flex items-center gap-2 ${step === AppStep.ITINERARY ? 'text-indigo-600' : 'text-slate-400 dark:text-slate-500'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === AppStep.ITINERARY ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>3</div>
                Itinerary
              </div>
            </nav>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                aria-label="Toggle Theme"
              >
                {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
              </button>
              <button 
                onClick={handleRestart}
                className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
              >
                NEW TRIP
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
          {step === AppStep.SETUP && (
            <SetupView onStart={handleStartDiscovery} initialData={trip} />
          )}
          {step === AppStep.DISCOVERY && (
            <ActivityDeck 
              destination={trip.destination} 
              interests={trip.interests} 
              onFinish={handleFinishDiscovery}
              onBack={() => setStep(AppStep.SETUP)}
            />
          )}
          {step === AppStep.ITINERARY && (
            <ItineraryView trip={trip} onBack={() => setStep(AppStep.DISCOVERY)} />
          )}
        </main>

        {/* Footer */}
        <footer className="py-8 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400 text-sm">
          <p>&copy; {new Date().getFullYear()} WanderGen AI Travel Planner. Powered by Gemini 2.5.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
