const { CouncilMember } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
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
      order: [["id", "ASC"]],
    });
    return res.json({
      success: 1,
      data: {
        members,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Meclis Ã¼yeleri baÅŸarÄ±yla getirildi.",
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
        message: "Bu Ã¼ye zaten kayÄ±tlÄ±.",
      });
    }
    const image_path = req.file ? req.file.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/") : null;
    const member = await CouncilMember.create({
      first_name,
      last_name,
      political_party,
      image_url: image_path,
    });

    return res.status(201).json({
      success: 1,
      data: member,
      message: "Meclis Ã¼yesi baÅŸarÄ±yla eklendi.",
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
        .json({ success: 0, message: "GÃ¼ncellenecek Ã¼ye bulunamadÄ±." });
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
      message: "Meclis Ã¼yesi bilgileri baÅŸarÄ±yla gÃ¼ncellendi.",
    });
  } catch (err) {
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
        .json({ success: 0, data: null, message: "Silinecek Ã¼ye bulunamadÄ±." });
    }
    if (member.image_url && fs.existsSync(member.image_url)) {
      fs.unlinkSync(member.image_url);
    }

    await member.destroy();

    return res.json({
      success: 1,
      data: null,
      message: "Meclis Ã¼yesi ve baÄŸlÄ± tÃ¼m dosyalar baÅŸarÄ±yla silindi.",
    });
  } catch (err) {
    next(err);
  }
};

