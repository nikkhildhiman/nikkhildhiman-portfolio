const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const dirs = [
  path.join(__dirname, 'public', 'reels'),
  path.join(__dirname, 'public', 'assets')
];

async function generatePosters() {
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp4'));
    
    for (const file of files) {
      const videoPath = path.join(dir, file);
      const posterPath = path.join(dir, file.replace('.mp4', '.jpg'));
      
      if (!fs.existsSync(posterPath)) {
        console.log(`Generating poster for ${file}...`);
        await new Promise((resolve, reject) => {
          ffmpeg(videoPath)
            .screenshots({
              timestamps: ['00:00:00.500'], // half second in
              filename: file.replace('.mp4', '.jpg'),
              folder: dir
            })
            .on('end', () => {
              console.log(`Done: ${posterPath}`);
              resolve();
            })
            .on('error', (err) => {
              console.error(`Error with ${file}:`, err);
              // if it fails, try at 0s
               ffmpeg(videoPath)
                .screenshots({
                  timestamps: ['00:00:00.000'],
                  filename: file.replace('.mp4', '.jpg'),
                  folder: dir
                })
                .on('end', resolve)
                .on('error', reject);
            });
        });
      } else {
        console.log(`Poster already exists for ${file}`);
      }
    }
  }
  console.log('Posters generated!');
}

generatePosters().catch(console.error);
