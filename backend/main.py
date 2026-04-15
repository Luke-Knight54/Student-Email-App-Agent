from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from agent import process_email_async
import logging

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initializes FastAPI app
app = FastAPI()

# CORS settings (React development server)
origins = ["http://localhost:3000", "http://127.0.0.1:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class EmailRequest(BaseModel):
    email_content: str

@app.post("/process_email")
async def process_email(req: EmailRequest):
    logger.info(f"Received email content: {req.email_content}")
    response = await process_email_async(req.email_content)
    logger.info(f"Returning: {response}")
    return response

@app.get("/")
def home():
    return {"message": "Student Email Agent Backend is running."}