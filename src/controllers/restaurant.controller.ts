//restaurant.controller.ts

import { Request, Response } from 'express';
import RestaurantModel from '../models/restaurant.model'; 
import { CreateRestaurantInput } from '../schemas/restaurant.schema'; 
import { GetRestaurantsQuery } from '../schemas/restaurant.schema';
import { StatusCodes } from '../utils/statusCodes'
import { STATUS_CODES } from 'http';
import { success } from 'zod/v4';


export const addRestaurant = async (req: Request<{}, {}, CreateRestaurantInput>, res: Response) => {
    try {
        // The request body is strongly typed and guaranteed to be valid here
        const data: CreateRestaurantInput = req.body; 

        
        const restaurantDataForDB = {
            ...data,
            location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude], 
            },
        };

       
        const newRestaurant = await RestaurantModel.create(restaurantDataForDB);
        
       
        return res.status(StatusCodes.CREATED).json({ 
            message: 'Restaurant created successfully', 
            restaurant: newRestaurant.toObject() 
        });

    } catch (error) {
       
        console.error('Database Error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Server error during restaurant creation.', 
            error 
        });
    }
};





export const getRestaurants = async (
    req: Request<{}, {}, {}, GetRestaurantsQuery>, // <Params, ResBody, ReqBody, ReqQuery>
    res: Response
) => {
    try {
        // 1. Destructure Query Params (with defaults handled by Zod or manually here)
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2. Build the Mongoose Query Object
        const query: any = {};

        // Filter by Cuisine if provided
        if (req.query.cuisine) {
            query.cuisine = req.query.cuisine;
        }

        // Filter by Price Range if provided
        if (req.query.priceRange) {
            query.priceRange = req.query.priceRange;
        }

        // Search by Name (Case-insensitive regex)
        if (req.query.search) {
            query.name = { $regex: req.query.search, $options: 'i' };
        }

        // 3. Execute Query with Pagination
        // running two queries in parallel for performance
        const [restaurants, total] = await Promise.all([
            RestaurantModel.find(query).skip(skip).limit(limit).sort({ createdAt: -1 }), // Newest first
            RestaurantModel.countDocuments(query)
        ]);

        if (restaurants.length === 0) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "No restaurants found matching your criteria.",
                data: []
            });
        }

        // 4. Return Response with Meta Data (Standard Pagination Format)
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Restaurants fetched successfully",
            data: restaurants,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('Database Error:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
};