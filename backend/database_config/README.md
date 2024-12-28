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
		"firstname": "string",
		"lastname": "string",
		"email": "string",
		"password_hash": "string",
		"balance": "number",             			// Prepaid balance
		"role": "string",                 			// e.g., 'customer', 'admin', 'city_manager'
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

## Database reset
In root directory `sudo rm -rf ./data/db`

## Regenerate data
