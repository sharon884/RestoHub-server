import mongoose, { Document, Schema } from 'mongoose';

export interface IRestaurant extends Document {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cuisine?: string;
  rating?: number;
}

const restaurantSchema = new Schema<IRestaurant>({
  name: { type: String, required: true },
  address: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  cuisine: { type: String },
  rating: { type: Number, default: 0 },
});

export default mongoose.model<IRestaurant>('Restaurant', restaurantSchema);
