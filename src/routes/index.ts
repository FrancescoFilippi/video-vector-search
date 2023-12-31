import express from "express";
import { downloadAndEmbedVideo } from "../services/downloadAndEmbedVideo";
import { getSimilarByDescription, getSimilarById } from "../services/videoSearch";

const router = express.Router();

router.post('/download-and-embed', async (req: any, res: any) => {
  await downloadAndEmbedVideo(req.body.url)
  res.json('Video downloaded and embedded 🚀');
});

router.get('/similar-by-description', async (req: any, res: any) => {
  const result = await getSimilarByDescription(req.body.query);
  res.json(result);
});

router.get('/similar-by-id', async (req: any, res: any) => {
  const result = await getSimilarById(req.body.videoId);
  res.json(result);
});

export default router;