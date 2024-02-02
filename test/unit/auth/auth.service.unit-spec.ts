import { Test } from '@nestjs/testing';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { BadRequestException, ConflictException } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { getRepositoryToken } from '@nestjs/typeorm';

import { AuthService } from '../../../src/auth/auth.service';
import { BcryptService } from '../../../src/auth/bcrypt.service';
import { RedisService } from '../../../src/redis/redis.service';
import jwtConfig from '../../../src/common/config/jwt.config';
import { User } from '../../../src/users/entities/user.entity';
import { SignUpDto } from '../../../src/auth/dto/sign-up.dto';
import { MysqlErrorCode } from '../../../src/common/enums/error-codes.enum';
import { ActiveUserData } from '../../../src/common/interfaces/active-user-data.interface';
import { Role } from '../../../src/users/entities/role.entity';
import { SignInDto } from 'src/auth/dto/sign-in.dto';

describe('AuthService', () => {
  let authService: AuthService;
  let bcryptService: BcryptService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let redisService: RedisService;
  let jwtConfiguration: ConfigType<typeof jwtConfig>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: BcryptService, useValue: createMock<BcryptService>() },
        { provide: JwtService, useValue: createMock<JwtService>() },
        { provide: RedisService, useValue: createMock<RedisService>() },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        { provide: getRepositoryToken(Role), useClass: Repository },
        {
          provide: jwtConfig.KEY,
          useValue: jwtConfig.asProvider(),
        },
      ],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    bcryptService = moduleRef.get<BcryptService>(BcryptService);
    jwtService = moduleRef.get<JwtService>(JwtService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
    redisService = moduleRef.get<RedisService>(RedisService);
    jwtConfiguration = moduleRef.get<ConfigType<typeof jwtConfig>>(
      jwtConfig.KEY,
    );
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
    let user: User;

    beforeEach(() => {
      user = new User();
      user.code_student = signUpDto.code_student;
      user.password = 'hashed_password';
      user.blood_group = signUpDto.blood_group;
      user.faculty = signUpDto.faculty;
      user.major = signUpDto.major;
      user.first_name = signUpDto.first_name;
      user.last_name = signUpDto.last_name;
      user.nick_name = signUpDto.nick_name;
      user.prefix = signUpDto.prefix;
      user.profile = signUpDto.profile;
      user.phone = signUpDto.phone;
      user.roleId = signUpDto.roleId;
    });

    it('should create a new user', async () => {
      const oneSpy = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValue(undefined);
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(user);
      const hashSpy = jest
        .spyOn(bcryptService, 'hash')
        .mockResolvedValueOnce('Tub@0885591425');

      await authService.signUp(signUpDto);
      expect(hashSpy).toHaveBeenCalledWith(signUpDto.password);
      expect(saveSpy).toHaveBeenCalledWith(signUpDto);
    });

    it('should throw a ConflictException if a user with the same code_student already exists', async () => {
      const one = jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(user);
      const saveSpy = jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce({ code: MysqlErrorCode.UniqueViolation });

      await expect(authService.signUp(signUpDto)).rejects.toThrowError(
        new ConflictException(`User [${signUpDto.code_student}] already exist`),
      );
      expect(one).toHaveBeenCalledWith({
        where: { code_student: signUpDto.code_student },
      });
    });
  });

  describe('signIn', () => {
    let signInDto;
    beforeEach(() => {
      signInDto = {
        code_student: 'johndoe@example.com',
        password: 'password',
      };
    });
    it('should sign in a user and return an access token', async () => {
      const user = new User();
      user.code_student = '64021700';
      user.code_student = signInDto.code_student;
      user.password = 'encryptedPassword';
      user.profile = undefined;
      user.prefix = 'นาย';

      const encryptedPassword = 'encryptedPassword';
      const comparedPassword = true;
      const tokenId = expect.any(String);

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcryptService, 'compare').mockResolvedValue(comparedPassword);
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockResolvedValue('accessToken');

      const result = await authService.signIn(signInDto);

      expect(result).toEqual({
        accessToken: 'accessToken',
        code_student: 'johndoe@example.com',
        prefix: 'นาย',
        profile: undefined,
      });
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { code_student: signInDto.code_student },
      });
      expect(bcryptService.compare).toHaveBeenCalledWith(
        signInDto.password,
        encryptedPassword,
      );
    });

    it('should throw an error when code_student is invalid', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { code_student: signInDto.code_student },
      });
    });

    it('should throw an error when password is invalid', async () => {
      // const signInDto = {
      //   code_student: 'johndoe@example.com',
      //   password: 'password',
      // };
      signInDto.password = 'password';

      const user = new User();
      user.code_student = '64021700';
      user.code_student = signInDto.code_student;
      user.password = 'encryptedPassword';

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
      jest.spyOn(bcryptService, 'compare').mockResolvedValue(false);

      await expect(authService.signIn(signInDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { code_student: signInDto.code_student },
      });
      expect(bcryptService.compare).toHaveBeenCalledWith(
        signInDto.password,
        user.password,
      );
    });
  });

  describe('signOut', () => {
    it('should delete user token from Redis', async () => {
      const userId = 'test-user-id';
      const deleteSpy = jest
        .spyOn(redisService, 'delete')
        .mockResolvedValue(undefined);

      await authService.signOut(userId);

      expect(deleteSpy).toHaveBeenCalledWith(`user-${userId}`);
    });
  });

  // describe('generateAccessToken', () => {
  //   it('should insert a token into Redis and return an access token', async () => {
  //     const user = { id: '123', code_student: 'test@example.com' };
  //     const tokenId = expect.any(String);
  //     const accessToken = 'test-access-token';
  //     (redisService.insert as any).mockResolvedValueOnce(undefined);
  //     (jwtService.signAsync as any).mockResolvedValueOnce(accessToken);

  //     const result = await authService.generateAccessToken(user);

  //     expect(redisService.insert).toHaveBeenCalledWith(
  //       `user-${user.id}`,
  //       tokenId,
  //     );
  //     expect(jwtService.signAsync).toHaveBeenCalledWith(
  //       { code_student: user.code_student, tokenId } as ActiveUserData,
  //       {
  //         secret: jwtConfiguration.secret,
  //         expiresIn: jwtConfiguration.accessTokenTtl,
  //       },
  //     );
  //     expect(result).toEqual({ accessToken });
  //   });
  // });
});
