# Database for the vteam project

## Setup
* Set environnements, from root directory, `touch .env` if not exists or update it with:
  * `NODE_ENV="development"`
  * `MONGO_DSN=mongodb://mongodb:27017/bike_database`
  * `MONGO_URI=mongodb://mongodb:27017`

* Delete instance of data, from root directory: 
    * `sudo rm -rf ./data/db`

## How it works?
When starting `docker-compose up --build` runs:
* `index.js` :
  * Sets or updates ID for all json files in parkings and stations.
  * Creates or updates a `users.json` with 500 or 1000 entries depending of NODE_ENV.
  * Creates or updates a `bikes.json` with 500 or 1000 entries depending of NODE_ENV.
  * Updates ID for`bikes.json`.
  * Distributes `bikes.json` (ID) in all json files in parkings and stations.
## Database schema
	cities: { 
		"_id": "ObjectId",
		"name": "string",
		"geometry": {
			"type": "Polygon",
			"coordinates": [[longitude, latitude],[longitude, latitude]...]
		}
	}
	
	bikes: {
		"_id": "ObjectId",
		"id": "number",
		"city_name": "string",
		"location": {
			"type": "Point",
			"coordinates": [longitude, latitude]	// GeoJSON for bike's current position
		},                                	
		"status": "string",               			// 'available', 'in-use', 'maintenance', 'charging'
		"battery_level": "number",        			// Percentage (0-100)
		"speed": "number"							// km/h
	}
	
	stations: {
		"_id": "ObjectId",
		"id": "number",
		"name": "string",
		"city_name": "string",
		"location": {
			"type": "Point",
			"coordinates": [longitude, latitude]
		},
		"bikes": ["id"],            			// List of bikes ID in station
		"capacity": "number",             			// Maximum number of bikes in station
	}
	
	parking: {
		"_id": "ObjectId",
		"id": "number",
		"name": "string",
		"city_name": "string",
		"location": {
			"type": "point",
			"coordinates": [longitude, latitude]
		},
		"bikes": ["id"],            			// List of bikes ID in parking
		"capacity": "number",             			// Maximum number of bikes in parking	
	}

	users: {
		"_id": "ObjectId",
		"role": "string",                 			// e.g., 'customer', 'admin', 'city_manager'
		"firstname": "string",
		"lastname": "string",
		"email": "string",
		"password_hash": "string",
		"balance": "number",             			// Prepaid balance
		"trip_history": ["ObjectId"]     			// List of trips ID
	}
	
	trips: {
		"_id": "ObjectId",
		"bike_id": "ObjectId",            			// Reference to Bikes
		"customer_id": "ObjectId",        			// Reference to Customers
		"start": {
			"location": {
				"type": "point",
				"coordinates": [longitude, latitude]
			},
			"timestamp": "timestamp"
		},
		"end": {
			"location": {
				"type": "point",
				"coordinates": [longitude, latitude]
			},
			"timestamp": "timestamp"
		},
		"distance": "number",             			// In meters
		"cost": "number",                 			// Total trip cost
		"parking_type": "string",         			// 'station', 'parking', 'free_parking'
	}

## Files structure
	vteam-project/
	├── data-generation/        # Handles data generation tasks
	│   ├── distributeBikes.js  	# Distributes bikes into stations and parkings
	│   ├── fileDirectoryUtils.js   # Utilities functions for files and directories
	│   ├── generateBikes.js    	# Generates bike data
	│   ├── generateUsers.js    	# Generates users data
	│   ├── index.js            	# Orchestrates all data generation scripts
	│   ├── updateIds.js        	# Updates IDs in JSON files
	├── data-json/              # Directory for JSON data files
	│   ├── parkings/           # Subdirectory for parking JSON files
	│   │   ├── parkings_linkoping.json
	│   │   ├── parkings_malmo.json
	│   │   ├── parkings_stockholm.json
	│   ├── stations/           # Subdirectory for station JSON files
	│   │   ├── stations_linkoping.json
	│   │   ├── stations_malmo.json
	│   │   ├── stations_stockholm.json
	│   ├── bikes.json    			# Output file for 50 or 1000 bikes
	│   ├── cities.json				# Data file for cities
	│   ├── trips.json      		# TEST file for trips
	│   ├── users.json      		# Output file for 50 or 1000 users
	├── database-config/        # Database-config scripts
	│   ├── database.js      		# Database connection logic
	│   ├── seed.js             	# Populates the database with JSON data
	│   ├── README.md               # Documentation
	├── .env                    	# Environment variables
	├── package.json            	# Project dependencies and scripts

## Regenerate data (optional)
To regenerate data manually for local test without docker. From root directory, `cd backend/data_generation` then `node index.js`.
* Generate new ID for parkings/* .json and stations/* .json.
* Generate new users.json with 500 or 1000 depending of NODE.ENV.
* Generate new bikes.json with 500 or 1000 depending of NODE.ENV.
* Generate new ID for bikes.json.
* Distributes bikes generated (500 or 1000 depending of NODE.ENV) into parkings and stations json files.

## NODE ENV
To generate data for 1000 for simulation, NODE_ENV (process.env.NODE_ENV) needs to be set to: `process.env.NODE_ENV="simulation"` in docker-compose.yml for simulation.