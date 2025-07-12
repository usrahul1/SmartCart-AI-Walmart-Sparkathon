from fastapi import FastAPI
from app.routes import cart, chat, issue
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="SmartCart AI")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(chat.router, prefix="/chat", tags=["Chatbot"])
app.include_router(issue.router, prefix="/issue", tags=["Issue Reporter"])

@app.get("/")
def root():
    return {"message": "Welcome to SmartCart AI Backend!"}
