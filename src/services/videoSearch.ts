import { getChromaCollection } from "../helpers/chromaDB";

export const getSimilarByDescription = async(query: string) => {
  const videoCollection = await getChromaCollection('video');
  return await videoCollection!.query({
    nResults: 1,
    queryTexts: [query],
  });
};

export const getSimilarById = async(videoId: string) => {
  const videoCollection = await getChromaCollection('video');
  const video = await videoCollection?.get({ids: videoId});

  return await videoCollection!.query({
    nResults: 1,
    queryEmbeddings: video?.embeddings!
  });
};