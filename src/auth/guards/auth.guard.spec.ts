import { ConfigService } from '@nestjs/config';
import { AuthGuard } from './auth.guard';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let configService: DeepMocked<ConfigService>;

  beforeEach(() => {
    configService = createMock<ConfigService>();
    configService.getOrThrow.mockReturnValue('valid-api-key');
    authGuard = new AuthGuard(configService);
    authGuard.onModuleInit();
  });

  it('should be defined', () => {
    expect(authGuard).toBeDefined();
  });

  // happy path
  it('should return true if the API_KEY is valid', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            ['x-api-key']: 'valid-api-key',
          },
        }),
      }),
    });

    expect(authGuard.canActivate(mockedExecutionContext)).toBe(true);
  });

  // unhappy path no api key
  it('should return unauthorized exception if the API_KEY is not present', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    });

    expect(() => authGuard.canActivate(mockedExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });

  // unhappy path invalid api key
  it('should return unauthorized exception if the API_KEY is invalid', () => {
    const mockedExecutionContext = createMock<ExecutionContext>({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            ['x-api-key']: 'invalid-api-key',
          },
        }),
      }),
    });
    expect(() => authGuard.canActivate(mockedExecutionContext)).toThrow(
      UnauthorizedException,
    );
  });
});
