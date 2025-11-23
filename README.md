RestoHub Server (Backend)

This repository serves as the robust API backend for the RestoHub application. It manages database interactions, business logic, and geospatial queries.

💾 Tech Stack

Platform: Node.js 

Framework: Express.js

Language: TypeScript 

Database: MongoDB 

Validation: Zod (for server-side request body validation)

📁 Project Structure and Architecture

The server follows the industry-standard Model-Service-Controller architecture:

models/: Defines the Mongoose schemas, including the GeoJSON Schema for location data, enabling efficient proximity queries.

services/: Contains the core business logic (e.g., retrieving filtered/paginated restaurants, handling GeoJSON format conversion).

controllers/: Handles request parsing, delegates tasks to services, and sends responses.

routes/: Defines API endpoints (e.g., /api/restaurants, /api/restaurants/:id).

🔑 Environment Configuration

You must create a .env file in this directory with the following structure:

# Production MongoDB Connection String - Set to your Atlas or local URI
MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/RestoHubDB?retryWrites=true&w=majority"
PORT=8000 


⚙️ Execution

# Install dependencies
npm install

# Build the TypeScript code to JavaScript (output goes to /dist)
npm run build

# Start the production server (runs the built JavaScript)
npm start
