"use strict";

async function firstId(sequelize, sql, replacements) {
  const [rows] = await sequelize.query(sql, { replacements });
  return rows[0]?.id ?? null;
}

async function departmentIdByName(queryInterface, name) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Departments" WHERE name = :name ORDER BY id DESC LIMIT 1`,
    { name },
  );
  if (id == null) throw new Error(`Müdürlük bulunamadı: ${name}`);
  return id;
}

async function vicePresidentIdByName(queryInterface, firstName, lastName) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Vice_Presidents" WHERE first_name = :fn AND last_name = :ln ORDER BY id DESC LIMIT 1`,
    { fn: firstName, ln: lastName },
  );
  if (id == null) throw new Error(`Başkan yardımcısı bulunamadı: ${firstName} ${lastName}`);
  return id;
}

async function serviceIdByName(queryInterface, name) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Services" WHERE name = :name ORDER BY id DESC LIMIT 1`,
    { name },
  );
  if (id == null) throw new Error(`Hizmet bulunamadı: ${name}`);
  return id;
}

async function councilDecisionIdByNo(queryInterface, decisionNo) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Council_Decisions" WHERE decision_no = :no ORDER BY id DESC LIMIT 1`,
    { no: decisionNo },
  );
  if (id == null) throw new Error(`Meclis kararı bulunamadı: ${decisionNo}`);
  return id;
}

async function presidentIdByName(queryInterface, firstName, lastName) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Presidents" WHERE first_name = :fn AND last_name = :ln ORDER BY id DESC LIMIT 1`,
    { fn: firstName, ln: lastName },
  );
  if (id == null) throw new Error(`Başkan bulunamadı: ${firstName} ${lastName}`);
  return id;
}

async function newsIdByTitle(queryInterface, title) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "News" WHERE title = :title ORDER BY id DESC LIMIT 1`,
    { title },
  );
  if (id == null) throw new Error(`Haber bulunamadı: ${title}`);
  return id;
}

async function eventIdByTitle(queryInterface, title) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Events" WHERE title = :title ORDER BY id DESC LIMIT 1`,
    { title },
  );
  if (id == null) throw new Error(`Etkinlik bulunamadı: ${title}`);
  return id;
}

async function facilityIdByName(queryInterface, name) {
  const id = await firstId(
    queryInterface.sequelize,
    `SELECT id FROM "Facilities" WHERE name = :name ORDER BY id DESC LIMIT 1`,
    { name },
  );
  if (id == null) throw new Error(`Tesis bulunamadı: ${name}`);
  return id;
}

module.exports = {
  departmentIdByName,
  vicePresidentIdByName,
  serviceIdByName,
  councilDecisionIdByNo,
  presidentIdByName,
  newsIdByTitle,
  eventIdByTitle,
  facilityIdByName,
};
