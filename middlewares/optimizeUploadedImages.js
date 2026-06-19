"use strict";

const { processUploadedImages } = require("../helpers/processUploadedImage");

async function optimizeUploadedImages(req, res, next) {
  try {
    await processUploadedImages(req);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = optimizeUploadedImages;
