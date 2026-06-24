import { useState } from 'react';
import MIDIUploader from './components/MIDIUploader';
import TrainingDashboard from './components/TrainingDashboard';
import GenerationControls from './components/GenerationControls';
import MusicPlayer from './components/MusicPlayer';
import { Sparkles, Library } from 'lucide-react';

function App() {
  const [generatedFile, setGeneratedFile] = useState<string | null>(null);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-music-dark text-music-text font-sans selection:bg-music-accent/30">
      
      {/* Header / Navbar */}
      <header className="bg-music-card border-b border-gray-800 sticky top-0 z-10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-lg">
              <Sparkles className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Melody Forge <span className="text-blue-400 font-normal">AI</span>
              </h1>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
              <Library size={18} />
              My Compositions
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Layout */}
      <main className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 py-10 lg:py-14 grid grid-cols-1 xl:grid-cols-12 gap-10 xl:gap-12">
        
        {/* Left Column: Data & Training */}
        <div className="xl:col-span-5 flex flex-col gap-10 xl:gap-14">
          <MIDIUploader />
          <div className="flex-grow">
            <TrainingDashboard />
          </div>
        </div>

        {/* Right Column: Generation & Playback */}
        <div className="xl:col-span-7 flex flex-col gap-10 xl:gap-14">
          <GenerationControls onGenerateSuccess={(filename) => setGeneratedFile(filename)} />
          <div className="flex-grow">
            <MusicPlayer filename={generatedFile} />
          </div>
        </div>

      </main>
      
      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mt-12 pt-8 border-t border-gray-800 text-center text-music-textMuted text-sm pb-10">
        <p>Built with React, FastAPI, TensorFlow and Magenta.js</p>
      </footer>
    </div>
  );
}

export default App;
