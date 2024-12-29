# Database for the vteam project

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
		"city_name": "string",
		"location": {
			"type": "Point",
			"coordinates": [longitude, latitude]	// GeoJSON for bike's current position
		},                                	
		"status": "string",               			// 'available', 'in_use', 'maintenance', 'charging'
		"battery_level": "number",        			// Percentage (0-100)
		"speed": "number"							// km/h
	}

	charging_stations: {
		"_id": "ObjectId",
		"name": "string",
		"city_name": "string",
		"location": {
			"type": "Point",
			"coordinates": [longitude, latitude]
		},
		"bikes": ["ObjectId"],            			// List of bikes ID in station
		"capacity": "number",             			// Maximum number of bikes in station
	}

	parking_zones: {
		"_id": "ObjectId",
		"name": "string",
		"city_name": "string",
		"location": {
			"type": "point",
			"coordinates": [longitude, latitude]
		},
		"bikes": ["ObjectId"],            			// List of bikes ID in parking
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
		"parking_type": "string",         			// 'charging_station', 'parking_zones', 'free_parking'
	}

## Files structure

	vteam-project/
	├── data-generation/        # Handles data generation tasks
	│   ├── distributeBikes.js  	# Distributes bikes into stations and parkings
	│   ├── fileDirectoryUtils.js   # Utilities functions for files and directories system
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
	│   ├── bikes_big.json      	# Output file for 1000 bikes
	│   ├── bikes_small.json    	# Output file for 50 bikes
	│   ├── cities.json
	│   ├── users_big.json      	# Output file for 1000 users
	│   ├── users_small.json    	# Output file for 50 users
	├── database-config/        # Database-config scripts
	│   ├── database.js      		# Database connection logic
	│   ├── seed.js             	# Populates the database with JSON data
	│   ├── README.md               # Documentation
	├── .env                    	# Environment variables
	├── package.json            	# Project dependencies and scripts

## Setup
From root directory, `touch .env` if not exists or update it with:
`MONGO_DSN=mongodb://mongodb:27017/bike_database`
`MONGO_URI=mongodb://mongodb:27017`

## Database reset
From root directory: `sudo rm -rf ./data/db`

## Regenerate data
To generate new ID for parkings/* .json and stations/* .json, generate new users_small.json and users_big.json and update their id. Generate new bikes_small.json and bikes_big.json and update their id.

From root directory, `cd backend/data_generation` then `node index.js`.