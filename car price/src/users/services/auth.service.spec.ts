import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../user.entity';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';

// writes the name in test
describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  let users: User[] = [];

  // before running each test
  beforeEach(async () => {
    // only defining methods used in auth service
    // partial to not implement every method
    fakeUserService = {
      create: (email: string, password: string) => {
          const user: User = { id: Math.floor(Math.random()*99999), email, password } as User;
          users.push(user);
          return Promise.resolve(user);
      },
      find: (email: string) => {
        const filteredUsers: User[] = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async () => {
    // returning a user as email already exists
    // fakeUserService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'abc@abc.com', password: '1234' } as User,
    //   ]);

    // first signing up then trying to sign up again
    const user = await service.signup('abc@abc.com', 'asdf');

      // expecting our class to throw Bad Request exception
    await expect(service.signup('abc@abc.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );

  });

  it('throws an error if user signs in with email that does not exists', async () => {
    // returning a user as email already exists
    // fakeUserService.find = () => Promise.resolve([]);

      // expecting our class to throw Not found exception
    await expect(service.signin('abc2@abc.com', 'asdf')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('throws an error if user enters wrong password', async () => {
    await service.signup('abcd@abcd.com', '1234');

    await expect(service.signin('abcd@abcd.com', 'abcd')).rejects.toThrow(
        UnauthorizedException
    );
  });

  it('return user enters correct password', async () => {
    // await service.signup('abcd@abcd.com', '1234');

    const user: User = await service.signin('abcd@abcd.com', '1234');

    expect(user).toBeDefined();
  });

});
