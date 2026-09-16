const { Project } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getAllProjects = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { name: { [Op.iLike]: `%${search}%` } },
            { content: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: projects, count } = await Project.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: { exclude: ["content"] },
      order: [["name", "ASC"]],
      distinct: true,
    });
    if (projects.length === 0) {
      return res.json({
        success: 1,
        data: {
          projects: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek proje bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: {
        projects,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Projeler listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Görüntülenecek proje bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: project,
      message: "Proje detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    const image_url =
      req.files && req.files["image"]
        ? req.files["image"][0].path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/")
        : "";

    const newProject = await Project.create({
      name,
      content: content ?? "",
      image_url,
    });
    res.status(201).json({
      success: 1,
      data: newProject,
      message: "Proje başarıyla oluşturuldu.",
    });
  } catch (err) {
    if (req.files) {
      Object.keys(req.files).forEach((key) => {
        req.files[key].forEach((file) => {
          if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
        });
      });
    }
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      if (req.files) {
        Object.keys(req.files).forEach((key) =>
          req.files[key].forEach((f) => fs.unlinkSync(f.path)),
        );
      }
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Proje bulunamadı." });
    }
    const { name, content } = req.body;
    let image_url = project.image_url;
    if (req.files && req.files["image"]) {
      if (project.image_url && fs.existsSync(project.image_url))
        fs.unlinkSync(project.image_url);
      image_url = req.files["image"][0].path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
    }
    await project.update({
      name: name ?? project.name,
      content: content ?? project.content,
      image_url: image_url ?? project.image_url,
    });
    res.json({
      success: 1,
      data: project,
      message: "Proje başarıyla güncellendi.",
    });
  } catch (err) {
    if (req.files) {
      Object.keys(req.files).forEach((key) =>
        req.files[key].forEach((f) => fs.unlinkSync(f.path)),
      );
    }
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek proje bulunamadı.",
      });
    }
    const imageToDelete = project.image_url;
    await project.destroy();
    if (imageToDelete && fs.existsSync(imageToDelete)) {
      fs.unlinkSync(imageToDelete);
    }

    return res.json({
      success: 1,
      data: null,
      message: "Proje kaldırıldı.",
    });
  } catch (err) {
    next(err);
  }
};
