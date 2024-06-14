Puppy Spa API

Node.js: v14.x or higher
npm: v6.x or higher (or use yarn as an alternative)
Nest CLI: npm install -g @nestjs/cli

Installation
Clone the repository:

bash
Copiar código
git clone https://github.com/AdryannMillos/puppy-spa.git
cd puppy-spa
Install dependencies:

bash
Copiar código
npm install

Configuration
The project uses environment variables for configuration. Create a .env file in the root directory of your project and add the required environment variables. you can see the variable on .env.example

Running the Application
To run the application locally, use the following command:

bash
Copiar código
npm run start:dev
This command starts the application in development mode and watches for any changes in your source files.

The application will be running at http://localhost:3000 (or the port specified in your .env file).

Running Tests
To run the tests, use the following commands:

Unit tests:

bash
Copiar código
npm run test
