const calculatePaginationData = (totalItems, page, perPage) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasNextPage = page > 1;
  const hasPreviousPage = page < totalPages;

  return {
    page: Number(page),
    perPage: Number(perPage),
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export default calculatePaginationData;
