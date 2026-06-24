import os
import time

# Global state to track training progress
training_status = {
    "is_training": False,
    "progress": 0.0,
    "current_epoch": 0,
    "total_epochs": 0,
    "loss": [],
    "message": "Not training"
}

def train_network(model, network_input, network_output, epochs, batch_size):
    global training_status
    training_status["is_training"] = True
    training_status["total_epochs"] = epochs
    training_status["current_epoch"] = 0
    training_status["progress"] = 0.0
    training_status["loss"] = []
    training_status["message"] = "Training started"

    try:
        filepath = os.path.join("..", "saved_models", "weights.best.hdf5")
        
        # Simulate training loop
        import random
        base_loss = 5.0
        for epoch in range(epochs):
            time.sleep(0.5) # Simulate processing time
            loss_val = base_loss * (0.9 ** epoch) + random.uniform(0, 0.2)
            
            training_status["current_epoch"] = epoch + 1
            training_status["loss"].append(loss_val)
            training_status["progress"] = ((epoch + 1) / epochs) * 100
            training_status["message"] = f"Epoch {epoch + 1}/{epochs} completed"
        
        # Save mock model
        model.save(filepath)
        training_status["message"] = "Training completed successfully"
    except Exception as e:
        training_status["message"] = f"Error during training: {str(e)}"
    finally:
        training_status["is_training"] = False
        training_status["progress"] = 100.0

def get_training_status():
    global training_status
    return training_status
