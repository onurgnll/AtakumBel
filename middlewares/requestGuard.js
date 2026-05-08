const isPositiveInteger = (value) => /^\d+$/.test(value) && Number(value) > 0;

const requestGuard = (req, res, next) => {
  const method = req.method.toUpperCase();
  const contentType = req.headers["content-type"] || "";
  const isMultipart = contentType.includes("multipart/form-data");

  if (["POST", "PUT", "PATCH"].includes(method) && !isMultipart) {
    const body = req.body;
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return res.status(400).json({
        success: 0,
        message: "Geçerli bir request body gönderilmelidir.",
      });
    }

    const hasAnyValue = Object.values(body).some(
      (item) => item !== null && item !== undefined && String(item).trim() !== "",
    );
    if (!hasAnyValue) {
      return res.status(400).json({
        success: 0,
        message: "Request body en az bir dolu alan içermelidir.",
      });
    }
  }

  if (["PUT", "DELETE"].includes(method)) {
    const segments = req.path.split("/").filter(Boolean);
    const possibleId = segments[segments.length - 1];
    if (!possibleId || !isPositiveInteger(possibleId)) {
      return res.status(400).json({
        success: 0,
        message: "İşlem için geçerli bir id parametresi gereklidir.",
      });
    }
  }

  if (method === "GET") {
    const { page, per_page } = req.query || {};
    if (page !== undefined && (!isPositiveInteger(String(page)) || Number(page) < 1)) {
      return res.status(400).json({
        success: 0,
        message: "page değeri 1 veya daha büyük bir sayı olmalıdır.",
      });
    }
    if (
      per_page !== undefined &&
      (!isPositiveInteger(String(per_page)) || Number(per_page) < 1 || Number(per_page) > 500)
    ) {
      return res.status(400).json({
        success: 0,
        message: "per_page değeri 1-100 aralığında olmalıdır.",
      });
    }
  }

  return next();
};

module.exports = requestGuard;
