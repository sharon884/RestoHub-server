import express from "express";
import { getRestaurants, addRestaurant } from "../controllers/restaurant.controller";

const router = express.Router();

// GET all restaurants
router.get("/", getRestaurants);

// POST a new restaurant
router.post("/", addRestaurant);

export default router;
