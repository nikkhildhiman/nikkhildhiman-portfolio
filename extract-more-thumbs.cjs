const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videoPath = path.join(__dirname, 'public', 'assets', 'Nikkhil_x_socialz_2.MP4');
const dir = path.join(__dirname, 'public', 'assets');

async function extractThumbnails() {
  const times = ['00:00:30.000', '00:01:00.000'];
  const labels = ['30s', '60s'];
  
  if (fs.existsSync(videoPath)) {
    for (let i = 0; i < times.length; i++) {
      console.log(`Generating ${labels[i]} thumbnail...`);
      await new Promise((resolve) => {
        ffmpeg(videoPath)
          .screenshots({
            timestamps: [times[i]],
            filename: `Nikkhil_x_socialz_2_${labels[i]}.jpg`,
            folder: dir
          })
          .on('end', resolve)
          .on('error', (err) => {
            console.error(`Error at ${labels[i]}:`, err);
            resolve();
          });
      });
    }
  }
}

extractThumbnails().then(() => console.log('All done!'));
