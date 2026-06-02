const {
  News,
  Event,
  President,
  PressRelease,
  Service,
  Publication,
  PressMaterial,
  Directive,
  Facility,
  InstitutionHistory,
  DepartmentDocument,
  VicePresident,
  Department,
  CouncilMember,
  Employee,
  StrategicPlan,
  PerformanceProgram,
  ActivityReport,
  AuditReport,
  FinancialExpectationReport,
  KvkkDocument,
  WorkplaceLicense,
  GatheringArea,
  ServiceForm,
} = require("../models");
const { Op } = require("sequelize");

function clampInt(value, { min, max, fallback }) {
  const n = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function normalizeQuery(q) {
  const s = String(q ?? "").trim();
  return s.length ? s : null;
}

function buildILikeOr(fields, q) {
  return fields.map((field) => ({ [field]: { [Op.iLike]: `%${q}%` } }));
}

function applyIsActiveFilter(where, isAdmin) {
  if (isAdmin) return where;
  if (where && typeof where === "object") {
    return { ...where, is_active: true };
  }
  return { is_active: true };
}

exports.searchAll = async (req, res, next) => {
  try {
    const q = normalizeQuery(req.query.q);
    if (!q) {
      return res.status(400).json({
        success: 0,
        data: null,
        message: "Arama için `q` parametresi zorunludur.",
      });
    }

    const limit = clampInt(req.query.limit, { min: 1, max: 20, fallback: 8 });
    const isAdmin = req.query.admin === "true";

    const queries = [
      {
        kind: "news",
        model: News,
        activeFilter: true,
        fields: ["title", "spot", "content"],
        attributes: ["id", "title", "spot", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        subtitleField: "spot",
        dateField: "publish_date",
      },
      {
        kind: "event",
        model: Event,
        activeFilter: false,
        fields: ["title", "description", "address"],
        attributes: ["id", "title", "type", "start_date", "end_date", "event_time", "address"],
        order: [["start_date", "DESC"]],
        subtitleField: "address",
        dateField: "start_date",
      },
      {
        kind: "president",
        model: President,
        activeFilter: false,
        fields: ["first_name", "last_name", "biography", "message"],
        attributes: ["id", "first_name", "last_name"],
        order: [["id", "DESC"]],
        subtitleStatic: "Başkan",
      },
      {
        kind: "press_release",
        model: PressRelease,
        activeFilter: true,
        fields: ["title", "spot", "content"],
        attributes: ["id", "title", "spot", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        subtitleField: "spot",
        dateField: "publish_date",
      },
      {
        kind: "press_material",
        model: PressMaterial,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "description", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        subtitleField: "description",
        dateField: "publish_date",
      },
      {
        kind: "service",
        model: Service,
        activeFilter: false,
        fields: ["name", "content"],
        attributes: ["id", "name"],
        order: [["id", "DESC"]],
        titleField: "name",
        subtitleStatic: "Hizmet",
      },
      {
        kind: "service_form",
        model: ServiceForm,
        activeFilter: false,
        fields: ["form_name", "file_path"],
        attributes: ["id", "service_id", "form_name", "file_path"],
        order: [["id", "DESC"]],
        titleField: "form_name",
        subtitleField: "file_path",
      },
      {
        kind: "publication",
        model: Publication,
        activeFilter: true,
        fields: ["title", "description", "content", "summary", "full_text", "tender_number", "decision_no"],
        attributes: ["id", "record_type", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        subtitleField: "record_type",
        dateField: "publish_date",
      },
      {
        kind: "directive",
        model: Directive,
        activeFilter: false,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "facility",
        model: Facility,
        activeFilter: false,
        fields: ["name", "address", "description"],
        attributes: ["id", "name", "address"],
        order: [["id", "DESC"]],
        titleField: "name",
        subtitleField: "address",
      },
      {
        kind: "department",
        model: Department,
        activeFilter: false,
        fields: ["name", "description", "address"],
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
        titleField: "name",
        subtitleStatic: "Müdürlük",
      },
      {
        kind: "department_document",
        model: DepartmentDocument,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "department_id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "strategic_plan",
        model: StrategicPlan,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "performance_program",
        model: PerformanceProgram,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "activity_report",
        model: ActivityReport,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "audit_report",
        model: AuditReport,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "financial_expectation_report",
        model: FinancialExpectationReport,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "kvkk_document",
        model: KvkkDocument,
        activeFilter: true,
        fields: ["title", "description"],
        attributes: ["id", "title", "publish_date", "is_active"],
        order: [["publish_date", "DESC"]],
        dateField: "publish_date",
      },
      {
        kind: "workplace_license",
        model: WorkplaceLicense,
        activeFilter: false,
        fields: ["content"],
        attributes: ["id"],
        order: [["id", "DESC"]],
        titleStatic: "İşyeri Ruhsatı",
      },
      {
        kind: "institution_history",
        model: InstitutionHistory,
        activeFilter: false,
        fields: ["content"],
        attributes: ["id"],
        order: [["id", "DESC"]],
        titleStatic: "Kurum Tarihçesi",
      },
      {
        kind: "vice_president",
        model: VicePresident,
        activeFilter: false,
        fields: ["first_name", "last_name", "biography"],
        attributes: ["id", "first_name", "last_name", "order"],
        order: [["order", "ASC"]],
        subtitleStatic: "Başkan Yardımcısı",
      },
      {
        kind: "council_member",
        model: CouncilMember,
        activeFilter: false,
        fields: ["first_name", "last_name", "political_party"],
        attributes: ["id", "first_name", "last_name", "political_party", "order"],
        order: [["order", "ASC"]],
        subtitleField: "political_party",
      },
      {
        kind: "employee",
        model: Employee,
        activeFilter: true,
        fields: ["first_name", "last_name", "title", "dahili_no"],
        attributes: ["id", "first_name", "last_name", "title", "dahili_no", "department_id", "is_active"],
        order: [["id", "ASC"]],
        subtitleField: "title",
      },
      {
        kind: "gathering_area",
        model: GatheringArea,
        activeFilter: false,
        fields: ["name"],
        attributes: ["id", "name"],
        order: [["id", "ASC"]],
      },
    ];

    const resultsEntries = await Promise.all(
      queries.map(async (cfg) => {
        let where = { [Op.or]: buildILikeOr(cfg.fields, q) };
        if (cfg.activeFilter) where = applyIsActiveFilter(where, isAdmin);

        const rows = await cfg.model.findAll({
          where,
          attributes: cfg.attributes,
          order: cfg.order,
          limit,
        });
        return [cfg.kind, rows];
      }),
    );

    const results = Object.fromEntries(resultsEntries);

    const suggestions = queries.flatMap((cfg) => {
      const rows = results[cfg.kind] ?? [];
      return rows.map((row) => {
        const raw = row?.get ? row.get({ plain: true }) : row;
        const title =
          cfg.titleStatic ??
          (cfg.titleField ? raw?.[cfg.titleField] : raw?.title) ??
          (raw?.first_name || raw?.last_name
            ? [raw?.first_name, raw?.last_name].filter(Boolean).join(" ")
            : undefined) ??
          String(raw?.id ?? "");
        const subtitle =
          cfg.subtitleStatic ?? (cfg.subtitleField ? raw?.[cfg.subtitleField] : undefined);
        const date = cfg.dateField ? raw?.[cfg.dateField] : undefined;
        return {
          kind: cfg.kind,
          id: raw?.id,
          title,
          subtitle,
          date,
        };
      });
    });

    return res.json({
      success: 1,
      data: {
        query: q,
        results,
        suggestions,
      },
      message: "Arama sonuçları getirildi.",
    });
  } catch (err) {
    next(err);
  }
};

