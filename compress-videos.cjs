const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const assetsDir = path.join(__dirname, 'public', 'assets');

async function processVideos() {
  const files = fs.readdirSync(assetsDir).filter(f => f.endsWith('.mp4'));

  for (const file of files) {
    const inputPath = path.join(assetsDir, file);
    const stat = fs.statSync(inputPath);
    
    // Only compress files larger than 50MB
    if (stat.size > 50 * 1024 * 1024) {
      console.log(`Compressing ${file} (${(stat.size / 1024 / 1024).toFixed(2)} MB)...`);
      const tempPath = path.join(assetsDir, `compressed_${file}`);
      
      await new Promise((resolve, reject) => {
        ffmpeg(inputPath)
          // Scale down to 720p max, keeping aspect ratio
          .size('?x720')
          // Add faststart to put moov atom at the beginning for fast web playback
          .outputOptions(['-movflags faststart', '-crf 28', '-preset fast'])
          .on('end', () => {
            console.log(`Finished compressing ${file}. Replacing original...`);
            fs.renameSync(tempPath, inputPath); // Overwrite original
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error compressing ${file}:`, err);
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
            reject(err);
          })
          .save(tempPath);
      });
    } else {
      console.log(`Skipping ${file}, it is already small enough.`);
    }
  }
  console.log("All videos processed!");
}

processVideos().catch(console.error);
