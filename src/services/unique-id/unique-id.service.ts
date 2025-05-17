import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { IGenerateOptions } from './interfaces/generate-options.interface';

@Injectable()
export class UniqueIdService {
  generate(options: IGenerateOptions) {
    return nanoid(options.size);
  }
}
