import { Request, Response } from "express";
import Restaurant from "../models/restaurant.model";

// Get all restaurants
export const getRestaurants = async (req: Request, res: Response) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Add a new restaurant
export const addRestaurant = async (req: Request, res: Response) => {
  try {
    const newRestaurant = new Restaurant(req.body);
    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
