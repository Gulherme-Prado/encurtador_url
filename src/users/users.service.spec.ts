import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let repo: Repository<User>;

  const mockRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a user by email', async () => {
    const mockUser = { id: '1', email: 'test@email.com', password: 'hashed' };
    mockRepo.findOneBy.mockResolvedValue(mockUser);

    const result = await service.findByEmail('test@email.com');

    expect(result).toEqual(mockUser);
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({
      email: 'test@email.com',
    });
  });
});
