import React, { useCallback, useState } from 'react';
import { UploadCloud, FileMusic, CheckCircle } from 'lucide-react';
import { uploadMIDI } from '../api';

const MIDIUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    const midiFiles = Array.from(fileList).filter(
      file => file.name.endsWith('.mid') || file.name.endsWith('.midi')
    );
    
    setFiles(prev => [...prev, ...midiFiles]);
    
    if (midiFiles.length > 0) {
      setUploading(true);
      setUploadSuccess(false);
      try {
        // Create a new FileList-like object to send to the API
        const dataTransfer = new DataTransfer();
        midiFiles.forEach(file => dataTransfer.items.add(file));
        await uploadMIDI(dataTransfer.files);
        setUploadSuccess(true);
      } catch (error) {
        console.error("Upload failed", error);
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <div className="bg-music-card p-6 rounded-2xl shadow-md border border-gray-800">
      <h2 className="text-xl font-bold mb-6 text-white flex items-center gap-2">
        <UploadCloud className="text-blue-500" />
        Upload Dataset
      </h2>
      
      <div 
        className={`border-2 border-dashed rounded-xl py-8 px-8 text-center transition-all ${
          isDragging ? 'border-blue-500 bg-blue-500/10 scale-[1.02]' : 'border-gray-600 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-400">
          <UploadCloud size={48} className={isDragging ? 'text-blue-500' : 'text-gray-500'} />
          <div>
            <p className="text-lg font-medium text-gray-300">Drag and drop MIDI files here</p>
            <p className="text-sm mt-1">Supported formats: .mid, .midi</p>
          </div>
          <p className="text-sm">or</p>
          <label className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-lg cursor-pointer transition-all shadow-md font-semibold">
            Browse Files
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept=".mid,.midi" 
              onChange={handleFileInput} 
            />
          </label>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-music-textMuted uppercase tracking-wider">
              Uploaded Files ({files.length})
            </h3>
            {uploading && <span className="text-sm text-yellow-400 animate-pulse">Uploading...</span>}
            {uploadSuccess && <span className="text-sm text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Success</span>}
          </div>
          <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
            {files.map((file, index) => (
              <li key={index} className="flex items-center gap-3 bg-[#2a2a2a] p-3 rounded-lg text-sm text-gray-300">
                <FileMusic size={16} className="text-music-accent flex-shrink-0" />
                <span className="truncate">{file.name}</span>
                <span className="ml-auto text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MIDIUploader;
