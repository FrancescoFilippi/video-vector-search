import { ChromaClient } from 'chromadb'

const client = new ChromaClient();

export const destroyVideoCategoriesAndDescriptionCollections = async() => {
  await client.deleteCollection({name: 'video'});
};

destroyVideoCategoriesAndDescriptionCollections();