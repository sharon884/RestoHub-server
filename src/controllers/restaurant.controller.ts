import { Request, Response } from 'express';
import RestaurantModel from '../models/restaurant.model'; 
import { CreateRestaurantInput, GetRestaurantsQuery } from '../schemas/restaurant.schema'; 
import { StatusCodes } from '../utils/statusCodes'


// Add Restaurant
export const addRestaurant = async (req: Request<{}, {}, CreateRestaurantInput>, res: Response) => {
    try {
        const data: CreateRestaurantInput = req.body; 

        // Map frontend input (lat/long) to GeoJSON format ([longitude, latitude])
        const restaurantDataForDB = {
            ...data,
            location: {
                type: 'Point',
                coordinates: [data.longitude, data.latitude], // GeoJSON standard: [longitude, latitude]
            },
        };

        const newRestaurant = await RestaurantModel.create(restaurantDataForDB);
        
        return res.status(StatusCodes.CREATED).json({ 
            message: 'Restaurant created successfully', 
            restaurant: newRestaurant.toObject() 
        });

    } catch (error) {
        console.error('ADD_RESTAURANT_ERROR:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ 
            message: 'Server error during restaurant creation.', 
            error 
        });
    }
};


// Fetch Restaurants with Search & filter options 
export const getRestaurants = async (
    req: Request<{}, {}, {}, GetRestaurantsQuery>, // <Params, ResBody, ReqBody, ReqQuery>
    res: Response
) => {
    try {
        // 1. Destructure Query Params and calculate skip for pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // 2. Build the Mongoose Query Object for filtering
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

        // 3. Execute Query with Pagination (run in parallel for performance)
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

        // 4. Return Paginated Response with Meta Data
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
        console.error('GET_RESTAURANTS_ERROR:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal server error",
        });
    }
};

//Fetch Restuarant by Id 
export const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Find restaurant by ID
        const restaurant = await RestaurantModel.findById(id);

        if (!restaurant) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Restaurant not found.",
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Restaurant fetched successfully.",
            data: restaurant,
        });

    } catch (error) {
        console.error('GET_RESTAURANT_BY_ID_ERROR:', error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Error fetching restaurant details.",
        });
    }
};