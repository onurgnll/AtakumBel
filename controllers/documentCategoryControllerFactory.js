const fs = require("fs");
const path = require("path");
const { getPaginationParams, getPagingData } = require("../helpers/pagination");
const { Op } = require("sequelize");

const getUploadedFiles = (req) => {
  if (Array.isArray(req.files) && req.files.length > 0) return req.files;
  if (req.file) return [req.file];
  return [];
};

const toPublicAbsolutePath = (rawPath) => {
  if (!rawPath || typeof rawPath !== "string") return null;
  const normalized = rawPath.replace(/\\/g, "/");
  const relative = normalized.startsWith("/uploads/")
    ? `public${normalized}`
    : normalized.replace(/^\/+/, "");
  return path.resolve(process.cwd(), relative);
};

const deleteFileIfExists = (rawPath) => {
  const absPath = toPublicAbsolutePath(rawPath);
  if (absPath && fs.existsSync(absPath)) fs.unlinkSync(absPath);
};

const coerceBool = (v, defaultVal = true) => {
  if (v === undefined || v === null || v === "") return defaultVal;
  if (typeof v === "boolean") return v;
  const s = String(v).toLowerCase();
  if (s === "true" || s === "1") return true;
  if (s === "false" || s === "0") return false;
  return defaultVal;
};

const normalizeFiles = (existingFiles, uploadedFiles, bodyFiles) => {
  const hasBodyFiles = bodyFiles !== undefined && bodyFiles !== null;
  const files = hasBodyFiles ? [] : Array.isArray(existingFiles) ? [...existingFiles] : [];

  if (bodyFiles) {
    if (Array.isArray(bodyFiles)) {
      files.push(...bodyFiles);
    } else if (typeof bodyFiles === "string") {
      try {
        const parsed = JSON.parse(bodyFiles);
        if (Array.isArray(parsed)) files.push(...parsed);
        else files.push(bodyFiles);
      } catch {
        files.push(bodyFiles);
      }
    }
  }

  uploadedFiles.forEach((uploadedFile) => {
    files.push(uploadedFile.path.replace(/\\/g, "/").replace(/^.*?(\/uploads\/)/, "/uploads/"));
  });

  return files;
};

module.exports = function buildDocumentCategoryController(Model, labels, options = {}) {
  const { listMessage, createMessage, updateMessage, deleteMessage, notFoundMessage } =
    labels;
  const {
    foreignKey,
    foreignKeyRequired = false,
    include = [],
    publicActiveOnly = false,
  } = options;

  return {
    async getAll(req, res, next) {
      try {
        const { limit, offset } = getPaginationParams(req.query.page, req.query.per_page);
        const search = req.query.search ? req.query.search.trim() : null;
        const whereCondition = {};
        if (search) {
          whereCondition[Op.or] = [
            { title: { [Op.iLike]: `%${search}%` } },
            { description: { [Op.iLike]: `%${search}%` } },
          ];
        }
        if (foreignKey && req.query[foreignKey]) {
          whereCondition[foreignKey] = Number(req.query[foreignKey]);
        }
        if (publicActiveOnly && !req.admin) {
          whereCondition.is_active = true;
        }
        const { rows, count } = await Model.findAndCountAll({
          where: whereCondition,
          limit,
          offset,
          order: [["id", "DESC"]],
          include,
          distinct: include.length > 0,
        });
        return res.json({
          success: 1,
          data: { items: rows, pagination: getPagingData(count, req.query.page, limit) },
          message: listMessage,
        });
      } catch (err) {
        next(err);
      }
    },

    async create(req, res, next) {
      try {
        const { title, description, publish_date, is_active, files } = req.body;
        const foreignValue = foreignKey ? req.body[foreignKey] : undefined;
        if (!title) {
          return res
            .status(400)
            .json({ success: 0, data: null, message: "title zorunludur." });
        }
        if (foreignKeyRequired && (foreignValue === undefined || foreignValue === "")) {
          return res.status(400).json({
            success: 0,
            data: null,
            message: `${foreignKey} zorunludur.`,
          });
        }
        const uploadedFiles = getUploadedFiles(req);

        const item = await Model.create({
          title,
          description: description || null,
          publish_date: publish_date || null,
          is_active: coerceBool(is_active, true),
          files: normalizeFiles([], uploadedFiles, files),
          ...(foreignKey && foreignValue !== undefined && foreignValue !== ""
            ? { [foreignKey]: Number(foreignValue) }
            : {}),
        });

        return res.status(201).json({ success: 1, data: item, message: createMessage });
      } catch (err) {
        const uploadedFiles = getUploadedFiles(req);
        uploadedFiles.forEach((uploadedFile) => {
          if (uploadedFile && fs.existsSync(uploadedFile.path)) fs.unlinkSync(uploadedFile.path);
        });
        next(err);
      }
    },

    async update(req, res, next) {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) {
          const uploadedFiles = getUploadedFiles(req);
          uploadedFiles.forEach((uploadedFile) => {
            if (uploadedFile && fs.existsSync(uploadedFile.path)) fs.unlinkSync(uploadedFile.path);
          });
          return res
            .status(404)
            .json({ success: 0, data: null, message: notFoundMessage });
        }

        const { title, description, publish_date, is_active, files } = req.body;
        const foreignValue = foreignKey ? req.body[foreignKey] : undefined;
        const uploadedFiles = getUploadedFiles(req);

        const prevFiles = Array.isArray(item.files) ? item.files : [];
        const nextFiles = normalizeFiles(prevFiles, uploadedFiles, files);

        const patch = {
          title: title ?? item.title,
          description: description ?? item.description,
          publish_date: publish_date ?? item.publish_date,
          is_active:
            is_active !== undefined && is_active !== null && is_active !== ""
              ? coerceBool(is_active, item.is_active)
              : item.is_active,
          files: nextFiles,
        };
        if (foreignKey && foreignValue !== undefined && foreignValue !== "") {
          patch[foreignKey] = Number(foreignValue);
        }
        await item.update(patch);

        prevFiles
          .filter((existingPath) => !nextFiles.includes(existingPath))
          .forEach(deleteFileIfExists);

        return res.json({ success: 1, data: item, message: updateMessage });
      } catch (err) {
        const uploadedFiles = getUploadedFiles(req);
        uploadedFiles.forEach((uploadedFile) => {
          if (uploadedFile && fs.existsSync(uploadedFile.path)) fs.unlinkSync(uploadedFile.path);
        });
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const item = await Model.findByPk(req.params.id);
        if (!item) {
          return res
            .status(404)
            .json({ success: 0, data: null, message: notFoundMessage });
        }

        const filesToDelete = Array.isArray(item.files) ? item.files : [];
        await item.destroy();
        filesToDelete.forEach(deleteFileIfExists);

        return res.json({ success: 1, data: null, message: deleteMessage });
      } catch (err) {
        next(err);
      }
    },
  };
};


