# Simulation Instruction
This simulation provides an immersive experience by showcasing the movement of 1,000 bikes operated by 1,000 users. Follow the steps below to set up and run the simulation.

## Obtain a JWT Token
To acquire a JWT token, follow these steps:

**1. Login via GitHub**<br>
Navigate to `https://localhost:1337` and log in using your GitHub account.
Upon successful authentication, you will be redirected to a page containing your JWT token in the URL.

Example URL:

```
http://localhost:1337/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OTI4MjU3OWZlMDk0YjA3YWQzNTFkYSIsImZpcnN0bmFtZSI6Ik1pc3NpbmciLCJsYXN0bmFtZSI6Ik1pc3NpbmciLCJlbWFpbCI6ImJqb6JuOTExMUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJiYWxhbmNlIjpudWxsLCJtb250aGx5X3BhaWQiOmZhbHNlLHJnaXRodWJJZCI6IjE1MTY3MjkzMyIsInVzZXJuYW1lIjoiYmpvcm45MTExIn0sImlhdCI6MTczNzY1NDg3MSwiZXhwIjoxNzM4MjU5NjcxfQ.At0VhECYMbRbfB19A__4iYsQKG49dmGmty6uZghk2B4&role=admin&id=679282579fe094b07ad351da
```

**2. Set Up the Bike Token**<br>
Add the JWT token to your .env file in the project's root directory. Define the `BIKE_TOKEN` environment variable as follows:<br>

```
BIKE_TOKEN="<your-token>
```

This token grants administrative permissions to each bike in the simulation.

## Run the Simulation
### **Prerequisite:**<br>
Ensure the base system is running before starting the simulation.

### **Steps to Run the Simulation**

**1. Locate the Simulation Container**<br>
Identify the name of the simulation container. For example, it might be:
```
project_simulation_1
```

**2. Access the Simulation Container**<br>
Open a terminal window or tab and execute the following command, replacing `<sim-container-name>` with the container's actual name:<br>
```
docker exec -it <sim-container-name> sh
```

**3. Start the Simulation**<br>
To simulate 1000 bikes, run:<br>
```
node sim-multi.js
```
To simulate 1 bike, run:<br>

```
node sim-one.js
```

**4. View the Simulation**<br>
Access the administrative frontend to view the simulation:<br>
`https://localhost:5173`

**5. End the Simulation**<br>
Stop the simulation by typing one of the following commands and pressing `Enter`:<br>
```
q
quit
exit
```

**6. Exit the Container**<br>
To exit the container, type:<br>
```
exit
