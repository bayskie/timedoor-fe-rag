from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.internal.schemas import PromptRequest, PromptResponse
from app.internal.chain import chain
from app.internal.vector import retriever

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/ask", response_model=PromptResponse)
async def ask_question(request: PromptRequest):
    context = retriever.invoke(request.question)
    result = chain.invoke({"context": context, "question": request.question})
    return {"answer": result.content}
