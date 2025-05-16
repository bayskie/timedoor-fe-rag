from fastapi import FastAPI
from app.schemas import PromptRequest, PromptResponse
from app.chain import chain
from app.vector import retriever

app = FastAPI()


@app.post("/ask", response_model=PromptResponse)
async def ask_question(request: PromptRequest):
    context = retriever.invoke(request.question)
    result = chain.invoke({"context": context, "question": request.question})
    return {"answer": result}
