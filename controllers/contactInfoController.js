const { ContactInfo } = require("../models");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");

//Read
exports.getAllContactInfos = async (req, res, next) => {
  try {
    const { limit, offset } = getPaginationParams(
      req.query.page,
      req.query.per_page,
    );
    const { rows: contact_infos, count } = await ContactInfo.findAndCountAll({
      limit,
      offset,
    });
    if (contact_infos.length === 0) {
      return res.json({
        success: 1,
        data: {
          contact_infos: [],
          pagination: getPagingData(count, req.query.page, limit),
        },
        message: "Görüntülenecek iletişim bilgisi bulunamadı.",
      });
    }
    return res.json({
      success: 1,
      data: {
        contact_infos,
        pagination: getPagingData(count, req.query.page, limit),
      },
      message: "İletişim bilgileri listelendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create
exports.createContactInfo = async (req, res, next) => {
  try {
    const { address, phone, email, kep_address, working_hours } = req.body;
    let contact = await ContactInfo.findOne();
    if (contact) {
      return res.status(409).json({
        success: 0,
        data: contact,
        message:
          "İletişim bilgisi zaten mevcut. Lütfen mevcut kaydı güncelleyin.",
      });
    }
    const newContact = await ContactInfo.create({
      address,
      phone,
      email,
      kep_address,
      working_hours,
    });
    return res.status(201).json({
      success: 1,
      data: newContact,
      message: "Yeni iletişim bilgisi eklendi.",
    });
  } catch (err) {
    next(err);
  }
};

//Update
exports.updateContactInfo = async (req, res, next) => {
  try {
    const { address, phone, email, kep_address, working_hours } = req.body;
    let contact = await ContactInfo.findOne();
    if (contact) {
      await contact.update({
        address: address ?? contact.address,
        phone: phone ?? contact.phone,
        email: email ?? contact.email,
        kep_address: kep_address ?? contact.kep_address,
        working_hours: working_hours ?? contact.working_hours,
      });
    }
    return res.json({
      success: 1,
      data: contact,
      message: "İletişim bilgileri başarıyla senkronize edildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Delete
exports.deleteContactInfo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await ContactInfo.findByPk(id);
    if (!contact) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Silinecek iletişim bilgisi bulunamadı.",
      });
    }
    await contact.destroy();
    return res.json({
      success: 1,
      data: null,
      message: "İletişm bilgisi silindi.",
    });
  } catch (err) {
    next(err);
  }
};
