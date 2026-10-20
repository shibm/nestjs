import { BadRequestException } from '@nestjs/common';
import { ParseObjectIdPipe } from './parse-object-id.pipe.js';

describe('ParseObjectIdPipe', () => {
  let pipe: ParseObjectIdPipe;

  beforeEach(() => {
    pipe = new ParseObjectIdPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('should return the valid 24-character hex ObjectId unchanged', () => {
    const validId = '507f1f77bcf86cd799439011';
    expect(pipe.transform(validId, { type: 'param' })).toBe(validId);
  });

  it('should throw BadRequestException when given an invalid ID string', () => {
    expect(() => pipe.transform('invalid-id', { type: 'param' })).toThrow(
      BadRequestException,
    );
  });

  it('should throw BadRequestException when given a short string', () => {
    expect(() => pipe.transform('123', { type: 'param' })).toThrow(
      BadRequestException,
    );
  });
});

