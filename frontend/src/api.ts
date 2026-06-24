const API_URL = 'http://localhost:8000/api';

export const uploadMIDI = async (files: FileList) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => {
    formData.append('files', file);
  });

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });
  return response.json();
};

export const startTraining = async (epochs: number, batchSize: number, sequenceLength: number) => {
  const response = await fetch(`${API_URL}/train`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      epochs,
      batch_size: batchSize,
      sequence_length: sequenceLength,
    }),
  });
  return response.json();
};

export const getTrainingStatus = async () => {
  const response = await fetch(`${API_URL}/status`);
  return response.json();
};

export const generateMusic = async (numNotes: number, temperature: number) => {
  const response = await fetch(`${API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      num_notes: numNotes,
      temperature,
    }),
  });
  return response.json();
};
