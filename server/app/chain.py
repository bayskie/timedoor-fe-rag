import os
from dotenv import load_dotenv
from langchain_ollama.llms import OllamaLLM
# from langchain_google_genai import ChatGoogleGenerativeAI
from app.prompt import prompt

load_dotenv()

# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

llm = OllamaLLM(model="llama3.2", temperature=0.1)

# llm = ChatGoogleGenerativeAI(
#     model="gemini-2.0-flash",
#     temperature=0.1,
#     google_api_key=GEMINI_API_KEY
# )

chain = prompt | llm
