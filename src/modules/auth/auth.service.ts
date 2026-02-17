import jwt from 'jsonwebtoken';
import { AuthRepository } from './auth.repository';
import { User } from './user.entity';
import { BadRequestError, UnauthorizedError } from '../../shared/errors/AppError';
import { JWT_SECRET } from '../../config/environment';

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  async register(data: RegisterDTO): Promise<AuthResponse> {
    // Validar que el email no exista
    const existingUser = await this.authRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError('El email ya está registrado');
    }

    // Validar campos requeridos
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestError('Todos los campos son requeridos');
    }

    // Validar longitud de contraseña
    if (data.password.length < 6) {
      throw new BadRequestError('La contraseña debe tener al menos 6 caracteres');
    }

    // Crear usuario
    const user = await this.authRepository.create({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    // Generar token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async login(data: LoginDTO): Promise<AuthResponse> {
    // Validar campos requeridos
    if (!data.email || !data.password) {
      throw new BadRequestError('Email y contraseña son requeridos');
    }

    // Buscar usuario por email
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!user.isActive) {
      throw new UnauthorizedError('Usuario desactivado');
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Credenciales inválidas');
    }

    // Generar token
    const token = this.generateToken(user);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  private generateToken(user: User): string {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
  }
}
