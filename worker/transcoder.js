const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, "../config.env"),
});

const fs = require("fs");
const mongoose = require("mongoose");
const { spawn } = require("child_process");

const Video = require("../api/models/Video");

mongoose.connect(process.env.MONGO_URI);

const JOBS_DIR = path.join(__dirname, "jobs");

async function processJob(jobFile) {
  const jobPath = path.join(JOBS_DIR, jobFile);

  const job = JSON.parse(fs.readFileSync(jobPath));

  const inputPath = path.join(__dirname, "../api/uploads", job.inputFile);

  const outputDir = path.join(__dirname, "../api/storage/hls", job.videoId);

  fs.mkdirSync(outputDir, {
    recursive: true,
  });

  const ffmpegPath = path.join(__dirname, "../ffmpeg/ffmpeg.exe");

  const outputPath = path.join(outputDir, "master.m3u8");

  const ffmpeg = spawn(ffmpegPath, [
    "-i",
    inputPath,

    "-preset",
    "fast",

    "-g",
    "48",

    "-sc_threshold",
    "0",

    "-map",
    "0:v:0",
    "-map",
    "0:a:0",

    "-s:v:0",
    "1280x720",

    "-c:v",
    "libx264",

    "-c:a",
    "aac",

    "-b:v",
    "2800k",

    "-b:a",
    "128k",

    "-hls_time",
    "10",

    "-hls_playlist_type",
    "vod",

    outputPath,
  ]);

  ffmpeg.stderr.on("data", (data) => {
    console.log(data.toString());
  });

  ffmpeg.on("close", async (code) => {
    if (code === 0) {
      await Video.findByIdAndUpdate(job.dbVideoId, {
        status: "ready",
      });

      fs.unlinkSync(jobPath);

      console.log("Video Ready");
    } else {
      await Video.findByIdAndUpdate(job.dbVideoId, {
        status: "failed",
      });
    }
  });
}

setInterval(() => {
  const jobs = fs.readdirSync(JOBS_DIR);

  for (const job of jobs) {
    processJob(job);
  }
}, 5000);
