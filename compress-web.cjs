const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const dir = path.join(__dirname, 'public', 'assets');
const videos = [
  'Nikkhil_x_socialz_2.MP4',
  'Sequence_01_25.mp4'
];

async function compressVideos() {
  for (const video of videos) {
    const inputPath = path.join(dir, video);
    const outputPath = path.join(dir, 'compressed_' + video);
    
    if (fs.existsSync(inputPath)) {
      console.log(`Compressing ${video}...`);
      await new Promise((resolve) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-c:v libx264',
            '-crf 28', // high compression, decent quality
            '-preset veryfast',
            '-c:a aac',
            '-b:a 128k',
            '-movflags +faststart',
            '-vf scale=-2:1080' // limit height to 1080p, maintain aspect ratio
          ])
          .output(outputPath)
          .on('end', () => {
            console.log(`Finished compressing ${video}. Overwriting original...`);
            fs.renameSync(outputPath, inputPath); // Overwrite original with compressed
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error compressing ${video}:`, err);
            resolve();
          })
          .run();
      });
    }
  }
}

compressVideos().then(() => console.log('All compression done!'));
