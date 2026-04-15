import os
import logging
import asyncio
from dotenv import load_dotenv
from openai import AsyncOpenAI

# Setup logging
logger = logging.getLogger(__name__)

# Loads .env file and variables
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

# Get OpenAI API key from environment variables
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found. Please check your .env file.")

# Initialize async OpenAI client
client = AsyncOpenAI(api_key=OPENAI_API_KEY)


async def _call_openai(prompt: str) -> str:
    try:
        response = await client.chat.completions.create(
            model="gpt-5-nano",
            messages=[{"role": "user", "content": prompt}],
        )
        content = getattr(getattr(response.choices[0], "message", None), "content", "")
        return content.strip()
    except Exception as e:
        logger.error(f"OpenAI API error: {e}")
        return "N/A"


async def process_email_async(email_content: str) -> dict:
    logger.info("Firing all 3 API calls in parallel...")

    extract_prompt = f"""
    Extract the following from the email:
    1. Sender's name
    2. Sender's email
    3. Subject (guess if missing)
    4. Urgency (low, medium, high)
    5. Deadlines (if any)
    6. Required actions
    7. Short summary (2-3 sentences)

    Email:
    {email_content}
    """

    categorize_prompt = f"""
    Categorize this email into:
    1. Class/Assignment
    2. Exam/Quiz/Deadlines
    3. Group Project/Collaboration
    4. Advising/Scheduling/Office Hours
    5. Spam/Low Priority
    6. Other

    Provided reasoning for category:

    Email:
    {email_content}
    """

    reply_prompt = f"""
    Write a short, polite, professional reply to this email as a college student.
    Do not confirm anything the student can't realistically do.
    If the email is spam, promotional, or phishing, respond with exactly: "No reply needed."

    Email:
    {email_content}
    """

    extracted, category, auto_reply = await asyncio.gather(
        _call_openai(extract_prompt),
        _call_openai(categorize_prompt),
        _call_openai(reply_prompt),
    )

    logger.info("All 3 calls completed")
    return {
        "extracted_content": extracted,
        "category": category,
        "auto_reply": auto_reply,
    }