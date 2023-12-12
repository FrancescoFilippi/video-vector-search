import fs from 'fs';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const openai = new OpenAI();

export const getVideoCategoriesAndDescriptionFromFrames = async(
  videoFramesFolder: string,
  frameExtension = '.jpg'
): Promise<{categories: string | null, description: string | null}> => {
  const videoFramesPath = `./media/frames/${videoFramesFolder}`;

  try {
    const frameFiles = fs.readdirSync(videoFramesPath).filter(file => file.endsWith(frameExtension));
    const framePaths = frameFiles.map(frameFile => `${videoFramesPath}/${frameFile}`);
    const base64Frames = framePaths.map(path => {
      const frameData = fs.readFileSync(path);
      const base64FrameData = Buffer.from(frameData).toString('base64');
      return `data:image/jpeg;base64,${base64FrameData}`;
    });

    const opts = {
      model: "gpt-4-vision-preview",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: [
              {
                  type: "text",
                  text: `
                    These are frames from a video that showcases a specific product.
                    Generate 10 categories for the product including the gender and return them as a comma-separated string.
                    Also generate a short description for the video.
                    Don't include the words categories and description, but separate them with 3 pipes. Put categories first, then the description.`
              },
              ...base64Frames.map((base64Frame) => ({
                type: 'image_url',
                image_url: { url: `${base64Frame}` },
              })),
          ]
        }
      ] as ChatCompletionMessageParam[],
    };

    const response = await openai.chat.completions.create(opts);
    return extractCategoriesAndDescriptionFromGPT4VisionResponse(response.choices[0].message.content);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Unused right now, as ChromaDB generate and handles embeddings using the same model out of the box.
 */
export const getTextEmbedding = async(textToEmbed: string | null): Promise<number[] | null> => {
  if (!textToEmbed) return null;
  const embedding = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: textToEmbed,
    encoding_format: 'float',
    });
  return embedding.data[0].embedding;
}

export const extractCategoriesAndDescriptionFromGPT4VisionResponse = (
  categoriesAndDescriptionString: string | null
): {categories: string | null, description: string | null} => {
  if (!categoriesAndDescriptionString) return {categories: null, description: null};
  const splittedCategoriesAndDescription = categoriesAndDescriptionString.split('|||');
  return { categories: splittedCategoriesAndDescription[0], description: splittedCategoriesAndDescription[1]};
};
