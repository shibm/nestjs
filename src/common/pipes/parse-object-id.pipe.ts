import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

/**
 * Custom pipe that validates incoming route parameters (e.g., :id)
 * to ensure they are valid 24-character hexadecimal MongoDB ObjectIDs.
 * This prevents Mongoose CastError exceptions and returns clean 400 Bad Request responses.
 */
@Injectable()
export class ParseObjectIdPipe implements PipeTransform<string, string> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  transform(value: string, metadata: ArgumentMetadata): string {
    if (!isValidObjectId(value)) {
      throw new BadRequestException(
        `Invalid MongoDB ID format: "${value}". Expected a 24-character hexadecimal string.`,
      );
    }
    return value;
  }
}

