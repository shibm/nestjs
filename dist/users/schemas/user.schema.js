var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
let User = class User {
    name;
    email;
    role;
    age;
    isActive;
    createdAt;
    updatedAt;
};
__decorate([
    Prop({ required: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Prop({ required: true, unique: true, lowercase: true, trim: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Prop({ default: 'user', enum: ['user', 'admin'] }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    Prop({ min: 0 }),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    Prop({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isActive", void 0);
User = __decorate([
    Schema({
        collection: 'users',
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (_doc, ret) => {
                delete ret.__v;
                return ret;
            },
        },
    })
], User);
export { User };
export const UserSchema = SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map