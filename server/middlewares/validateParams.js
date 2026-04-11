

export const validateParams = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.format()
    });
  }

  req.validatedParams = result.data;
  next();
};