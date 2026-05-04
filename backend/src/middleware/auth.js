import jwt from 'jsonwebtoken';

export function auth(requiredRole = null) {
  return (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token requerido' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (requiredRole && decoded.role !== requiredRole) {
        return res.status(403).json({ message: 'Acceso denegado' });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(401).json({ message: 'Token inválido' });
    }
  };
}
