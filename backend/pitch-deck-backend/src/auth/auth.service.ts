import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(private supabaseService: SupabaseService) {}

  async signUp(signUpDto: SignUpDto) {
    const { email, password } = signUpDto;
    const result = await this.supabaseService.signUp(email, password);
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return {
      user: result.data.user,
      session: result.data.session,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const result = await this.supabaseService.signIn(email, password);
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return {
      user: result.data.user,
      session: result.data.session,
    };
  }

  async signOut() {
    const result = await this.supabaseService.signOut();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return { message: 'Successfully signed out' };
  }

  async getUser() {
    const result = await this.supabaseService.getUser();
    
    if (result.error) {
      throw new Error(result.error.message);
    }
    
    return result.data.user;
  }
}
