const express = require("express");
const router = express.Router();
const serviceFormController = require("../controllers/ServiceFormController");
const upload = require("../middlewares/upload");

router.get("/:serviceId", serviceFormController.getFormsByServiceId);
router.post(
  "/:serviceId",
  upload.fields([{ name: "forms" }]),
  serviceFormController.addFormsToService,
);
router.put(
  "/:id",
  upload.fields([{ name: "forms" }]),
  serviceFormController.updateForm,
);

router.delete("/:id", serviceFormController.deleteForm);

module.exports = router;
