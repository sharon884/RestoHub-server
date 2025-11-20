import { z } from 'zod';

export const createRestaurantSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  latitude: z.number(),
  longitude: z.number(),
  cuisine: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
});
