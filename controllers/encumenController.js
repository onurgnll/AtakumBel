const { Encumen, EncumenMembership, Employee } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllEncumens = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );

    const { rows: encumens, count } = await Encumen.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: EncumenMembership,
          as: "memberships",
          include: [
            {
              model: Employee,
              as: "employee",
              attributes: ["first_name", "last_name"],
            },
          ],
        },
      ],
    });

    return res.json({
      success: 1,
      data: {
        encumens,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Encümen dönemleri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createEncumen = async (req, res, next) => {
  try {
    const { term_name, is_active } = req.body;
    const existingEncumen = await Encumen.findOne({ where: { term_name } });
    if (existingEncumen) {
      return res.status(409).json({
        success: 0,
        data: existingEncumen,
        message: "Bu dönem ismiyle zaten bir kayıt mevcut.",
      });
    }

    const newEncumen = await Encumen.create({
      term_name,
      is_active: is_active !== undefined ? is_active : true,
    });

    return res.status(201).json({
      success: 1,
      data: newEncumen,
      message: "Encümen dönemi başarıyla oluşturuldu.",
    });
  } catch (err) {
    next(err);
  }
};

// Update
exports.updateEncumen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { term_name, is_active } = req.body;

    const encumen = await Encumen.findByPk(id);
    if (!encumen) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Kayıt bulunamadı." });
    }

    await encumen.update({
      term_name: term_name ?? encumen.term_name,
      is_active: is_active ?? encumen.is_active,
    });

    return res.json({
      success: 1,
      data: encumen,
      message: "Encümen bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteEncumen = async (req, res, next) => {
  try {
    const { id } = req.params;
    const encumen = await Encumen.findByPk(id);

    if (!encumen) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Kayıt bulunamadı." });
    }
    await encumen.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Encümen dönemi silindi.",
    });
  } catch (err) {
    next(err);
  }
};
