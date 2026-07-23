const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const reelsDir = path.join(__dirname, 'public', 'reels');
const tempDir = path.join(__dirname, 'public', 'reels_temp');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const files = fs.readdirSync(reelsDir).filter(f => f.endsWith('.mp4'));

async function processVideos() {
  for (const file of files) {
    const inputPath = path.join(reelsDir, file);
    const stat = fs.statSync(inputPath);
    const sizeMB = stat.size / (1024 * 1024);

    if (sizeMB > 45) { // Compress anything over 45MB to be safe for GitHub
      console.log(`Compressing ${file} (Size: ${sizeMB.toFixed(2)} MB)...`);
      const tempPath = path.join(tempDir, file);
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-vf scale=1080:1920:force_original_aspect_ratio=decrease',
            '-c:v libx264',
            '-crf 26',
            '-preset superfast',
            '-c:a aac',
            '-b:a 128k',
            '-movflags faststart'
          ])
          .on('end', () => {
            console.log(`Finished compressing ${file}!`);
            fs.renameSync(tempPath, inputPath); // Overwrite original
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error compressing ${file}:`, err);
            reject(err);
          })
          .save(tempPath);
      });
    } else {
      console.log(`Skipping ${file} (Size: ${sizeMB.toFixed(2)} MB is fine)`);
    }
  }
  console.log("All massive reels compressed successfully!");
  try { fs.rmdirSync(tempDir); } catch(e) {}
}

processVideos().catch(console.error);
