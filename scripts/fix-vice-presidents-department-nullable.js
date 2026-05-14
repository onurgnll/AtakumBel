/**
 * Tek seferlik: Vice_Presidents.department_id üzerindeki NOT NULL kısıtını kaldırır.
 * Çoklu müdürlük Vice_President_Departments tablosunda; legacy sütun NULL olmalı.
 *
 * Kullanım (AtakumBel kökünden): node scripts/fix-vice-presidents-department-nullable.js
 */
require("dotenv").config();
const { sequelize } = require("../models");

async function main() {
  await sequelize.authenticate();
  // PostgreSQL: zaten nullable ise hata vermez
  await sequelize.query(
    'ALTER TABLE "Vice_Presidents" ALTER COLUMN "department_id" DROP NOT NULL;',
  );
  console.log(
    'Tamam: "Vice_Presidents"."department_id" artık NULL kabul ediyor.',
  );
  await sequelize.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
