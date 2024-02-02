import { Test, TestingModule } from '@nestjs/testing';
import { describe } from 'node:test';
import { AllergyService } from '../../../src/allergy/allergy.service';
import { AuthController } from '../../../src/auth/auth.controller';
import { AuthService } from '../../../src/auth/auth.service';
import { SignUpDto } from '../.././../src/auth/dto/sign-up.dto';
import { BcryptService } from '../../../src/auth/bcrypt.service';
import { RedisService } from '../../../src/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../../src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Role } from '../../../src/users/entities/role.entity';
import { Allergy } from '../../../src/allergy/entities/allergy.entity';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;
  let allergyService: AllergyService;

  const mockJwtConfig = {
    // Mock your JWT configuration here
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        AuthService,
        AllergyService,
        BcryptService,
        JwtService,
        RedisService,
        {
          provide: 'CONFIGURATION(jwt)',
          useValue: mockJwtConfig,
        },
        { provide: getRepositoryToken(User), useClass: Repository },
        { provide: getRepositoryToken(Role), useClass: Repository },
        { provide: getRepositoryToken(Allergy), useClass: Repository },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    allergyService = module.get<AllergyService>(AllergyService);
  });

  describe('signUp', () => {
    const signUpDto: SignUpDto = {
      code_student: '64021703',
      password: 'Tub@0885591425',
      confirm_password: 'Tub@0885591425',
      first_name: 'นายทินกร',
      last_name: 'เเซ่เล้า',
      nick_name: 'กร',
      faculty: 'เทคโนโลยีสารสนเทศ',
      major: 'วิศวกรรมซอฟต์เเวร์',
      phone: '0885591425',
      religion: 'พุทธ',
      blood_group: '+ab',
      prefix: '',
      profile: '',
      allergics: [
        {
          code_student: { code_student: '64021700' },
          allergy: 'แป้ง',
        },
      ],
      roleId: { id: 1 },
    };
    it('should call signUp in AuthService and create in AllergyService ok', async () => {
      // Arrange
      jest.spyOn(authService, 'signUp').mockImplementation(async () => {});
      // Act
      await controller.signUp(signUpDto);
      // Assert
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
    it('should call signUp user code already exist', async () => {
      // Arrange
      jest.spyOn(authService, 'signUp').mockImplementation(async () => {});
      // Act
      await controller.signUp(signUpDto);
      // Assert
      expect(authService.signUp).toHaveBeenCalledWith(signUpDto);
    });
  });
});
