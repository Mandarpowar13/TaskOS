export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({ body: req.body || {}, query: req.query || {}, params: req.params || {} })
    if (!result.success) return next(result.error)
    req.validated = result.data
    return next()
  }
}
