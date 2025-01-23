# Simulation Instruction
The simulation provides an immersive experience of the system by showcasing the movement of 1,000 bikes operated by 1,000 users.

## Get JWT token instructions
1. Go to localhost:// and login with github, when authentication is successful you will be redirect to the page and get your JWT token in the url. For example, it could be:
http://localhost:1337/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjY3OTI4MjU3OWZlMDk0YjA3YWQzNTFkYSIsImZpcnN0bmFtZSI6Ik1pc3NpbmciLCJsYXN0bmFtZSI6Ik1pc3NpbmciLCJlbWFpbCI6ImJqb6JuOTExMUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJiYWxhbmNlIjpudWxsLCJtb250aGx5X3BhaWQiOmZhbHNlLHJnaXRodWJJZCI6IjE1MTY3MjkzMyIsInVzZXJuYW1lIjoiYmpvcm45MTExIn0sImlhdCI6MTczNzY1NDg3MSwiZXhwIjoxNzM4MjU5NjcxfQ.At0VhECYMbRbfB19A__4iYsQKG49dmGmty6uZghk2B4&role=admin&id=679282579fe094b07ad351da

Add environment variable BIKE_TOKEN in .env in the project root, and set it to a JWT token to give each bike administrative permissions.

### Run a simulation

Get the system running by entering

`docker-compose up --build`

in the terminal (this is the Docker Compose tab).

Make note of the container name for the simulation container. For me it's *'project_simulation_1'*.

In a second terminal window or tab (the simulation container tab), enter:

`docker exec -it <sim-container-name> sh`

You should now have a prompt, `#`.

Enter:

`node sim-multi.js`

to start a simulation with 500 bikes, or

`node sim-one.js`

to start a simulation with 1 bike.

End the simulation by entering `q`, `quit`, or `exit`, and press `Enter`.

To exit the simulation container, enter

`exit`

and press `Enter`.
