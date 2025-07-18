import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PitchDeckService } from './pitch-deck.service';
import { CreatePitchDeckDto } from './dto/create-pitch-deck.dto';
import { UpdatePitchDeckDto } from './dto/update-pitch-deck.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

@Controller('pitch-deck')
export class PitchDeckController {
  constructor(private readonly pitchDeckService: PitchDeckService) {}

  @Post()
  create(@Body() createPitchDeckDto: CreatePitchDeckDto) {
    return this.pitchDeckService.create(createPitchDeckDto);
  }

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.pitchDeckService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pitchDeckService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePitchDeckDto: UpdatePitchDeckDto) {
    return this.pitchDeckService.update(id, updatePitchDeckDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pitchDeckService.remove(id);
  }

  @Post('generate-content')
  generateContent(@Body() generateContentDto: GenerateContentDto) {
    return this.pitchDeckService.generateContent(generateContentDto);
  }

  @Post('generate-outline')
  generateOutline(@Body() companyInfo: any) {
    return this.pitchDeckService.generateOutline(companyInfo);
  }
}
