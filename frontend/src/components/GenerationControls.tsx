import React, { useState } from 'react';
import { Music, SlidersHorizontal, Loader2 } from 'lucide-react';
import { generateMusic } from '../api';

interface GenerationControlsProps {
  onGenerateSuccess: (filename: string) => void;
}

const GenerationControls: React.FC<GenerationControlsProps> = ({ onGenerateSuccess }) => {
  const [numNotes, setNumNotes] = useState(100);
  const [temperature, setTemperature] = useState(1.0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const result = await generateMusic(numNotes, temperature);
      if (result.filename) {
        onGenerateSuccess(result.filename);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate music");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-music-card p-6 rounded-2xl shadow-md border border-gray-800 flex flex-col h-full">
      <h2 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
        <Music className="text-blue-500" />
        AI Composer
      </h2>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between mb-2 text-sm">
            <label className="text-gray-300 font-medium flex items-center gap-2">
              <SlidersHorizontal size={14} className="text-blue-500" />
              Creativity (Temperature)
            </label>
            <span className="text-blue-400 font-mono font-bold">{temperature.toFixed(1)}</span>
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="2.0" 
            step="0.1" 
            value={temperature} 
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
            className="w-full accent-music-accent"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1 px-2">
            <span>Conservative</span>
            <span>Experimental</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2 text-sm">
            <label className="text-gray-300 font-medium">Number of Notes</label>
            <span className="text-blue-400 font-mono font-bold">{numNotes}</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="500" 
            step="10" 
            value={numNotes} 
            onChange={(e) => setNumNotes(parseInt(e.target.value))}
            className="w-full accent-music-accent"
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-500/20">
            {error}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={isGenerating}
          className={`w-full h-[50px] rounded-[10px] font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
            isGenerating 
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
              : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-500/30'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" />
              Composing...
            </>
          ) : (
            <>
              <Music />
              Generate Music
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default GenerationControls;
