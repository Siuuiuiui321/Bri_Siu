
import React, { useState, useEffect } from 'react';
import { Activity } from '../types';
import { fetchAIActivities } from '../services/geminiService';
import { Heart, X, ChevronLeft, MapPin, Tag, Info, Loader2, Compass } from 'lucide-react';

interface ActivityDeckProps {
  destination: string;
  interests: string[];
  onFinish: (liked: Activity[]) => void;
  onBack: () => void;
}

const ActivityDeck: React.FC<ActivityDeckProps> = ({ destination, interests, onFinish, onBack }) => {
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedActivities, setLikedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchAIActivities(destination, interests);
        setActivities(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [destination, interests]);

  const handleDecision = (liked: boolean) => {
    const current = activities[currentIndex];
    if (liked) {
      setLikedActivities(prev => [...prev, current]);
    }

    if (currentIndex + 1 >= activities.length) {
      onFinish([...likedActivities, ...(liked ? [current] : [])]);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          <Compass className="absolute inset-0 m-auto w-5 h-5 text-indigo-400" />
        </div>
        <p className="text-slate-500 dark:text-slate-400 font-medium animate-pulse">Consulting the oracle for {destination}...</p>
      </div>
    );
  }

  const current = activities[currentIndex];

  return (
    <div className="max-w-xl mx-auto h-full flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
        </button>
        <div className="flex flex-col items-center">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Discovery Mode</span>
          <span className="text-sm font-semibold text-indigo-600">{currentIndex + 1} of {activities.length}</span>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="relative w-full aspect-[4/5] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl dark:shadow-none border border-slate-100 dark:border-slate-800 group">
        <img 
          src={current.imageUrl} 
          alt={current.name} 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="flex flex-wrap gap-2">
            {current.matchType === 'wildcard' && (
              <span className="px-2 py-1 bg-amber-500 text-white text-[10px] font-bold rounded uppercase tracking-tighter">AI Pick</span>
            )}
            <span className="px-2 py-1 bg-indigo-500/80 text-white text-[10px] font-bold rounded uppercase tracking-tighter">{current.type}</span>
          </div>

          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-white tracking-tight">{current.name}</h3>
            <div className="flex items-center gap-1 text-slate-300 text-sm">
              <MapPin className="w-4 h-4" />
              <span>{destination}</span>
            </div>
          </div>

          <p className="text-slate-200 text-sm leading-relaxed line-clamp-3">
            {current.description}
          </p>

          <div className="flex flex-wrap gap-1">
            {current.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 text-[11px] bg-white/10 text-white/80 px-2 py-1 rounded-full backdrop-blur-sm">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6 mt-8">
        <button 
          onClick={() => handleDecision(false)}
          className="w-16 h-16 rounded-full bg-white dark:bg-slate-800 shadow-lg dark:shadow-none border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-100 dark:hover:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all active:scale-90"
        >
          <X className="w-8 h-8" />
        </button>
        <button 
          onClick={() => handleDecision(true)}
          className="w-20 h-20 rounded-full bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none flex items-center justify-center text-white hover:bg-indigo-700 hover:scale-105 transition-all active:scale-90"
        >
          <Heart className="w-10 h-10 fill-white" />
        </button>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1 justify-center uppercase tracking-widest font-bold">
          <Info className="w-3 h-3" /> Tip: Like activities to add them to your itinerary
        </p>
      </div>
    </div>
  );
};

export default ActivityDeck;
