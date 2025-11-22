//restaurant.controller.ts

import { Request, Response } from 'express';
import RestaurantModel from '../models/restaurant.model'; 
import { CreateRestaurantInput } from '../schemas/restaurant.schema'; 
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


// export const getRestaurants = (req: Request, res: Response) => {
//     return res.status(StatusCodes.OK).json({ message: 'Restaurant list endpoint - To be implemented.' });
// };



const getRestaurants =  async ( req, res ) => {

   const restaurants  = await RestaurantModel.find();

    if ( !restaurants ) {
        return res.status(StatusCodes.NOT_FOUND).json({
            message : "no resturenets",
            success : false,
        })
    };


    return res.status(StatusCodes.OK).json({
        restaurants,
        Message: "Resturant fetched successfully",
        success : true,
    });
} catch ( error ) {
    return resizeBy.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message : "Internal server error ",
        success : false,
    })
}