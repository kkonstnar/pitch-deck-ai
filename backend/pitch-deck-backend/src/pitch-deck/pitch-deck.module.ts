import { Module } from '@nestjs/common';
import { PitchDeckController } from './pitch-deck.controller';
import { PitchDeckService } from './pitch-deck.service';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  imports: [SupabaseModule],
  controllers: [PitchDeckController],
  providers: [PitchDeckService]
})
export class PitchDeckModule {}
