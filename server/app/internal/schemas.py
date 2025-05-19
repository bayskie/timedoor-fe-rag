from pydantic import BaseModel


class PromptRequest(BaseModel):
    question: str


class PromptResponse(BaseModel):
    answer: str
