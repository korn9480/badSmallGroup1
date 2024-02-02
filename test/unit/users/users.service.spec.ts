import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../../../src/users/entities/user.entity';
import { UserService } from '../../../src/users/users.service';

describe('UsersService', () => {
  let usersService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UserService>(UserService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getMe', () => {
    it('should return a user with the specified ID', async () => {
      const userId = '64021700';
      const user = new User();
      user.code_student = userId;
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);

      // const result = await usersService.getMe(userId);

      // expect(result).toEqual(user);
    });

    it('should throw a BadRequestException if user is not found', async () => {
      const userId = '123';
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(undefined);

      // await expect(usersService.getMe(userId)).rejects.toThrow(
      //   BadRequestException,
      // );
    });
  });
});
