import { AuthService } from '../auth.service';
import { AuthRepository } from '../auth.repository';
import { User } from '../user.entity';
import { BadRequestError, UnauthorizedError } from '../../../shared/errors/AppError';
import jwt from 'jsonwebtoken';

// Mock del repositorio
jest.mock('../auth.repository');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockAuthRepository: jest.Mocked<AuthRepository>;

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Crear instancia del servicio
    authService = new AuthService();
    
    // Obtener el mock del repositorio
    mockAuthRepository = (authService as any).authRepository;
  });

  describe('register', () => {
    const registerData = {
      name: 'Juan Pérez',
      email: 'juan@example.com',
      password: 'password123',
    };

    it('debe registrar un nuevo usuario exitosamente', async () => {
      // Arrange - Preparar el escenario
      const mockUser = {
        id: 1,
        name: registerData.name,
        email: registerData.email,
        password: 'hashedPassword',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as User;

      mockAuthRepository.findByEmail.mockResolvedValue(null);
      mockAuthRepository.create.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      // Act - Ejecutar la acción
      const result = await authService.register(registerData);

      // Assert - Verificar resultados
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(registerData.email);
      expect(mockAuthRepository.create).toHaveBeenCalledWith({
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      expect(result).toEqual({
        token: 'fake-jwt-token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('debe lanzar error si el email ya existe', async () => {
      // Arrange
      const existingUser = { id: 1, email: registerData.email } as User;
      mockAuthRepository.findByEmail.mockResolvedValue(existingUser);

      // Act & Assert
      await expect(authService.register(registerData)).rejects.toThrow(
        new BadRequestError('El email ya está registrado')
      );
      expect(mockAuthRepository.create).not.toHaveBeenCalled();
    });

    it('debe lanzar error si faltan campos requeridos', async () => {
      // Arrange
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert - Probar sin nombre
      await expect(
        authService.register({ ...registerData, name: '' })
      ).rejects.toThrow(new BadRequestError('Todos los campos son requeridos'));

      // Probar sin email
      await expect(
        authService.register({ ...registerData, email: '' })
      ).rejects.toThrow(new BadRequestError('Todos los campos son requeridos'));

      // Probar sin password
      await expect(
        authService.register({ ...registerData, password: '' })
      ).rejects.toThrow(new BadRequestError('Todos los campos son requeridos'));
    });

    it('debe lanzar error si la contraseña es muy corta', async () => {
      // Arrange
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(
        authService.register({ ...registerData, password: '12345' })
      ).rejects.toThrow(
        new BadRequestError('La contraseña debe tener al menos 6 caracteres')
      );
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'juan@example.com',
      password: 'password123',
    };

    it('debe iniciar sesión exitosamente con credenciales válidas', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        name: 'Juan Pérez',
        email: loginData.email,
        password: 'hashedPassword',
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(true),
      } as any;

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);
      (jwt.sign as jest.Mock).mockReturnValue('fake-jwt-token');

      // Act
      const result = await authService.login(loginData);

      // Assert
      expect(mockAuthRepository.findByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
      expect(result).toEqual({
        token: 'fake-jwt-token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });
    });

    it('debe lanzar error si faltan campos requeridos', async () => {
      // Act & Assert - Sin email
      await expect(
        authService.login({ ...loginData, email: '' })
      ).rejects.toThrow(new BadRequestError('Email y contraseña son requeridos'));

      // Sin password
      await expect(
        authService.login({ ...loginData, password: '' })
      ).rejects.toThrow(new BadRequestError('Email y contraseña son requeridos'));
    });

    it('debe lanzar error si el usuario no existe', async () => {
      // Arrange
      mockAuthRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        new UnauthorizedError('Credenciales inválidas')
      );
    });

    it('debe lanzar error si el usuario está desactivado', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: loginData.email,
        isActive: false,
      } as User;

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        new UnauthorizedError('Usuario desactivado')
      );
    });

    it('debe lanzar error si la contraseña es incorrecta', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: loginData.email,
        isActive: true,
        comparePassword: jest.fn().mockResolvedValue(false),
      } as any;

      mockAuthRepository.findByEmail.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(authService.login(loginData)).rejects.toThrow(
        new UnauthorizedError('Credenciales inválidas')
      );
      expect(mockUser.comparePassword).toHaveBeenCalledWith(loginData.password);
    });
  });
});
