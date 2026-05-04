const {
  Department,
  Employee,
  VicePresident,
  PublicNotice,
} = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllDepartments = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );

    const { rows: departments, count } = await Department.findAndCountAll({
      limit,
      offset,
      order: [["name", "ASC"]],
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
          attributes: [
            "id",
            "first_name",
            "last_name",
            "title",
            "image_url",
            "is_unit_manager",
          ],
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
    const { name, description, phone, address } = req.body;
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
      phone,
      address,
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
    const { name, description, phone, address } = req.body;
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
      phone: phone ?? department.phone,
      address: address ?? department.address,
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
