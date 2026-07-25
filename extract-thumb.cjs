const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const videoPath = path.join(__dirname, 'public', 'assets', 'Nikkhil_x_socialz_2.MP4');
const dir = path.join(__dirname, 'public', 'assets');

console.log('Generating 1-second thumbnail for Nikkhil_x_socialz_2.MP4...');

ffmpeg(videoPath)
  .screenshots({
    timestamps: ['00:00:01.000'],
    filename: 'Nikkhil_x_socialz_2.jpg',
    folder: dir
  })
  .on('end', () => {
    console.log('Thumbnail successfully generated at 1s mark.');
  })
  .on('error', (err) => {
    console.error('Error generating thumbnail:', err);
  });
