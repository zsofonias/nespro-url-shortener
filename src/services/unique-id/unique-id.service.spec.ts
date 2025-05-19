import { Test, TestingModule } from '@nestjs/testing';
import { UniqueIdService } from './unique-id.service';

describe('UniqueIdService', () => {
  let service: UniqueIdService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UniqueIdService],
    }).compile();

    service = module.get<UniqueIdService>(UniqueIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a unique id with specified length', async () => {
      const options = { size: 5 };
      const id = service.generate(options);
      expect(id).toBeDefined();
      expect(typeof id).toBe('string');
      expect(id.length).toBe(options.size);
    });
  });
});
