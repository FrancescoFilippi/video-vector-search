import fs from 'fs'
import https from 'https'

export const downloadVideo = async(url: string, targetPath: string): Promise<void> => {
  if (!url) return;

  return await new Promise((resolve, reject) => {
    https.get(url, response => {
      const code = response.statusCode ?? 0

      if (code >= 400) {
        return reject(new Error(response.statusMessage))
      }

      // handle redirects
      if (code > 300 && code < 400 && !!response.headers.location) {
        return resolve(
          downloadVideo(response.headers.location, targetPath)
        )
      }

      // save the file to disk
      const fileWriter = fs
        .createWriteStream(targetPath)
        .on('finish', () => {
          resolve()
        })

      response.pipe(fileWriter)
    }).on('error', error => {
      reject(error)
    })
  })
};