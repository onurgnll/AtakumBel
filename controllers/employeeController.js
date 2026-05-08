const { Employee, Department, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

//Read
exports.getAllEmployees = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const search = req.query.search ? req.query.search.trim() : null;
    const whereCondition = search
      ? {
          [Op.or]: [
            { first_name: { [Op.iLike]: `%${search}%` } },
            { last_name: { [Op.iLike]: `%${search}%` } },
            { title: { [Op.iLike]: `%${search}%` } },
            { dahili_no: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: employees, count } = await Employee.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      include: [{ model: Department, as: "department", attributes: ["name"] }],
      order: [["first_name", "ASC"]],
    });
    return res.json({
      success: 1,
      data: {
        employees,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Ã‡alÄ±ÅŸanlar listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createEmployee = async (req, res, next) => {
  console.log("Gelen Body:", req.body); // Bunu ekle
  console.log("Gelen Dosya:", req.file); // Bunu ekle
  try {
    const {
      first_name,
      last_name,
      title,
      department_id,
      dahili_no,
      is_unit_manager,
      is_contact_person,
      is_active,
    } = req.body;

    const image_path = req.file ? req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/") : null;

    const existingEmployee = await Employee.findOne({
      where: { first_name, last_name },
    });
    if (existingEmployee) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: 0,
        data: existingEmployee,
        message: "Bu isimde bir Ã§alÄ±ÅŸan zaten kayÄ±tlÄ±.",
      });
    }
    const newEmployee = await Employee.create({
      first_name,
      last_name,
      title,
      department_id,
      dahili_no,
      image_url: image_path,
      is_unit_manager: is_unit_manager || false,
      is_contact_person: is_contact_person || false,
      is_active: is_active ?? true,
    });

    return res.status(201).json({
      success: 1,
      data: newEmployee,
      message: "Personel baÅŸarÄ±yla kaydedildi.",
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

//Update
exports.updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    const {
      first_name,
      last_name,
      title,
      department_id,
      dahili_no,
      image_url,
      is_unit_manager,
      is_contact_person,
      is_active,
    } = req.body;
    if (!employee) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Ã‡alÄ±ÅŸan bulunamadÄ±" });
    }

    let image_path = employee.image_url;

    if (req.file) {
      if (employee.image_url && fs.existsSync(employee.image_url)) {
        fs.unlinkSync(employee.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
    }
    await employee.update({
      first_name: first_name ?? employee.first_name,
      last_name: last_name ?? employee.last_name,
      title: title ?? employee.title,
      department_id: department_id ?? employee.department_id,
      dahili_no: dahili_no ?? employee.dahili_no,
      image_url: image_path,
      is_unit_manager:
        is_unit_manager !== undefined
          ? is_unit_manager
          : employee.is_unit_manager,
      is_contact_person:
        is_contact_person !== undefined
          ? is_contact_person
          : employee.is_contact_person,
      is_active: is_active !== undefined ? is_active : employee.is_active,
    });
    return res.json({
      success: 1,
      data: employee,
      message: "Ã‡alÄ±ÅŸan bilgisi gÃ¼ncellendi.",
    });
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    next(err);
  }
};

//Delete
exports.deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findByPk(id);
    if (!employee) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Ã‡alÄ±ÅŸan bulunamadÄ±" });
    }
    if (employee.image_url && fs.existsSync(employee.image_url)) {
      fs.unlinkSync(employee.image_url);
    }
    await employee.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Ã‡alÄ±ÅŸan baÅŸarÄ±yla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

