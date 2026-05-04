const { SocialMedia } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllSocialMedia = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: accounts, count } = await SocialMedia.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
    });
    if (accounts.length === 0) {
      return res.json({
        success: 1,
        data: {
          accounts: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek sosyal medya hesabı bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: {
        accounts,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Sosyal medya hesapları başarıyla listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createSocialMedia = async (req, res, next) => {
  try {
    const { platform_name, account_url } = req.body;
    const existingAccount = await SocialMedia.findOne({
      where: { account_url },
    });
    if (existingAccount) {
      return res.status(409).json({
        success: 0,
        message: "Bu sosyal medya linki zaten sistemde kayıtlı.",
      });
    }
    const newAccount = await SocialMedia.create({
      platform_name,
      account_url,
    });

    return res.status(201).json({
      success: 1,
      data: newAccount,
      message: "Sosyal medya hesabı başarıyla eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateSocialMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { account_url } = req.body;
    const account = await SocialMedia.findByPk(id);

    if (!account) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Sosyal medya hesabı bulunamadı.",
      });
    }

    await account.update({
      account_url: account_url ?? account.account_url,
    });
    return res.json({
      success: 1,
      data: account,
      message: "Sosyal medya hesap bilgileri güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

// Delete
exports.deleteSocialMedia = async (req, res, next) => {
  try {
    const { id } = req.params;
    const account = await SocialMedia.findByPk(id);

    if (!account) {
      return res.status(404).json({ success: 0, message: "Kayıt bulunamadı." });
    }

    await account.destroy();
    res.json({ success: 1, message: "Sosyal medya hesabı silindi." });
  } catch (err) {
    next(err);
  }
};
