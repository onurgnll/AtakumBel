"use strict";

const RT = {
  PUBLIC_NOTICE: "public_notice",
  TENDER: "tender",
  COUNCIL_DECISION: "council_decision",
  REAL_ESTATE_LISTING: "real_estate_listing",
};

function stringifyFiles(val) {
  if (val == null || val === "") return "[]";
  if (typeof val === "string") {
    try {
      JSON.parse(val);
      return val;
    } catch {
      return JSON.stringify([val]);
    }
  }
  try {
    if (Array.isArray(val)) return JSON.stringify(val);
    if (typeof val === "object") return JSON.stringify(val);
    return "[]";
  } catch {
    return "[]";
  }
}

function dateOnly(v) {
  if (v == null || v === "") return null;
  const s = String(v).trim().slice(0, 10);
  return s || null;
}

async function tableExists(queryInterface, name) {
  const [[row]] = await queryInterface.sequelize.query(
    `SELECT to_regclass(:q) AS t`,
    { replacements: { q: `public."${name}"` } },
  );
  return row && row.t != null;
}

module.exports = {
  async up(queryInterface, Sequelize) {
    const sequelize = queryInterface.sequelize;
    const t = await sequelize.transaction();

    try {

      await queryInterface.createTable(
        "Publications",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          record_type: {
            type: Sequelize.ENUM(
              RT.PUBLIC_NOTICE,
              RT.TENDER,
              RT.COUNCIL_DECISION,
              RT.REAL_ESTATE_LISTING,
            ),
            allowNull: false,
          },
          title: { type: Sequelize.STRING, allowNull: false },
          description: { type: Sequelize.TEXT, allowNull: true },
          publish_date: { type: Sequelize.DATEONLY, allowNull: true },
          is_active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          files: { type: Sequelize.JSONB, allowNull: true, defaultValue: [] },
          content: { type: Sequelize.TEXT, allowNull: true },
          status: {
            type: Sequelize.ENUM("on_hold", "completed", "upcoming"),
            allowNull: true,
          },
          start_date: { type: Sequelize.DATEONLY, allowNull: true },
          end_date: { type: Sequelize.DATEONLY, allowNull: true },
          file_url: { type: Sequelize.STRING, allowNull: true },
          department_id: { type: Sequelize.INTEGER, allowNull: true },
          decision_id: { type: Sequelize.INTEGER, allowNull: true },
          tender_number: { type: Sequelize.STRING, allowNull: true },
          decision_no: { type: Sequelize.STRING, allowNull: true },
          summary: { type: Sequelize.TEXT, allowNull: true },
          full_text: { type: Sequelize.TEXT, allowNull: true },
          date: { type: Sequelize.DATEONLY, allowNull: true },
        },
        { transaction: t },
      );

      await queryInterface.addIndex("Publications", ["record_type"], {
        name: "publications_record_type_idx",
        transaction: t,
      });

      await queryInterface.addConstraint("Publications", {
        fields: ["department_id"],
        type: "foreign key",
        name: "publications_department_id_fkey",
        references: { table: "Departments", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        transaction: t,
      });

      await queryInterface.addConstraint("Publications", {
        fields: ["decision_id"],
        type: "foreign key",
        name: "publications_decision_id_fkey",
        references: { table: "Publications", field: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        transaction: t,
      });

      const councilMap = new Map();

      if (await tableExists(queryInterface, "Council_Decisions")) {
        const [councilRows] = await sequelize.query(
          `SELECT * FROM "Council_Decisions" ORDER BY id ASC`,
          { transaction: t },
        );
        for (const row of councilRows) {
          const files = stringifyFiles(row.files);
          const [ins] = await sequelize.query(
            `INSERT INTO "Publications" (
              record_type, title, description, publish_date, is_active, files,
              content, status, start_date, end_date, file_url, department_id, decision_id,
              tender_number, decision_no, summary, full_text, "date"
            ) VALUES (
              :record_type, :title, :description, :publish_date, :is_active, CAST(:files AS jsonb),
              NULL, NULL, NULL, NULL, :file_url, NULL, NULL,
              NULL, :decision_no, :summary, :full_text, :d
            ) RETURNING id`,
            {
              replacements: {
                record_type: RT.COUNCIL_DECISION,
                title: row.title,
                description: row.description,
                publish_date: row.publish_date,
                is_active: row.is_active !== false && row.is_active !== 0,
                files,
                file_url: row.file_url,
                decision_no: row.decision_no,
                summary: row.summary,
                full_text: row.full_text,
                d: dateOnly(row.date),
              },
              transaction: t,
            },
          );
          const newId = ins[0].id;
          councilMap.set(row.id, newId);
        }
      }

      if (await tableExists(queryInterface, "Public_Notices")) {
        const [noticeRows] = await sequelize.query(
          `SELECT * FROM "Public_Notices" ORDER BY id ASC`,
          { transaction: t },
        );
        for (const row of noticeRows) {
          const mappedDecision =
            row.decision_id != null && councilMap.has(row.decision_id)
              ? councilMap.get(row.decision_id)
              : null;
          const files = stringifyFiles(row.files);
          await sequelize.query(
            `INSERT INTO "Publications" (
              record_type, title, description, publish_date, is_active, files,
              content, status, start_date, end_date, file_url, department_id, decision_id,
              tender_number, decision_no, summary, full_text, "date"
            ) VALUES (
              :record_type, :title, :description, :publish_date, :is_active, CAST(:files AS jsonb),
              :content, :status, :start_date, :end_date, :file_url, :department_id, :decision_id,
              NULL, NULL, NULL, NULL, NULL
            )`,
            {
              replacements: {
                record_type: RT.PUBLIC_NOTICE,
                title: row.title,
                description: row.description,
                publish_date: row.publish_date,
                is_active: row.is_active !== false && row.is_active !== 0,
                files,
                content: row.content,
                status: row.status,
                start_date: dateOnly(row.start_date),
                end_date: dateOnly(row.end_date),
                file_url: row.file_url,
                department_id: row.department_id,
                decision_id: mappedDecision,
              },
              transaction: t,
            },
          );
        }
      }

      if (await tableExists(queryInterface, "Tenders")) {
        const [tenderRows] = await sequelize.query(
          `SELECT * FROM "Tenders" ORDER BY id ASC`,
          { transaction: t },
        );
        for (const row of tenderRows) {
          const files = stringifyFiles(row.files);
          await sequelize.query(
            `INSERT INTO "Publications" (
              record_type, title, description, publish_date, is_active, files,
              content, status, start_date, end_date, file_url, department_id, decision_id,
              tender_number, decision_no, summary, full_text, "date"
            ) VALUES (
              :record_type, :title, :description, :publish_date, :is_active, CAST(:files AS jsonb),
              NULL, NULL, :start_date, :end_date, NULL, :department_id, NULL,
              :tender_number, NULL, NULL, NULL, NULL
            )`,
            {
              replacements: {
                record_type: RT.TENDER,
                title: row.title,
                description: row.description,
                publish_date: row.publish_date,
                is_active: row.is_active !== false && row.is_active !== 0,
                files,
                start_date: dateOnly(row.start_date),
                end_date: dateOnly(row.end_date),
                department_id: row.department_id,
                tender_number: row.tender_number,
              },
              transaction: t,
            },
          );
        }
      }

      if (await tableExists(queryInterface, "Real_Estate_Listings")) {
        const [reRows] = await sequelize.query(
          `SELECT * FROM "Real_Estate_Listings" ORDER BY id ASC`,
          { transaction: t },
        );
        for (const row of reRows) {
          const files = stringifyFiles(row.files);
          await sequelize.query(
            `INSERT INTO "Publications" (
              record_type, title, description, publish_date, is_active, files,
              content, status, start_date, end_date, file_url, department_id, decision_id,
              tender_number, decision_no, summary, full_text, "date"
            ) VALUES (
              :record_type, :title, :description, :publish_date, :is_active, CAST(:files AS jsonb),
              NULL, NULL, NULL, NULL, NULL, NULL, NULL,
              NULL, NULL, NULL, NULL, NULL
            )`,
            {
              replacements: {
                record_type: RT.REAL_ESTATE_LISTING,
                title: row.title,
                description: row.description,
                publish_date: row.publish_date,
                is_active: row.is_active !== false && row.is_active !== 0,
                files,
              },
              transaction: t,
            },
          );
        }
      }

      await queryInterface.dropTable("Public_Notices", { transaction: t }).catch(() => {});
      await sequelize.query('DROP TYPE IF EXISTS "enum_Public_Notices_status";', { transaction: t });

      await queryInterface.dropTable("Council_Decisions", { transaction: t }).catch(() => {});

      try {
        await queryInterface.removeConstraint("Tenders", "tenders_tender_number_unique", {
          transaction: t,
        });
      } catch {
        /* yoksa atla */
      }
      await queryInterface.dropTable("Tenders", { transaction: t }).catch(() => {});
      await queryInterface.dropTable("Real_Estate_Listings", { transaction: t }).catch(() => {});

      await sequelize.query(
        `CREATE UNIQUE INDEX publications_tender_number_uq ON "Publications" (tender_number) WHERE record_type = 'tender' AND tender_number IS NOT NULL`,
        { transaction: t },
      );

      await t.commit();
    } catch (e) {
      await t.rollback();
      throw e;
    }
  },

  async down() {
    throw new Error(
      "20260515190000-merge-announcements-into-publications geri alınamaz; birleştirme öncesi veritabanı yedeğine dönün.",
    );
  },
};
