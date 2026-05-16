const Video = require("../models/Video");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

exports.uploadVideo = async (req, res) => {
  try {
    const videoId = uuidv4();

    const video = await Video.create({
      title: req.body.title,
      originalFile: req.file.filename,
      owner: req.user.id,
      playlist: `/hls/${videoId}/master.m3u8`,
      status: "processing",
    });

    const jobData = {
      videoId,
      inputFile: req.file.filename,
      dbVideoId: video._id,
    };

    fs.writeFileSync(
      path.join(__dirname, "../../worker/jobs", `${videoId}.json`),
      JSON.stringify(jobData),
    );

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getVideo = async (req, res) => {
  const video = await Video.findById(req.params.id);

  if (!video) {
    return res.sendStatus(404);
  }

  res.json(video);
};

exports.listVideos = async (req, res) => {
  const videos = await Video.find();

  res.json(videos);
};
