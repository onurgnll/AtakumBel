const {
  Department,
  Employee,
  VicePresident,
  PublicNotice,
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
          model: Employee,
          as: "employees",
          where: { is_active: true },
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
          model: PublicNotice,
          as: "public_notices",
          limit: 5,
          order: [["id", "DESC"]],
        },
      ],
    });

    if (!department) {
      res
        .status(404)
        .json({ success: 0, data: null, message: "Birim bulunamadı." });
    }

    res.json({
      success: 1,
      data: department,
      message: "Birim detayları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createDepartment = async (req, res, next) => {
  try {
    const { name, description, address, manager_employee_id } = req.body;
    const existing = await Department.findOne({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: 0,
        data: existing,
        message: "Bu isimde bir birim zaten mevcut.",
      });
    }
    const newDepartment = await Department.create({
      name,
      description,
      address,
      manager_employee_id: manager_employee_id || null,
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
    const { name, description, address, manager_employee_id } = req.body;
    if (!department) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenecek birim bulunamadı.",
      });
    }
    await department.update({
      name: name ?? department.name,
      description: description ?? department.description,
      address: address ?? department.address,
      manager_employee_id:
        manager_employee_id ?? department.manager_employee_id,
    });
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
