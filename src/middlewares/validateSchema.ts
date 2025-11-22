
import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodType, ZodIssue } from 'zod';
import { StatusCodes } from '../utils/statusCodes';


export const validate = (schema: ZodType<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {



        const zodError: ZodError = error as ZodError;


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