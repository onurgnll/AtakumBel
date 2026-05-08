exports.uploadEditorImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: 0,
      data: null,
      message: "Yuklenecek gorsel bulunamadi.",
    });
  }

  const imageUrl = req.file.path
    .replace(/\\/g, "/")
    .replace(/^.*?(\/uploads\/)/, "/uploads/");

  return res.status(201).json({
    success: 1,
    data: { image_url: imageUrl },
    message: "Editor gorseli yuklendi.",
  });
};
