import fs from 'fs';
import FfmpegCommand from 'fluent-ffmpeg';

const mediaFolder = './media';
const videoFolder = `${mediaFolder}/videos`;
const framesFolder = `${mediaFolder}/frames`;
const videoExtension = 'mp4';

export const extractVideoFrames = async(videoFilename: string): Promise<void> => {
  const framesOutputDirectory = `${framesFolder}/${videoFilename}`;
  if (!fs.existsSync(framesOutputDirectory)) {
    fs.mkdirSync(framesOutputDirectory);
  }

  return new Promise<void>((resolve, reject) => {
    FfmpegCommand(`${videoFolder}/${videoFilename}.${videoExtension}`)
      .on('filenames', function(filenames) {
        console.log('Will generate ' + filenames.join(', '))
      })
      .takeScreenshots( {
        count: 10,
        folder: `${framesOutputDirectory}`,
        filename: `${videoFilename}_screenshot_%i.jpg`
      })
      .on('end', function() {
        console.log(`Screenshots taken and saved to ${framesOutputDirectory}`);
        resolve();
      })
      .on('error',(err)=>{
        return reject(new Error(err))
      });
  });
};