const { CouncilMember, sequelize } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { reorderByIds, getNextSortOrder } = require("../helpers/reorderEntities");
const fs = require("fs");
const { Op } = require("sequelize");

//Read
exports.getAllCouncilMembers = async (req, res, next) => {
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
            { political_party: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};
    const { rows: members, count } = await CouncilMember.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.json({
      success: 1,
      data: {
        members,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Meclis üyeleri başarıyla getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.addMemberToCouncil = async (req, res, next) => {
  try {
    const { first_name, last_name, political_party } = req.body;
    const existingMember = await CouncilMember.findOne({
      where: {
        first_name,
        last_name,
      },
    });
    if (existingMember) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({
        success: 0,
        message: "Bu üye zaten kayıtlı.",
      });
    }
    const image_path = req.file ? req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/") : null;
    const nextOrder = await getNextSortOrder(CouncilMember);
    const member = await CouncilMember.create({
      first_name,
      last_name,
      political_party,
      image_url: image_path,
      order: nextOrder,
    });

    return res.status(201).json({
      success: 1,
      data: member,
      message: "Meclis üyesi başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.updateMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await CouncilMember.findByPk(id);

    if (!member) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res
        .status(404)
        .json({ success: 0, message: "Güncellenecek üye bulunamadı." });
    }

    const { first_name, last_name, political_party } = req.body;
    let image_path = member.image_url;
    if (req.file) {
      if (member.image_url && fs.existsSync(member.image_url)) {
        fs.unlinkSync(member.image_url);
      }
      image_path = req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
    }

    await member.update({
      first_name: first_name ?? member.first_name,
      last_name: last_name ?? member.last_name,
      political_party: political_party ?? member.political_party,
      image_url: image_path,
    });

    return res.json({
      success: 1,
      data: member,
      message: "Meclis üyesi bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.reorderCouncilMembers = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { ids } = req.body;
    await reorderByIds(CouncilMember, ids, t);
    await t.commit();
    const members = await CouncilMember.findAll({
      order: [
        ["order", "ASC"],
        ["id", "ASC"],
      ],
    });
    return res.json({
      success: 1,
      data: { members },
      message: "Sıralama güncellendi.",
    });
  } catch (err) {
    await t.rollback();
    if (err.code === "INVALID_IDS" || err.code === "INCOMPLETE_LIST") {
      return res.status(400).json({ success: 0, data: null, message: err.message });
    }
    if (err.code === "NOT_FOUND") {
      return res.status(404).json({ success: 0, data: null, message: err.message });
    }
    next(err);
  }
};

exports.deleteMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const member = await CouncilMember.findByPk(id);

    if (!member) {
      return res
        .status(404)
        .json({ success: 0, data: null, message: "Silinecek üye bulunamadı." });
    }
    if (member.image_url && fs.existsSync(member.image_url)) {
      fs.unlinkSync(member.image_url);
    }

    await member.destroy();

    return res.json({
      success: 1,
      data: null,
      message: "Meclis üyesi ve bağlı tüm dosyalar başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

