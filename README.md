# Vteam project
This is the main repository for the VTeam project. This directory is divided into four different subdirectories. To gain an understanding of the system's organization and functionality, read the following documentation along with the other linked documents. The simulation system is designed to run as a whole; however, the simulation needs to be executed separately and requires the base system to be built beforehand in order to function.

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/RunningStrings/vteam-project/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/RunningStrings/vteam-project/badges/quality-score.png?b=main)

## Setup
1. Clone the repository:

```
git clone --recursive https://github.com/RunningStrings/vteam-project.git
```

2. Add environnement variables from root directory `vteam-project/`:
    * `touch .env` if not exists or update it with:

      * `NODE_ENV="development"`
      * `MONGO_DSN=mongodb://mongodb:27017/bike_database`
      * `MONGO_URI=mongodb://mongodb:27017`
      * `CLIENT_ID=Ov23li9ndlwDmCu3NI3W`
      * `CLIENT_SECRET=ceb6c2e1c5fb2099f5a9ab839b6a1a2e30da204f`
      * `REDIRECT_URI=http://localhost:5000/github/oauth2/callback`
      * `JWT_SECRET=bikeriderz12345!`

## Start the base system
1. Navigate to the project root directory, `vteam-project/`:

```
docker-compose up --build
```
2. Access the frontends:<br>
   * Administrative Frontend:<br>
        `https://localhost:5173`

   * Customer Frontend:<br>
    `https://localhost:1337`

## Start the simulation system
1. Start the base system as describe above.

2. Follows the instructions from the simulation document:<br>
[Simulation Configuration](https://github.com/RunningStrings/vteam-project/blob/development/bike-brain/README.md)

## Files structure
	vteam-project/
	├── backend/
	├── bike-brain/
    ├── frontend/
    ├── frontend_customer/
    ├── docker-compose.simulation.yml
    ├── docker-compose.yml

### Backend
This subdirectory contains both the database and the REST API for the project.

#### REST API Documentation
For a detailed overview of the REST API, refer to the Postman documentation:<br>
[REST API Documentation](https://documenter.getpostman.com/view/40462903/2sAYQdj9je#intro)<br>

#### Database details
For more information about the database configuration and setup, check the README in the database-config directory:<br>
[Database Configuration](https://github.com/RunningStrings/vteam-project/blob/development/backend/database-config/README.md)

### Bike-brain
This subdirectory contains the logic behind the .

### Frontend
This subdirectory contains both the database and the REST API for the project.