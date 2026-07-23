const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const sourceFiles = [
  { original: 'Nikhil x Khushal x  Ram x Creators  (1).mp4', target: 'Nikhil_x_Khushal.mp4' },
  { original: 'YEH DIL FOR JECRC (1).mp4', target: 'YEH_DIL_FOR_JECRC.mp4' },
  { original: 'concept-jecrc.mp4', target: 'concept-jecrc.mp4' },
  { original: 'girls-ree-4k(new grade).mp4', target: 'girls-ree-4k.mp4' }
];

const rootDir = __dirname;
const assetsDir = path.join(__dirname, 'public', 'assets');

async function processVideos() {
  for (const file of sourceFiles) {
    const inputPath = path.join(rootDir, file.original);
    const outputPath = path.join(assetsDir, file.target);
    
    if (fs.existsSync(inputPath)) {
      console.log(`Starting high-quality compression for ${file.original}...`);
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          // Fit within 1920x1920 (handles both 1080p landscape and 1080p portrait reels)
          .outputOptions([
            '-vf scale=1920:1920:force_original_aspect_ratio=decrease',
            '-c:v libx264',
            '-crf 22', // High quality, low visual loss
            '-preset medium', // Better quality-to-size ratio than 'fast'
            '-c:a aac',
            '-b:a 192k', // Good audio quality
            '-movflags faststart' // Instant playback on web
          ])
          .on('end', () => {
            console.log(`Finished high-quality compression for ${file.target}!`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error compressing ${file.original}:`, err);
            reject(err);
          })
          .save(outputPath);
      });
    } else {
      console.log(`Source file ${file.original} not found, skipping.`);
    }
  }
  console.log("All high-quality videos processed!");
}

processVideos().catch(console.error);
