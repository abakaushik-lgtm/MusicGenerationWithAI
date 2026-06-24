import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Download, Volume2, Square } from 'lucide-react';

// Use global mm from CDN script in index.html to avoid Vite bundler SyntaxErrors
import type * as mm from '@magenta/music';
const mmAPI = (window as any).mm;

interface MusicPlayerProps {
  filename: string | null;
}

const API_URL = 'http://localhost:8000/api';

const MusicPlayer: React.FC<MusicPlayerProps> = ({ filename }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const playerRef = useRef<mm.Player | null>(null);
  const visualizerRef = useRef<mm.PianoRollSVGVisualizer | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [sequence, setSequence] = useState<mm.INoteSequence | null>(null);

  useEffect(() => {
    if (filename) {
      loadMidiFile(filename);
    }
    
    return () => {
      if (playerRef.current) {
        playerRef.current.stop();
      }
    };
  }, [filename]);

  const loadMidiFile = async (file: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/download/${file}`);
      const blob = await response.blob();
      
      const fileReader = new FileReader();
      fileReader.onload = async (e) => {
        const result = e.target?.result as ArrayBuffer;
        const seq = mmAPI.midiToSequenceProto(result);
        setSequence(seq);
        
        // Initialize Visualizer
        if (svgRef.current) {
          svgRef.current.innerHTML = '';
          visualizerRef.current = new mmAPI.PianoRollSVGVisualizer(
            seq,
            svgRef.current,
            {
              noteRGB: '187, 134, 252',
              activeNoteRGB: '255, 255, 255',
              noteHeight: 4,
              pixelsPerTimeStep: 40,
            }
          );
        }

        // Initialize Player
        playerRef.current = new mmAPI.Player(false, {
          run: (note: mm.NoteSequence.INote) => {
            if (visualizerRef.current) {
              visualizerRef.current.redraw(note);
            }
          },
          stop: () => {
            setIsPlaying(false);
          }
        });
      };
      
      fileReader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error("Error loading MIDI:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !sequence) return;
    
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.resumeContext();
      playerRef.current.start(sequence);
      setIsPlaying(true);
    }
  };

  const stop = () => {
    if (playerRef.current) {
      playerRef.current.stop();
      setIsPlaying(false);
    }
  };

  const downloadMidi = () => {
    if (filename) {
      window.open(`${API_URL}/download/${filename}`, '_blank');
    }
  };

  if (!filename) {
    return (
      <div className="bg-music-card p-6 rounded-xl shadow-lg border border-gray-800 flex flex-col items-center justify-center min-h-[300px] text-gray-500">
        <Volume2 size={48} className="mb-4 opacity-50" />
        <p>Generate music to start playback</p>
      </div>
    );
  }

  return (
    <div className="bg-music-card p-6 rounded-2xl shadow-md border border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Volume2 className="text-blue-500" />
          Playback
        </h2>
        {isLoading && <span className="text-sm text-blue-400 font-medium animate-pulse">Loading audio...</span>}
      </div>

      <div className="flex-grow bg-[#121212] rounded-lg border border-gray-800 overflow-x-auto overflow-y-hidden mb-6 custom-scrollbar p-4 relative min-h-[200px]">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            disabled={isLoading || !sequence}
            className="w-12 h-12 rounded-full bg-music-accent hover:bg-music-accentHover text-white flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
          </button>
          
          <button 
            onClick={stop}
            disabled={!isPlaying}
            className="w-10 h-10 rounded-full bg-[#2a2a2a] hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Square size={16} fill="currentColor" />
          </button>
        </div>

        <button 
          onClick={downloadMidi}
          className="px-4 py-2 rounded-lg bg-[#2a2a2a] hover:bg-gray-700 text-white flex items-center gap-2 transition-colors text-sm font-medium"
        >
          <Download size={16} />
          Download MIDI
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
