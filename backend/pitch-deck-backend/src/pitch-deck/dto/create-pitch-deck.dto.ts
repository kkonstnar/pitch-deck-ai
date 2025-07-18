export class CreatePitchDeckDto {
  title: string;
  description: string;
  companyName: string;
  industry: string;
  targetAudience: string;
  fundingGoal?: number;
  userId: string;
}