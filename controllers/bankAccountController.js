const { BankAccount } = require("../models");
const { Op } = require("sequelize");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllBankAccounts = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: bank_accounts, count } = await BankAccount.findAndCountAll({
      limit,
      offset,
      order: [["bank_name", "ASC"]],
    });
    return res.json({
      success: 1,
      data: {
        bank_accounts,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "Banka hesapları başarıyla listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createBankAccount = async (req, res, next) => {
  try {
    const { bank_name, iban } = req.body;
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    const existingAccount = await BankAccount.findOne({
      where: { iban: cleanIban },
    });

    if (existingAccount) {
      return res.status(409).json({
        success: 0,
        data: null,
        message: "Bu IBAN numarası ile kayıtlı bir hesap zaten mevcut.",
      });
    }
    const bank_account = await BankAccount.create({
      bank_name,
      iban: cleanIban,
    });
    return res.status(201).json({
      success: 1,
      data: bank_account,
      message: "Yeni banka hesap bilgileri eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bank_name, iban } = req.body;
    const cleanIban = iban.replace(/\s/g, "").toUpperCase();
    const bank_account = await BankAccount.findByPk(id);
    if (!bank_account) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Güncellenmek istenen banka hesap bilgisi bulunamadı.",
      });
    }
    const existingAccount = await BankAccount.findOne({
      where: { iban: cleanIban, id: { [Op.ne]: id } },
    });

    if (existingAccount) {
      return res.status(409).json({
        success: 0,
        data: null,
        message: "Bu IBAN numarası ile kayıtlı başka bir hesap zaten mevcut.",
      });
    }

    await bank_account.update({
      bank_name: bank_name ?? bank_account.bank_name,
      iban: iban ? iban.replace(/\s/g, "").toUpperCase() : bank_account.iban,
    });
    return res.json({
      success: 1,
      data: bank_account,
      message: "Banka hesap bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteBankAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bank_account = await BankAccount.findByPk(id);
    if (!bank_account) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinmek istenen banka hesap bilgisi bulunamadı.",
      });
    }
    await bank_account.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "Banka hesap bilgisi başarıyla silindi.",
    });
  } catch (err) {
    next(err);
  }
};
