import numpy as np
import faiss
from sentence_transformers import SentenceTransformer
from typing import List, Tuple
import re
import os
import logging
import requests

EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
GOOGLE_API_KEY = "AIzaSyC24Tl1deS5-EuauSolF_4BivH52Z6wBSs"
GEMINI_MODEL = "gemini-2.0-flash"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K_CHUNKS = 3

def initialize_vector_store(logger: logging.Logger, base_dir: str, doc_filename: str = "sri-lankan-agriculture-guide.md"):
    """
    Loads the healthcare knowledge base and initializes the vector store.
    Returns the vector_store instance or None if initialization fails.
    """
    healthcare_doc_path = os.path.join(base_dir, "docs", doc_filename)
    vector_store = None

    try:
        logger.info(f"Loading healthcare knowledge base from: {healthcare_doc_path}")
        with open(healthcare_doc_path, "r", encoding="utf-8") as f:
            healthcare_kb = f.read()
        logger.info(f"Document loaded successfully ({len(healthcare_kb)} characters)")
        vector_store = VectorStore(EMBEDDING_MODEL)
        vector_store.build_index(healthcare_kb, CHUNK_SIZE, CHUNK_OVERLAP)
        logger.info(f"Knowledge base initialized with {len(vector_store.chunks)} chunks")
    except Exception as e:
        logger.error(f"Failed to initialize healthcare KB: {str(e)}")
        vector_store = None

    return vector_store


class VectorStore:
    def __init__(self, embedding_model_name: str):
        self.embedder = SentenceTransformer(embedding_model_name)
        self.index = None
        self.chunks = []
        self.embeddings = []
        
    def chunk_text(self, text: str, chunk_size: int, overlap: int) -> List[str]:
        """Split text into overlapping chunks with improved handling of long content"""
        # Clean the text
        text = text.strip()
        
        # Handle empty text
        if not text:
            return []
        
        # Split by paragraphs first (double newline)
        paragraphs = [p.strip() for p in text.split('\n\n') if p.strip()]
        
        chunks = []
        current_chunk = ""
        
        for paragraph in paragraphs:
            # Calculate potential new chunk size
            separator = "\n\n" if current_chunk else ""
            potential_chunk = current_chunk + separator + paragraph if current_chunk else paragraph
            
            # If adding this paragraph would exceed chunk size
            if len(potential_chunk) > chunk_size and current_chunk:
                chunks.append(current_chunk.strip())
                
                # Keep overlap from the end of current chunk
                if overlap > 0:
                    words = current_chunk.split()
                    num_overlap = min(overlap, len(words))
                    overlap_text = ' '.join(words[-num_overlap:])
                    current_chunk = overlap_text + "\n\n" + paragraph
                else:
                    current_chunk = paragraph
            else:
                current_chunk = potential_chunk
        
        # Add the last chunk
        if current_chunk:
            chunks.append(current_chunk.strip())
        
        # Further split very large chunks
        final_chunks = []
        for chunk in chunks:
            if len(chunk) > chunk_size * 1.5:
                # More robust sentence splitting
                sentences = re.split(r'(?<=[.!?])\s+', chunk)
                if not sentences:
                    sentences = [chunk]
                    
                temp_chunk = ""
                for sentence in sentences:
                    # Skip empty sentences
                    if not sentence.strip():
                        continue
                        
                    # Calculate potential size with this sentence
                    separator = " " if temp_chunk else ""
                    potential_chunk = temp_chunk + separator + sentence if temp_chunk else sentence
                    
                    if len(potential_chunk) > chunk_size and temp_chunk:
                        final_chunks.append(temp_chunk.strip())
                        temp_chunk = sentence
                    else:
                        temp_chunk = potential_chunk
                
                if temp_chunk:
                    final_chunks.append(temp_chunk.strip())
            else:
                final_chunks.append(chunk)
        
        return final_chunks
    
    def build_index(self, text: str, chunk_size: int, overlap: int):
        """Build FAISS index from text chunks with validation"""
        # Chunk the text
        self.chunks = self.chunk_text(text, chunk_size, overlap)
        
        if not self.chunks:
            raise ValueError("No chunks were created from the text")
        
        # Generate embeddings
        self.embeddings = self.embedder.encode(self.chunks, convert_to_numpy=True)
        
        # Validate embeddings
        if len(self.embeddings) == 0:
            raise ValueError("Failed to generate embeddings")
        
        # Build FAISS index
        dimension = self.embeddings.shape[1]
        self.index = faiss.IndexFlatL2(dimension)
        self.index.add(self.embeddings.astype('float32')) # type: ignore
        
    def search(self, query: str, top_k: int) -> List[Tuple[str, float]]:
        """Search for most relevant chunks with safety checks"""
        if self.index is None or not self.chunks:
            return []
        
        # Handle empty query
        if not query.strip():
            return []
        
        # Embed the query
        query_embedding = self.embedder.encode([query], convert_to_numpy=True)
        
        # Determine actual k to retrieve
        actual_k = min(top_k, len(self.chunks))
        
        # Search in FAISS (CORRECTED LINE)
        distances, indices = self.index.search(query_embedding.astype('float32'), actual_k) # type: ignore
        
        # Return chunks with their distances
        results = []
        for idx, distance in zip(indices[0], distances[0]):
            # Skip invalid indices
            if idx < 0 or idx >= len(self.chunks):
                continue
            results.append((self.chunks[idx], float(distance)))
        
        return results

