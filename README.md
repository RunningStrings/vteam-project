# Vteam project
Welcome to the VTeam project repository. This project is divided into multiple subdirectories, each serving a specific purpose. While the system is designed to function as an integrated whole, the simulation system must be executed separately and requires the base system to be built beforehand.

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/RunningStrings/vteam-project/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/RunningStrings/vteam-project/badges/quality-score.png?b=main)

## Setup
**1. Clone the repository**

```
git clone --recursive https://github.com/RunningStrings/vteam-project.git
```

**2. Configure Environment Variables**<br>
In the root directory (`vteam-project/`), create or update the `.env` file:
```
touch .env
```
Add the following variables to the .env file:

```
NODE_ENV="development"
MONGO_DSN=mongodb://mongodb:27017/bike_database
MONGO_URI=mongodb://mongodb:27017
CLIENT_ID=Ov23li9ndlwDmCu3NI3W
CLIENT_SECRET=ceb6c2e1c5fb2099f5a9ab839b6a1a2e30da204f
REDIRECT_URI=http://localhost:5000/github/oauth2/callback
JWT_SECRET=bikeriderz12345!
```

## Start the base system
**1. Navigate to the project root directory**<br>
```
cd vteam-project
```
**2. Start the Base System**<br>
Build and run the base system using Docker Compose:
```
docker-compose up --build
```

**3. Access the frontends**<br>
   * Administrative Frontend:<br>
    [https://localhost:5173](https://localhost:5173)

   * Customer Frontend:<br>
    [https://localhost:1337](https://localhost:1337)

## Start the simulation system
**1. Ensure the Base System is Running**<br>
Follow the steps in the "Start the Base System" section.

**2. Configure and Run the Simulation**<br>
Refer to the [Simulation Configuration Documentation](https://github.com/RunningStrings/vteam-project/blob/development/bike-brain/README.md) for detailed setup and execution.

## Files structure
The project directory is organized as follows:
```
vteam-project/  
├── backend/               # Contains the database and REST API
├── bike-brain/            # Logic for bike simulation
├── frontend/              # Administrative frontend
├── frontend_customer/     # Customer frontend
├── webapp/                # Customer mobile app
├── docker-compose.simulation.yml  
├── docker-compose.yml  
```
## Subdirectory Details
### Backend
The backend subdirectory houses the database and REST API.
* **REST API Documentation**<br>
For a detailed overview, see the [Postman Documentation](https://documenter.getpostman.com/view/40462903/2sAYQdj9je#intro)
* **Database Configuration**<br>
For database setup and configuration, see the [Database Configuration Documentation](https://github.com/RunningStrings/vteam-project/blob/development/backend/database-config/README.md)

### Bike-brain
Contains the logic and functionality for the bike simulation system. For detailed and setup, see the [Simulation Configuration Documentation](https://github.com/RunningStrings/vteam-project/blob/development/bike-brain/README.md)

### Frontend
The frontend subdirectory is the administrative system with the following features:<br>
* Log in using admin credentials stored in the database
* View maps of three cities (Stockholm, Linköping and Malmö)
* View locations of bikes, stations, and parking on the map
* View and manage customers in the system

### Frontend_customer
The frontend_customer subdirectory is the customer-facing system with the following features:<br>
* Register for an account through OAuth GitHub
* Log in through GitHub or a username
* View overview for account
* View rental history for specific rentals
* Add credit or balance to your account

### Webbapp
The webapp subdirectory is the mobile application with features to:<br>
* Rent a Bicycle: Locate and rent a bike.
* Return a Bicycle: Return a rented bike at designated stations.
