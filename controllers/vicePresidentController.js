const {
  VicePresident,
  Department,
  VicePresidentDepartment,
  sequelize,
} = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const fs = require("fs");
const { Op } = require("sequelize");

//Read
exports.getAllVicePresidents = async (req, res, next) => {
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
            { biography: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: vice_presidents, count } =
      await VicePresident.findAndCountAll({
        where: whereCondition,
        limit,
        offset,
        distinct: true,
        include: [
          {
            model: Department,
            as: "departments",
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });
    if (vice_presidents.length === 0) {
      return res.json({
        success: 1,
        data: {
          vice_presidents: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek başkan yadımcısı bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: {
        vice_presidents,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Başkan yardımcıları listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createVicePresident = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { first_name, last_name, biography, department_ids, department_id } =
      req.body;

    const existingVicePresident = await VicePresident.findOne({
      where: {
        first_name,
        last_name,
      },
    });
    if (existingVicePresident) {
      return res.status(409).json({
        success: 0,
        data: existingVicePresident,
        message: "Bu başkan yardımcısı zaten kayıtlı.",
      });
    }

    const image_path = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newVicePresident = await VicePresident.create({
      first_name,
      last_name,
      biography,
      department_id: null,
      image_url: image_path,
    }, { transaction: t });

    let parsedDepartmentIds = [];
    if (department_ids || department_id) {
      parsedDepartmentIds =
        typeof department_ids === "string"
          ? JSON.parse(department_ids)
          : department_ids || [];
      if (parsedDepartmentIds.length === 0 && department_id) {
        parsedDepartmentIds = [department_id];
      }
    }

    if (parsedDepartmentIds.length > 0) {
      const relationRows = parsedDepartmentIds.map((departmentId) => ({
        vice_president_id: newVicePresident.id,
        department_id: Number(departmentId),
      }));
      await VicePresidentDepartment.bulkCreate(relationRows, { transaction: t });
    }

    await t.commit();
    res.status(201).json({
      success: 1,
      data: newVicePresident,
      message: "Başkan yardımcısı eklendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//Update
exports.updateVicePresident = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const vice_president = await VicePresident.findByPk(id);

    if (!vice_president) {
      return res.status(404).json({ success: 0, message: "Kayıt bulunamadı." });
    }

    const { first_name, last_name, biography, department_ids, department_id } =
      req.body;
    let image_path = vice_president.image_url;

    if (req.file) {
      if (vice_president.image_url && fs.existsSync(vice_president.image_url)) {
        fs.unlinkSync(vice_president.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/");
    }

    await vice_president.update(
      {
      first_name: first_name ?? vice_president.first_name,
      last_name: last_name ?? vice_president.last_name,
      biography: biography ?? vice_president.biography,
      image_url: image_path,
      },
      { transaction: t },
    );

    if (department_ids || department_id) {
      const parsedDepartmentIds =
        typeof department_ids === "string"
          ? JSON.parse(department_ids)
          : department_ids || [];
      const finalDepartmentIds =
        parsedDepartmentIds.length === 0 && department_id
          ? [department_id]
          : parsedDepartmentIds;
      await VicePresidentDepartment.destroy({
        where: { vice_president_id: id },
        transaction: t,
      });
      if (finalDepartmentIds.length > 0) {
        await VicePresidentDepartment.bulkCreate(
          finalDepartmentIds.map((departmentId) => ({
            vice_president_id: Number(id),
            department_id: Number(departmentId),
          })),
          { transaction: t },
        );
      }
    }

    await t.commit();

    res.json({
      success: 1,
      data: vice_president,
      message: "Başkan Yardımcısı bilgileri güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
};

//Delete
exports.deleteVicePresident = async (req, res, next) => {
  try {
    const { id } = req.params;
    const vice_president = await VicePresident.findByPk(id);
    if (!vice_president) {
      return res.status(404).json({
        success: 1,
        data: null,
        message: "Silinecek başkan yardımcısı bulunamadı.",
      });
    }
    const imageToDelete = vice_president.image_url;
    await vice_president.destroy();
    if (imageToDelete && fs.existsSync(imageToDelete)) {
      fs.unlinkSync(imageToDelete);
    }
    res.json({ success: 1, data: null, message: "Başkan yardımcısı silindi." });
  } catch (err) {
    next(err);
  }
};
