const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
// fluent-ffmpeg can probe using ffprobe, but @ffmpeg-installer doesn't include ffprobe.
// Instead, we can just run ffmpeg -i and capture the output.
const { execSync } = require('child_process');

try {
  const videoPath = path.join(__dirname, 'public', 'assets', 'Nikkhil_x_socialz_2.MP4');
  const output = execSync(`"${ffmpegInstaller.path}" -i "${videoPath}" 2>&1`, { encoding: 'utf8' });
  console.log(output);
} catch (e) {
  // ffmpeg -i without an output file will exit with code 1, which throws.
  console.log(e.stdout || e.stderr || e.message);
}
