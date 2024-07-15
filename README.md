# Library API

## Installation

Make sure you have Node.js in the version 16.20.2 and npm installed on your machine.

1. Clone this repository:
   `git clone https://github.com/gbrogni/library-api.git`
  
2. Install dependencies
   `cd library-api`
   
   `npm install`

## Configuration

1. Rename the .env.example file to .env and configure the environment variables as needed.
2. You can use the `JWT_PRIVATE_KEY` and the `JWT_PUBLIC_KEY` from the example.

3. Using Docker Compose, start the necessary services to run the application:

`docker-compose up -d`

4. After that, simply start the application (development):

`npm run start:dev`