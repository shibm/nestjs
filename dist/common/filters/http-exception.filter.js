var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var HttpExceptionFilter_1;
import { Catch, HttpException, HttpStatus, Logger, } from '@nestjs/common';
let HttpExceptionFilter = HttpExceptionFilter_1 = class HttpExceptionFilter {
    logger = new Logger(HttpExceptionFilter_1.name);
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;
        const exceptionResponse = exception.getResponse();
        let message = exception.message;
        let error = exception.name;
        if (typeof exceptionResponse === 'object' &&
            exceptionResponse !== null &&
            'message' in exceptionResponse) {
            const resp = exceptionResponse;
            message = resp.message ?? message;
            error = resp.error ?? error;
        }
        const errorPayload = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            error,
            message,
        };
        this.logger.warn(`[${request.method}] ${request.url} - Status ${status} - ${JSON.stringify(message)}`);
        response.status(status).json(errorPayload);
    }
};
HttpExceptionFilter = HttpExceptionFilter_1 = __decorate([
    Catch(HttpException)
], HttpExceptionFilter);
export { HttpExceptionFilter };
//# sourceMappingURL=http-exception.filter.js.map