from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import HTMLResponse
from typing import List

app = FastAPI()

# In-memory storage for documents
documents = []

@app.post("/upload/")
async def upload_document(file: UploadFile = File(...)):
    content = await file.read()  # Read the file content
    documents.append(content)
    return {"filename": file.filename}

@app.get("/search/")
async def search_documents(query: str):
    # A simple search function that checks if the query is in any document
    results = [doc for doc in documents if query in doc.decode('utf-8')]
    return results

@app.post("/chat/")
async def chat(message: str):
    # A simple echo chat endpoint
    return {"message": f"You said: {message}"}

@app.get("/")
async def root():
    return HTMLResponse("<h1>Welcome to the FastAPI Document Upload and Chat API</h1>")