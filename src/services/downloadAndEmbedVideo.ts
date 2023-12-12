import { nanoid } from "nanoid";
import { downloadVideo } from "../helpers/downloadVideo";
import { extractVideoFrames } from "../helpers/extractVideoFrames";
import { getVideoCategoriesAndDescriptionFromFrames } from "../helpers/openAI";
import { saveVideoCategoriesAndDescription } from "../helpers/chromaDB";

const videoFolder = './media/videos';
const videoExtension = 'mp4';

export const downloadAndEmbedVideo = async(url: string) => {
  const videoId = nanoid();
  await downloadVideo(url, `${videoFolder}/${videoId}.${videoExtension}`);
  await extractVideoFrames(videoId);
  const videoCategoriesAndDescription = await getVideoCategoriesAndDescriptionFromFrames(videoId);
  await saveVideoCategoriesAndDescription(
    videoId,
    url,
    videoCategoriesAndDescription.categories,
    videoCategoriesAndDescription.description,
  );
};