
import mongoose, { Document, Schema } from 'mongoose';

// TypeScript Interface for Mongoose Documents
// This ensures strong typing when querying the database
export interface IRestaurant extends Document {
  // User-provided fields
  name: string;
  address: string;
  description: string;
  cuisine: 'Italian' | 'Mexican' | 'Indian' | 'Japanese' | 'Other';
  priceRange: '₹' | '₹₹' | '₹₹₹' | '₹₹₹₹';
  imageUrl?: string;

  // System-controlled fields
  averageRating: number;
  location: {
    type: 'Point'; // MongoDB GeoJSON type
    coordinates: [number, number]; // [longitude, latitude]
  };

  // Audit fields (automatically added by timestamps: true)
  createdAt: Date;
  updatedAt: Date;
}

//   Mongoose Schema
const RestaurantSchema = new Schema<IRestaurant>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },

    // Enums for data consistency
    cuisine: {
      type: String,
      enum: ['Italian', 'Mexican', 'Indian', 'Japanese', 'Other'],
      required: true
    },
    priceRange: {
      type: String,
      enum: ['₹', '₹₹', '₹₹₹', '₹₹₹₹'],
      required: true
    },

    // System-controlled fields
    averageRating: { type: Number, default: 0, min: 0, max: 5 },

    // GeoJSON Field for advanced geospatial queries
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },

    imageUrl: { type: String, trim: true },
  },
  {
    timestamps: true,
  }
);

// Indexing for Performance
RestaurantSchema.index({ location: '2dsphere' });


export default mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);