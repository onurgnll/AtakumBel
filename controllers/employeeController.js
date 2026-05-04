const { Employee, Department, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");

//Read
exports.getAllEmployees = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: employees, count } = await Employee.findAndCountAll({
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
      message: "Çalışanlar listelendi.",
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
      extension_no,
      is_unit_manager,
    } = req.body;

    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const existingEmployee = await Employee.findOne({
      where: { first_name, last_name },
    });
    if (existingEmployee) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: 0,
        data: existingEmployee,
        message: "Bu isimde bir çalışan zaten kayıtlı.",
      });
    }
    const newEmployee = await Employee.create({
      first_name,
      last_name,
      title,
      department_id,
      extension_no,
      image_url: image_path,
      is_unit_manager: is_unit_manager || false,
    });

    return res.status(201).json({
      success: 1,
      data: newEmployee,
      message: "Personel başarıyla kaydedildi.",
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
      extension_no,
      image_url,
      is_unit_manager,
    } = req.body;
    if (!employee) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Çalışan bulunamadı" });
    }

    let image_path = employee.image_url;

    if (req.file) {
      if (employee.image_url && fs.existsSync(employee.image_url)) {
        fs.unlinkSync(employee.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/");
    }
    await employee.update({
      first_name: first_name ?? employee.first_name,
      last_name: last_name ?? employee.last_name,
      title: title ?? employee.title,
      department_id: department_id ?? employee.department_id,
      extension_no: extension_no ?? employee.extension_no,
      image_url: image_path,
      is_unit_manager:
        is_unit_manager !== undefined
          ? is_unit_manager
          : employee.is_unit_manager,
    });
    return res.json({
      success: 1,
      data: employee,
      message: "Çalışan bilgisi güncellendi.",
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
        .json({ success: 0, data: null, message: "Çalışan bulunamadı" });
    }
    if (employee.image_url && fs.existsSync(employee.image_url)) {
      fs.unlinkSync(employee.image_url);
    }
    await employee.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Çalışan başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
