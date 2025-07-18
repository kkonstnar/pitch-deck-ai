export class GenerateContentDto {
  slideType: string;
  context: string;
  companyInfo: {
    name: string;
    industry: string;
    description: string;
  };
  additionalPrompt?: string;
}