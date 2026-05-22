"use strict";

const reorderByIds = async (Model, ids, transaction) => {
  if (!Array.isArray(ids) || ids.length === 0) {
    const err = new Error("ids dizisi zorunludur.");
    err.code = "INVALID_IDS";
    throw err;
  }

  const normalizedIds = ids
    .map((id) => Number(id))
    .filter((id) => Number.isInteger(id) && id > 0);

  if (normalizedIds.length !== ids.length) {
    const err = new Error("Geçersiz sıralama listesi.");
    err.code = "INVALID_IDS";
    throw err;
  }

  const unique = new Set(normalizedIds);
  if (unique.size !== normalizedIds.length) {
    const err = new Error("Tekrarlayan kayıt kimliği.");
    err.code = "INVALID_IDS";
    throw err;
  }

  const existing = await Model.findAll({
    where: { id: normalizedIds },
    attributes: ["id"],
    transaction,
  });

  if (existing.length !== normalizedIds.length) {
    const err = new Error("Bazı kayıtlar bulunamadı.");
    err.code = "NOT_FOUND";
    throw err;
  }

  const totalCount = await Model.count({ transaction });
  if (totalCount !== normalizedIds.length) {
    const err = new Error("Sıralama için tüm kayıtların kimlikleri gönderilmelidir.");
    err.code = "INCOMPLETE_LIST";
    throw err;
  }

  await Promise.all(
    normalizedIds.map((id, index) =>
      Model.update({ order: index + 1 }, { where: { id }, transaction }),
    ),
  );

  return normalizedIds;
};

const getNextSortOrder = async (Model, transaction) => {
  const maxOrder = await Model.max("order", { transaction });
  const numeric = Number(maxOrder);
  return Number.isFinite(numeric) ? numeric + 1 : 1;
};

module.exports = { reorderByIds, getNextSortOrder };
