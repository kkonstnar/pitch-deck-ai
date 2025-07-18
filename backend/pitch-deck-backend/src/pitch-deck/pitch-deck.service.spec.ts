import { Test, TestingModule } from '@nestjs/testing';
import { PitchDeckService } from './pitch-deck.service';

describe('PitchDeckService', () => {
  let service: PitchDeckService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PitchDeckService],
    }).compile();

    service = module.get<PitchDeckService>(PitchDeckService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
