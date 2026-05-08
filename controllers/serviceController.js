const { Service, ServiceForm, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

//Read
exports.getAllServices = async (req, res, next) => {
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
    const { rows: services, count } = await Service.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      attributes: { exclude: ["content"] },
      order: [["name", "ASC"]],
      distinct: true,
    });
    if (services.length === 0) {
      return res.json({
        success: 1,
        data: {
          services: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "GÃ¶rÃ¼ntÃ¼lenecek hizmet bulunamadÄ±.",
      });
    }
    return res.json({
      success: 1,
      data: {
        services,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Hizmetler listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getServiceById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [{ model: ServiceForm, as: "forms" }],
    });
    if (!service) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "GÃ¶rÃ¼ntÃ¼lenecek hizmet bulunamadÄ±.",
      });
    }
    return res.json({
      success: 1,
      data: service,
      message: "Hizmet detaylarÄ± getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createService = async (req, res, next) => {
  try {
    const { name, content } = req.body;
    const image_url =
      req.files && req.files["image"]
        ? req.files["image"][0].path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/")
        : "";

    const newService = await Service.create({
      name,
      content,
      image_url,
    });
    res.status(201).json({
      success: 1,
      data: newService,
      message: "Hizmet baÅŸarÄ±yla oluÅŸturuldu.",
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

//Update
exports.updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id);
    if (!service) {
      if (req.files) {
        Object.keys(req.files).forEach((key) =>
          req.files[key].forEach((f) => fs.unlinkSync(f.path)),
        );
      }
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Hizmet bulunamadÄ±." });
    }
    const { name, content } = req.body;
    let image_url = service.image_url;
    if (req.files && req.files["image"]) {
      if (service.image_url && fs.existsSync(service.image_url))
        fs.unlinkSync(service.image_url);
      image_url = req.files["image"][0].path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
    }
    await service.update({
      name: name ?? service.name,
      content: content ?? service.content,
      image_url: image_url ?? service.image_url,
    });
    res.json({
      success: 1,
      data: service,
      message: "Hizmet baÅŸarÄ±yla gÃ¼ncellendi.",
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

//Delete
exports.deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByPk(id, {
      include: [{ model: ServiceForm, as: "forms" }],
    });

    if (!service) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek hizmet bulunamadÄ±.",
      });
    }
    const filesToDelete = [];
    if (service.image_url) filesToDelete.push(service.image_url);

    if (service.forms && service.forms.length > 0) {
      service.forms.forEach((f) => {
        if (f.file_path) filesToDelete.push(f.file_path);
      });
    }
    await service.destroy();
    filesToDelete.forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });

    return res.json({
      success: 1,
      data: null,
      message: "Hizmet ve baÄŸlÄ± tÃ¼m dosyalar kaldÄ±rÄ±ldÄ±.",
    });
  } catch (err) {
    next(err);
  }
};

