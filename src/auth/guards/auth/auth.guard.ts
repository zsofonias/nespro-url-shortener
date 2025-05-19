import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  private API_KEY: string;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    this.API_KEY = this.configService.getOrThrow<string>('apiKey');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const userApiKey = request.headers['x-api-key'];

    if (userApiKey !== this.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
