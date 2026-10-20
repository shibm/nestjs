import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

/**
 * Product Mongoose Schema
 * Defines the MongoDB collection schema using NestJS decorators.
 * timestamps: true automatically manages createdAt and updatedAt fields.
 */
@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_doc, ret: Record<string, unknown>) => {
      // Clean up MongoDB specific __v field from JSON responses
      delete ret.__v;
      return ret;
    },
  },
})
export class Product {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ trim: true, default: '' })
  description?: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, trim: true, index: true })
  category: string;

  @Prop({ default: true })
  inStock: boolean;

  @Prop({ type: [String], default: [] })
  tags: string[];

  // createdAt and updatedAt are added automatically by Mongoose timestamps
  createdAt?: Date;
  updatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Text index for searching by title and description
ProductSchema.index({ title: 'text', description: 'text' });

