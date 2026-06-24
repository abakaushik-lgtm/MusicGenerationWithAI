import os
import glob
import time
from fastapi import APIRouter, UploadFile, File, BackgroundTasks, HTTPException
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List
import threading

# Import our modules
from training.trainer import train_network, get_training_status
from models.lstm_model import create_network
from utils.midi_processor import get_notes, prepare_sequences
from generation.generator import generate_notes, create_midi

router = APIRouter()

# Global state to keep model and network info in memory for generation
model_state = {
    "model": None,
    "network_input": None,
    "pitchnames": None,
    "n_vocab": 0
}

class GenerateRequest(BaseModel):
    num_notes: int = 100
    temperature: float = 1.0

class TrainRequest(BaseModel):
    epochs: int = 10
    batch_size: int = 64
    sequence_length: int = 100

@router.post("/upload")
async def upload_midi(files: List[UploadFile] = File(...)):
    """Upload MIDI files to the datasets directory"""
    dataset_path = os.path.join("..", "datasets")
    os.makedirs(dataset_path, exist_ok=True)
    
    saved_files = []
    for file in files:
        file_location = os.path.join(dataset_path, file.filename)
        with open(file_location, "wb+") as file_object:
            file_object.write(file.file.read())
        saved_files.append(file.filename)
        
    return {"message": f"Successfully uploaded {len(saved_files)} files", "files": saved_files}

def training_task(epochs: int, batch_size: int, sequence_length: int):
    """Background task for training the model"""
    global model_state
    
    dataset_path = os.path.join("..", "datasets")
    notes = get_notes(dataset_path)
    
    if len(notes) == 0:
        return
        
    n_vocab = len(set(notes))
    
    network_input_reshaped, network_output, network_input, note_to_int = prepare_sequences(
        notes, n_vocab, sequence_length
    )
    
    model = create_network(network_input_reshaped, n_vocab)
    
    # Store in global state for later generation
    model_state["model"] = model
    model_state["network_input"] = network_input
    model_state["pitchnames"] = sorted(set(item for item in notes))
    model_state["n_vocab"] = n_vocab
    
    train_network(model, network_input_reshaped, network_output, epochs, batch_size)


@router.post("/train")
async def start_training(request: TrainRequest, background_tasks: BackgroundTasks):
    """Start the training process in the background"""
    status = get_training_status()
    if status["is_training"]:
        raise HTTPException(status_code=400, detail="Training is already in progress")
        
    # Check if we have files
    dataset_path = os.path.join("..", "datasets")
    files = glob.glob(f"{dataset_path}/*.mid") + glob.glob(f"{dataset_path}/*.midi")
    if len(files) == 0:
        raise HTTPException(status_code=400, detail="No MIDI files found in dataset. Please upload some first.")
        
    # Using python threading because Keras might not play well with FastAPI's async BackgroundTasks depending on backend
    thread = threading.Thread(target=training_task, args=(request.epochs, request.batch_size, request.sequence_length))
    thread.start()
    
    return {"message": "Training started in the background"}

@router.get("/status")
async def get_status():
    """Get current training status"""
    return get_training_status()

@router.post("/generate")
async def generate_music(request: GenerateRequest):
    """Generate a new MIDI sequence"""
    global model_state
    
    if model_state["model"] is None:
        # Load the model if it exists
        try:
            # Mock loading
            model_path = os.path.join("..", "saved_models", "weights.best.hdf5")
            if os.path.exists(model_path):
                # For a full implementation, we would also need to serialize/deserialize
                # the pitchnames and network_input. For simplicity, we require training
                # first in the current session.
                pass
            raise HTTPException(status_code=400, detail="Model not found or not trained in current session. Train a model first.")
        except Exception as e:
             raise HTTPException(status_code=500, detail=str(e))
             
    prediction_output = generate_notes(
        model_state["model"], 
        model_state["network_input"], 
        model_state["pitchnames"], 
        model_state["n_vocab"], 
        request.num_notes,
        request.temperature
    )
    
    timestamp = int(time.time())
    filename = f"generated_{timestamp}.mid"
    output_path = create_midi(prediction_output, filename)
    
    return {"message": "Generation complete", "filename": filename}

@router.get("/download/{filename}")
async def download_file(filename: str):
    """Download a generated MIDI file"""
    file_path = os.path.join("..", "generated_music", filename)
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
        
    return FileResponse(path=file_path, filename=filename, media_type='audio/midi')
