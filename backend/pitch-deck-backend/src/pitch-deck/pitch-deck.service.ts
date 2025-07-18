import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseService } from '../supabase/supabase.service';
import { OpenAI } from 'openai';
import { CreatePitchDeckDto } from './dto/create-pitch-deck.dto';
import { UpdatePitchDeckDto } from './dto/update-pitch-deck.dto';
import { GenerateContentDto } from './dto/generate-content.dto';

@Injectable()
export class PitchDeckService {
  private openai: OpenAI;

  constructor(
    private configService: ConfigService,
    private supabaseService: SupabaseService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async create(createPitchDeckDto: CreatePitchDeckDto) {
    const { data, error } = await this.supabaseService.client
      .from('pitch_decks')
      .insert([createPitchDeckDto])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async findAll(userId: string) {
    const { data, error } = await this.supabaseService.client
      .from('pitch_decks')
      .select('*')
      .eq('userId', userId);

    if (error) throw error;
    return data;
  }

  async findOne(id: string) {
    const { data, error } = await this.supabaseService.client
      .from('pitch_decks')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async update(id: string, updatePitchDeckDto: UpdatePitchDeckDto) {
    const { data, error } = await this.supabaseService.client
      .from('pitch_decks')
      .update(updatePitchDeckDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async remove(id: string) {
    const { error } = await this.supabaseService.client
      .from('pitch_decks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Pitch deck deleted successfully' };
  }

  async generateContent(generateContentDto: GenerateContentDto) {
    const { slideType, context, companyInfo, additionalPrompt } = generateContentDto;

    const prompt = `
      Generate content for a ${slideType} slide for a pitch deck.
      
      Company Information:
      - Name: ${companyInfo.name}
      - Industry: ${companyInfo.industry}
      - Description: ${companyInfo.description}
      
      Context: ${context}
      
      ${additionalPrompt ? `Additional requirements: ${additionalPrompt}` : ''}
      
      Please provide structured content that would be appropriate for this slide type.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert pitch deck consultant. Generate professional, compelling content for pitch deck slides.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    return {
      content: completion.choices[0].message.content,
      slideType,
      companyInfo,
    };
  }

  async generateOutline(companyInfo: any) {
    const prompt = `
      Generate a comprehensive pitch deck outline for the following company:
      
      Company: ${companyInfo.name}
      Industry: ${companyInfo.industry}
      Description: ${companyInfo.description}
      Target Audience: ${companyInfo.targetAudience}
      ${companyInfo.fundingGoal ? `Funding Goal: $${companyInfo.fundingGoal}` : ''}
      
      Please provide a structured outline with slide titles and brief descriptions of what each slide should contain.
    `;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert pitch deck consultant. Create comprehensive, investor-ready pitch deck outlines.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    return {
      outline: completion.choices[0].message.content,
      companyInfo,
    };
  }
}
