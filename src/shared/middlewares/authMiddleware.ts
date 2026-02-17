import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../../config/environment';
import { UnauthorizedError } from '../errors/AppError';

interface JwtPayload {
  id: number;
  email: string;
}

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
      };
    }
  }
}

export const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError('Token no proporcionado');
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new UnauthorizedError('Formato de token inválido');
    }

    const token = parts[1];

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      next();
    } catch (err) {
      throw new UnauthorizedError('Token inválido o expirado');
    }
  } catch (error) {
    next(error);
  }
};
