const { President, Department, VicePresidentDepartment, sequelize } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");

function parsePresidentDepartmentIds(rawValue) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return null;
  }
  const parsed =
    typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
  if (!Array.isArray(parsed)) {
    throw new Error("president_department_ids bir dizi olmalidir.");
  }
  return Array.from(
    new Set(
      parsed
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0),
    ),
  );
}

function parseJsonArrayField(rawValue, fallback = []) {
  if (rawValue === undefined || rawValue === null || rawValue === "") {
    return fallback;
  }
  const parsed =
    typeof rawValue === "string" ? JSON.parse(rawValue) : rawValue;
  if (!Array.isArray(parsed)) {
    throw new Error("Beklenen alan dizi formatinda olmali.");
  }
  return parsed;
}

//Read
exports.getPresident = async (req, res, next) => {
  try {
    const president = await President.findOne();
    if (!president) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Başkan bilgisi bulunamadı.",
      });
    }
    const departments = await Department.findAll({
      where: { reports_to_president: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    const plain = president.get({ plain: true });
    res.json({
      success: 1,
      data: { ...plain, departments },
      message: "Başkan bilgileri getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

exports.getPresidentMessage = async (req, res, next) => {
  try {
    const president = await President.findOne({
      attributes: [
        "first_name",
        "last_name",
        "message",
        "president_image_url",
        "social_media_accounts",
      ],
      order: [["id", "DESC"]],
    });

    if (!president) {
      return res.status(404).json({
        success: 0,
        data: null,
        message: "Kayıtlı başkan mesajı bulunamadı.",
      });
    }

    return res.json({
      success: 1,
      data: president,
      message: "Güncel başkan mesajı getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

//Create-Update
exports.upsertPresident = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const {
      first_name,
      last_name,
      biography,
      message,
      social_media_accounts,
      birth_place,
      birth_year,
      grown_place,
      marital_status,
      education,
      political_career,
      work_life,
      president_department_ids,
    } = req.body;
    let president = await President.findOne();

    let finalProfileImage = president ? president.president_image_url : "";
    const uploadedFile =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);

    if (uploadedFile) {
      if (
        president?.president_image_url &&
        fs.existsSync(president.president_image_url)
      ) {
        fs.unlinkSync(president.president_image_url);
      }
      finalProfileImage = uploadedFile.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/");
    }

    let parsedSocialMedia = president?.social_media_accounts || [];
    if (social_media_accounts) {
      parsedSocialMedia =
        typeof social_media_accounts === "string"
          ? JSON.parse(social_media_accounts)
          : social_media_accounts;
      if (!Array.isArray(parsedSocialMedia)) {
        throw new Error("social_media_accounts bir dizi olmalıdır.");
      }
    }

    const parsedEducation = parseJsonArrayField(
      education,
      president?.education || [],
    );
    const parsedPoliticalCareer = parseJsonArrayField(
      political_career,
      president?.political_career || [],
    );
    const parsedWorkLife = parseJsonArrayField(
      work_life,
      president?.work_life || [],
    );

    const presidentData = {
      first_name: first_name ?? president?.first_name,
      last_name: last_name ?? president?.last_name,
      biography: biography ?? president?.biography,
      message: message ?? president?.message,
      president_image_url: finalProfileImage,
      social_media_accounts: parsedSocialMedia,
      birth_place: birth_place ?? president?.birth_place ?? null,
      birth_year:
        birth_year !== undefined && birth_year !== null && birth_year !== ""
          ? Number(birth_year)
          : (president?.birth_year ?? null),
      grown_place: grown_place ?? president?.grown_place ?? null,
      marital_status: marital_status ?? president?.marital_status ?? null,
      education: parsedEducation,
      political_career: parsedPoliticalCareer,
      work_life: parsedWorkLife,
    };

    if (president) {
      await president.update(presidentData, { transaction: t });
    } else {
      president = await President.create(presidentData, { transaction: t });
    }

    let departmentSyncError = null;
    try {
      const newDeptIds =
        president_department_ids !== undefined
          ? parsePresidentDepartmentIds(president_department_ids)
          : null;

      if (newDeptIds !== null) {
        if (newDeptIds.length === 0) {
          await Department.update(
            { reports_to_president: false },
            { where: { reports_to_president: true }, transaction: t },
          );
        } else {
          await Department.update(
            { reports_to_president: false },
            {
              where: {
                reports_to_president: true,
                id: { [Op.notIn]: newDeptIds },
              },
              transaction: t,
            },
          );
          await VicePresidentDepartment.destroy({
            where: { department_id: { [Op.in]: newDeptIds } },
            transaction: t,
          });
          await Department.update(
            { reports_to_president: true },
            {
              where: { id: { [Op.in]: newDeptIds } },
              transaction: t,
            },
          );
        }
      }
    } catch (e) {
      departmentSyncError = e;
    }

    if (departmentSyncError) {
      await t.rollback();
      return next(departmentSyncError);
    }

    await t.commit();

    const departments = await Department.findAll({
      where: { reports_to_president: true },
      attributes: ["id", "name"],
      order: [["name", "ASC"]],
    });
    const merged = { ...president.get({ plain: true }), departments };

    res.json({
      success: 1,
      data: merged,
      message: "Başkan bilgileri başarıyla güncellendi.",
    });
  } catch (err) {
    const fileToCleanup =
      req.file || (req.files && req.files.length > 0 ? req.files[0] : null);
    if (fileToCleanup && fs.existsSync(fileToCleanup.path)) {
      fs.unlinkSync(fileToCleanup.path);
    }

    await t.rollback();
    next(err);
  }
};

