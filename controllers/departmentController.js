const fs = require("fs");
const path = require("path");
const {
  Department,
  DepartmentDocument,
  Employee,
  VicePresident,
  Publication,
  VicePresidentDepartment,
} = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

//Read
exports.getAllDepartments = async (req, res, next) => {
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
            { description: { [Op.iLike]: `%${search}%` } },
            { address: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    const { rows: departments, count } = await Department.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [["name", "ASC"]],
      include: [
        {
          model: VicePresident,
          as: "vice_presidents",
          attributes: ["id", "first_name", "last_name"],
          through: { attributes: [] },
          required: false,
        },
        {
          model: Employee,
          as: "employees",
          where: { is_active: true, is_unit_manager: false, is_contact_person: true },
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "title",
            "dahili_no",
            "is_active",
          ],
        },
        {
          model: Employee,
          as: "manager",
          required: false,
          where: { is_active: true },
          attributes: ["id", "first_name", "last_name", "title", "dahili_no"],
        },
        {
          model: Employee,
          as: "contact_personnel",
          required: false,
          where: { is_active: true, is_contact_person: true },
          attributes: ["id", "first_name", "last_name", "title", "dahili_no"],
        },
      ],
      distinct: true,
    });
    if (departments.length === 0) {
      return res.json({
        success: 1,
        data: {
          departments: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek birim bulunamadı.",
      });
    }

    return res.json({
      success: 1,
      data: {
        departments,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Birimler başarıyla listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const department = await Department.findByPk(id, {
      include: [
        {
          model: Employee,
          as: "employees",
          where: { is_active: true },
          required: false,
          attributes: [
            "id",
            "first_name",
            "last_name",
            "title",
            "image_url",
            "is_unit_manager",
            "dahili_no",
            "is_active",
          ],
        },
        {
          model: Employee,
          as: "manager",
          required: false,
          where: { is_active: true },
          attributes: ["id", "first_name", "last_name", "title", "dahili_no"],
        },
        {
          model: Employee,
          as: "contact_personnel",
          required: false,
          where: { is_active: true, is_contact_person: true },
          attributes: ["id", "first_name", "last_name", "title", "dahili_no"],
        },
        {
          model: VicePresident,
          as: "vice_presidents",
          attributes: ["id", "first_name", "last_name"],
        },
        {
          model: Publication,
          as: "public_notices",
          where: { record_type: "public_notice" },
          required: false,
          limit: 5,
          order: [["id", "DESC"]],
        },
        {
          model: DepartmentDocument,
          as: "documents",
          where: { is_active: true },
          required: false,
          order: [["id", "DESC"]],
        },
      ],
    });

    if (department && !department.manager) {
      const fallbackManager = await Employee.findOne({
        where: {
          department_id: id,
          is_active: true,
          is_unit_manager: true,
        },
        order: [["id", "ASC"]],
        attributes: ["id", "first_name", "last_name", "title","image_url", "dahili_no"],
      });
      if (fallbackManager) {
        department.setDataValue("manager", fallbackManager);
      }
    }

    if (!department) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Birim bulunamadı." });
    }

    return res.json({
      success: 1,
      data: department,
      message: "Birim detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
function coerceBool(v, defaultVal = false) {
  if (v === undefined || v === null || v === "") return defaultVal;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return defaultVal;
}

exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description, address, manager_employee_id, reports_to_president } =
      req.body;
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: 0,
        data: existing,
        message: "Bu isimde bir birim zaten mevcut.",
      });
    }
    const presidentFlag = coerceBool(reports_to_president, false);
    const newDepartment = await Department.create({
      name,
      description,
      address,
      manager_employee_id: manager_employee_id || null,
      reports_to_president: presidentFlag,
    });
    return res
      .status(201)
      .json({ success: 1, data: newDepartment, message: "Birimler eklendi." });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    const {
      name,
      description,
      address,
      manager_employee_id,
      reports_to_president,
    } = req.body;
    if (!department) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek birim bulunamadı.",
      });
    }
    const patch = {
      name: name ?? department.name,
      description: description ?? department.description,
      address: address ?? department.address,
      manager_employee_id:
        manager_employee_id ?? department.manager_employee_id,
    };
    if (reports_to_president !== undefined) {
      patch.reports_to_president = coerceBool(
        reports_to_president,
        department.reports_to_president,
      );
    }
    await department.update(patch);
    if (patch.reports_to_president === true) {
      await VicePresidentDepartment.destroy({ where: { department_id: id } });
    }
    await department.reload();
    res.json({
      success: 1,
      data: department,
      message: "Birim bilgisi güncellendi",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteDepartment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const department = await Department.findByPk(id);
    if (!department) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek birim bulunamadı.",
      });
    }
    const docs = await DepartmentDocument.findAll({ where: { department_id: id } });
    for (const doc of docs) {
      const files = Array.isArray(doc.files) ? doc.files : [];
      for (const filePath of files) {
        if (!filePath || typeof filePath !== "string") continue;
        const normalized = filePath.replace(/\\/g, "/");
        const relative = normalized.startsWith("/uploads/")
          ? `public${normalized}`
          : normalized.replace(/^\/+/, "");
        const absPath = path.resolve(process.cwd(), relative);
        if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
      }
    }
    await department.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Birim başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
