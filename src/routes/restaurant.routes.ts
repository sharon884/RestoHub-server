// src/routes/restaurant.routes.ts

import express from "express";
import { getRestaurants, addRestaurant,getRestaurantById } from "../controllers/restaurant.controller";
import { validate } from '../middlewares/validateSchema'; // <-- New import
import { createRestaurantSchema } from '../schemas/restaurant.schema'; // <-- New import

const router = express.Router();

// GET all restaurants
router.get("/", getRestaurants);

// POST a new restaurant
// 1. Validation Middleware runs first
// 2. Controller function runs next if validation passes
router.post("/", validate(createRestaurantSchema), addRestaurant);

router.get("/:id", getRestaurantById);

export default router;