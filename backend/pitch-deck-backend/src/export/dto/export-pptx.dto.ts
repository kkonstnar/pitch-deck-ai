export class ExportPptxDto {
  deckTitle: string;
  deckDescription?: string;
  slides: SlideDto[];
}

export class SlideDto {
  id: string;
  type: string;
  title: string;
  content: string;
  suggestedImages?: string[];
  speakerNotes?: string;
  mediaUrls?: string[];
  mediaDescriptions?: string[];
}