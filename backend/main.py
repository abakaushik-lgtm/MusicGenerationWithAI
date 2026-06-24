from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from api.routes import router

app = FastAPI(title="AI Music Generation API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, configure this correctly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Music Generation API"}

# Create necessary directories if they don't exist
os.makedirs("../datasets", exist_ok=True)
os.makedirs("../saved_models", exist_ok=True)
os.makedirs("../generated_music", exist_ok=True)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
