import { PipeTransform, ArgumentMetadata } from '@nestjs/common';
export declare class ParseObjectIdPipe implements PipeTransform<string, string> {
    transform(value: string, metadata: ArgumentMetadata): string;
}
