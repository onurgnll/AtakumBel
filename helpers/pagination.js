const getPaginationParams = (page, per_page) => {
  const parsedLimit = per_page ? Number.parseInt(per_page, 10) : 20;
  const parsedPage = page ? Number.parseInt(page, 10) : 1;
  const limit = Number.isNaN(parsedLimit)
    ? 20
    : Math.max(1, Math.min(parsedLimit, 500));
  const safePage = Number.isNaN(parsedPage) ? 1 : Math.max(1, parsedPage);
  const offset = (safePage - 1) * limit;

  return { limit, offset };
};

const getPagingData = (count, page, limit) => {
  return {
    total_items: count,
    total_pages: Math.ceil(count / limit),
    current_page: parseInt(page || 1),
    per_page: parseInt(limit),
  };
};

module.exports = { getPaginationParams, getPagingData };
