// src/middleware/validateSchema.ts

import { Request, Response, NextFunction } from 'express';
// These types (ZodType, ZodError, ZodIssue) will now be correctly exported by Zod
import { ZodError, ZodType, ZodIssue } from 'zod'; 
import { StatusCodes } from '../utils/statusCodes'; // Your imported constants

/**
 * A higher-order function that creates an Express middleware for Zod validation.
 */
export const validate = (schema: ZodType<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        
        // FIX 1: Explicitly assert the type. This guarantees the compiler that the 
        // structure exists, resolving "Property 'errors' does not exist".
        const zodError: ZodError = error as ZodError; 

        // FIX 2: Explicitly type 'issue' as ZodIssue. 
        // This resolves "implicit 'any'" error.
        const errors = zodError.errors.map((issue: ZodIssue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        }));

        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Validation failed for request body.',
          errors: errors,
        });
      }
      
      next(error);
    }
  };