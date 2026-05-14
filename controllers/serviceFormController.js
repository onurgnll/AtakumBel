const { ServiceForm, Service } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const path = require("path");

// List all forms (paginated, with optional service_id filter)
exports.getAllForms = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
    const where = req.query.service_id ? { service_id: req.query.service_id } : {};
    const { rows: forms, count } = await ServiceForm.findAndCountAll({
      where,
      include: [{ model: Service, attributes: ["id", "name"] }],
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    return res.json({
      success: 1,
      data: { forms, pagination: getPagingData(count, req.query.page, limit) },
      message: "Formlar listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Read
exports.getFormsByServiceId = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const forms = await ServiceForm.findAll({
      where: { service_id: serviceId },
    });
    return res.json({
      success: 1,
      data: forms,
      message: "Formlar listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addFormsToService = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findByPk(serviceId);
    if (!service) {
      if (req.files && req.files["forms"]) {
        req.files["forms"].forEach((f) => fs.unlinkSync(f.path));
      }
      return res
        .status(404)
        .json({ success: 0, message: "Hizmet bulunamadı." });
    }
    if (!req.files || !req.files["forms"]) {
      return res
        .status(400)
        .json({
          success: 0,
          data: null,
          message: "Yüklenecek dosya bulunamadı.",
        });
    }
    const formData = req.files["forms"].map((file) => ({
      service_id: serviceId,
      form_name: file.originalname,
      file_path: file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"),
    }));
    const newForms = await ServiceForm.bulkCreate(formData);
    return res.status(201).json({
      success: 1,
      data: newForms,
      message: "Yeni formlar başarıyla eklendi.",
    });
  } catch (err) {
    if (req.files && req.files["forms"]) {
      req.files["forms"].forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    next(err);
  }
};

//Update
exports.updateForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { form_name } = req.body;
    const form = await ServiceForm.findByPk(id);
    if (!form) {
      if (req.files && req.files["forms"]) {
        req.files["forms"].forEach((f) => fs.unlinkSync(f.path));
      }
      return res
        .status(404)
        .json({ success: 0, message: "Güncellenecek form bulunamadı." });
    }

    let updatedData = {};
    if (form_name) updatedData.form_name = form_name;

    if (req.files && req.files["forms"]) {
      const newFile = req.files["forms"][0];
      if (fs.existsSync(form.file_path)) {
        fs.unlinkSync(form.file_path);
      }
      updatedData.file_path = newFile.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
      if (!form_name) {
        updatedData.form_name = newFile.originalname;
      }
    }
    await form.update(updatedData);

    return res.json({
      success: 1,
      data: form,
      message: "Form başarıyla güncellendi.",
    });
  } catch (err) {
    if (req.files && req.files["forms"]) {
      req.files["forms"].forEach((f) => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
    }
    next(err);
  }
};

//Delete
exports.deleteForm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const form = await ServiceForm.findByPk(id);
    if (!form) {
      return res.status(404).json({ success: 0, message: "Form bulunamadı." });
    }
    if (fs.existsSync(form.file_path)) {
      fs.unlinkSync(form.file_path);
    }
    await form.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Form başarıyla kaldırıldı.",
    });
  } catch (err) {
    next(err);
  }
};

