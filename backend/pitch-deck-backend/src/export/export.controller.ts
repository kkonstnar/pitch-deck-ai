import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { ExportPptxDto } from './dto/export-pptx.dto';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Post('pptx')
  async exportToPptx(@Body() exportData: ExportPptxDto, @Res() res: Response) {
    try {
      const pptxBuffer = await this.exportService.generatePptx(exportData);
      
      const fileName = `${exportData.deckTitle.replace(/[^a-zA-Z0-9]/g, '_')}_pitch_deck.pptx`;
      
      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': pptxBuffer.length,
      });
      
      res.status(HttpStatus.OK).send(pptxBuffer);
    } catch (error) {
      console.error('PPTX export error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        error: 'Failed to generate PPTX file',
        message: error.message,
      });
    }
  }
}
