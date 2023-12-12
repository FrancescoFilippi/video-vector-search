import dotenv from 'dotenv';
import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'

dotenv.config();
const client = new ChromaClient();

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_VECTOR_SEARCH_API_KEY!,
});

export const createVideoCollection = async() => {
  await client.createCollection({
    name: 'video',
    embeddingFunction: embedder,
  });
};

createVideoCollection();