import createErrors from "http-errors";

const notFoundHandler = (req, res, next) => {
  next(createErrors(404, "Route not found"));
};

export default notFoundHandler;
