import React, { useState, useEffect } from 'react';
import { Activity, Play, RefreshCw, Hash, Layers, ListOrdered, CheckCircle2 } from 'lucide-react';
import { startTraining, getTrainingStatus } from '../api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrainingStatus {
  is_training: boolean;
  progress: number;
  current_epoch: number;
  total_epochs: number;
  loss: number[];
  message: string;
}

const TrainingDashboard: React.FC = () => {
  const [epochs, setEpochs] = useState(10);
  const [batchSize, setBatchSize] = useState(64);
  const [seqLength, setSeqLength] = useState(100);
  const [status, setStatus] = useState<TrainingStatus | null>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const fetchStatus = async () => {
      try {
        const data = await getTrainingStatus();
        setStatus(data);
      } catch (error) {
        console.error("Failed to fetch training status", error);
      }
    };

    fetchStatus(); // initial fetch
    
    interval = setInterval(fetchStatus, 2000); // poll every 2 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleStartTraining = async () => {
    try {
      await startTraining(epochs, batchSize, seqLength);
    } catch (error) {
      console.error("Failed to start training", error);
    }
  };

  const chartData = status?.loss.map((val, idx) => ({
    epoch: idx + 1,
    loss: val
  })) || [];

  return (
    <div className="bg-music-card p-6 rounded-2xl shadow-md border border-gray-800 flex flex-col h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity className="text-blue-500" />
          Model Training
        </h2>
        {status?.is_training && (
          <span className="flex items-center gap-2 text-sm text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full animate-pulse font-medium">
            <RefreshCw size={14} className="animate-spin" />
            Training...
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Hash size={16} className="text-blue-500" /> Epochs
          </label>
          <input 
            type="number" 
            value={epochs} 
            onChange={(e) => setEpochs(Number(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-[10px] pl-5 pr-12 py-[10px] text-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            disabled={status?.is_training}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <Layers size={16} className="text-blue-500" /> Batch Size
          </label>
          <input 
            type="number" 
            value={batchSize} 
            onChange={(e) => setBatchSize(Number(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-[10px] pl-5 pr-12 py-[10px] text-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            disabled={status?.is_training}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-2">
            <ListOrdered size={16} className="text-blue-500" /> Sequence Length
          </label>
          <input 
            type="number" 
            value={seqLength} 
            onChange={(e) => setSeqLength(Number(e.target.value))}
            className="w-full bg-[#1e1e1e] border border-gray-700 rounded-[10px] pl-5 pr-12 py-[10px] text-white shadow-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
            disabled={status?.is_training}
          />
        </div>
      </div>

      <button 
        onClick={handleStartTraining}
        disabled={status?.is_training}
        className={`w-full h-[50px] rounded-[10px] font-bold flex items-center justify-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
          status?.is_training 
            ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
            : 'bg-[#7C3AED] hover:bg-[#6D28D9] text-white shadow-lg shadow-purple-500/30'
        }`}
      >
        <Play size={20} fill={status?.is_training ? "none" : "currentColor"} />
        {status?.is_training ? 'Training in Progress' : 'Start Training'}
      </button>

      <div className="mt-8 flex-grow">
        
        {/* Status Indicator */}
        <div className="flex items-center justify-between mb-6 bg-[#1a1a1a] p-4 rounded-xl border border-gray-800">
          
          {/* Step 1: Dataset Ready */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
              status?.is_training || status?.progress === 100 
                ? 'bg-green-500 text-white' 
                : 'bg-blue-500 text-white ring-4 ring-blue-500/20'
            }`}>
              <CheckCircle2 size={16} />
            </div>
            <span className={`text-xs font-medium ${status?.is_training || status?.progress === 100 ? 'text-green-400' : 'text-blue-400'}`}>
              Dataset Ready
            </span>
          </div>

          <div className={`h-1 flex-1 mx-2 rounded transition-colors ${
            status?.is_training || status?.progress === 100 ? 'bg-green-500' : 'bg-gray-800'
          }`}></div>

          {/* Step 2: Training */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
              status?.progress === 100 
                ? 'bg-green-500 text-white' 
                : status?.is_training 
                  ? 'bg-blue-500 text-white ring-4 ring-blue-500/20 animate-pulse' 
                  : 'bg-gray-700 text-gray-400'
            }`}>
              {status?.is_training ? <RefreshCw size={14} className="animate-spin" /> : <Activity size={16} />}
            </div>
            <span className={`text-xs font-medium ${
              status?.progress === 100 ? 'text-green-400' : status?.is_training ? 'text-blue-400' : 'text-gray-400'
            }`}>
              Training
            </span>
          </div>

          <div className={`h-1 flex-1 mx-2 rounded transition-colors ${
            status?.progress === 100 ? 'bg-green-500' : status?.is_training ? 'bg-blue-500' : 'bg-gray-800'
          }`}></div>

          {/* Step 3: Completed */}
          <div className="flex flex-col items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-colors ${
              status?.progress === 100 ? 'bg-green-500 text-white ring-4 ring-green-500/20' : 'bg-gray-700 text-gray-400'
            }`}>
              <CheckCircle2 size={16} />
            </div>
            <span className={`text-xs font-medium ${status?.progress === 100 ? 'text-green-400' : 'text-gray-400'}`}>
              Completed
            </span>
          </div>

        </div>

        <div className="flex justify-between items-end mb-2 text-sm text-gray-400">
          <span className="font-medium text-gray-300">Training Progress</span>
          <span className="text-blue-400 font-medium">{status?.message || 'Ready'}</span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-800 rounded-full h-2.5 mb-6 overflow-hidden shadow-inner">
          <div 
            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${status?.progress || 0}%` }}
          ></div>
        </div>

        {/* Chart */}
        <div className="bg-[#121212] rounded-xl p-4 border border-gray-800 h-48 shadow-inner">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="epoch" stroke="#888" tick={{fill: '#888', fontSize: 12}} />
                <YAxis stroke="#888" tick={{fill: '#888', fontSize: 12}} domain={['auto', 'auto']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e1e1e', borderColor: '#333', color: '#fff', borderRadius: '8px' }}
                  itemStyle={{ color: '#3b82f6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="loss" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: '#fff', stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
              Waiting for data...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDashboard;
