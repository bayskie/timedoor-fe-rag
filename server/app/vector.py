from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
import os

# Load documents
loader = PyPDFLoader(os.path.abspath(os.path.join(
    os.path.dirname(__file__), "data/input-validation.pdf")))
documents = loader.load()

# Split the document into chunks
text_splitter = CharacterTextSplitter(
    chunk_size=1000, chunk_overlap=30, separator="\n")
docs = text_splitter.split_documents(documents=documents)

# Load embedding model
embedding_model_name = "sentence-transformers/all-mpnet-base-v2"
embedding_model_kwargs = {"device": "cpu"}
embeddings = HuggingFaceEmbeddings(
    model_name=embedding_model_name,
    model_kwargs=embedding_model_kwargs
)

faiss_path = os.path.abspath(os.path.join(
    os.path.dirname(__file__), "data/faiss_index_"))

if not os.path.exists(faiss_path):
    # Create FAISS vector store
    vectorstore = FAISS.from_documents(documents, embeddings)

    # Save the vector store
    vectorstore.save_local(faiss_path)

# Reload the vector store
persisted_vectorstore = FAISS.load_local(
    faiss_path, embeddings, allow_dangerous_deserialization=True)

# Create a retriever
retriever = persisted_vectorstore.as_retriever(search_kwargs={"k": 3})
