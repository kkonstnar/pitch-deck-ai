import { PartialType } from '@nestjs/mapped-types';
import { CreatePitchDeckDto } from './create-pitch-deck.dto';

export class UpdatePitchDeckDto extends PartialType(CreatePitchDeckDto) {}