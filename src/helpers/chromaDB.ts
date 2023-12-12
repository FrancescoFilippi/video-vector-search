import { ChromaClient, OpenAIEmbeddingFunction } from 'chromadb'

const client = new ChromaClient();
const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: process.env.OPENAI_VECTOR_SEARCH_API_KEY!,
});

export const getChromaCollection = async(collection: string) => {
  try {
    return await client.getCollection({ name: collection, embeddingFunction: embedder});
  } catch(error) {
    console.error(error);
  }
};

export const saveVideoCategoriesAndDescription = async(
  videoId: string,
  videoUrl: string,
  categoriesString: string | null,
  descriptionString: string | null,
): Promise<void> => {
  if (!categoriesString || !descriptionString) return;

  const videoCollection = await client.getCollection({
    name: 'video',
    embeddingFunction: embedder
  });
  await videoCollection.upsert({
    ids: videoId,
    documents: descriptionString,
    metadatas: {categories: categoriesString, videoUrl},
  });
};