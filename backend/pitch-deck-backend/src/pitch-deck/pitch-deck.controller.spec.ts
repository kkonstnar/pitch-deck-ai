import { Test, TestingModule } from '@nestjs/testing';
import { PitchDeckController } from './pitch-deck.controller';

describe('PitchDeckController', () => {
  let controller: PitchDeckController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PitchDeckController],
    }).compile();

    controller = module.get<PitchDeckController>(PitchDeckController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
