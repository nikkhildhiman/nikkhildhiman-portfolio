const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');
const fs = require('fs');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videos = [
  'Sequence_01_25.mp4',
  'Nikkhil_x_socialz_2.MP4',
  'concept-jecrc.mp4',
  'YEH_DIL_FOR_JECRC.mp4',
  'Nikhil_x_Khushal.mp4',
  'girls-ree-4k.mp4'
];

const dir = path.join(__dirname, 'public', 'assets');

async function extractThumbnails() {
  for (const video of videos) {
    const videoPath = path.join(dir, video);
    const posterPath = path.join(dir, video.replace(/\.mp4$/i, '_2s.jpg'));
    
    if (fs.existsSync(videoPath)) {
      console.log(`Generating 2-second thumbnail for ${video}...`);
      await new Promise((resolve, reject) => {
        ffmpeg(videoPath)
          .screenshots({
            timestamps: ['00:00:02.000'],
            filename: video.replace(/\.mp4$/i, '_2s.jpg'),
            folder: dir
          })
          .on('end', () => {
            console.log(`Done: ${posterPath}`);
            resolve();
          })
          .on('error', (err) => {
            console.error(`Error with ${video}:`, err);
            resolve(); // continue even if error
          });
      });
    }
  }
}

extractThumbnails().then(() => console.log('All done!'));
