# Simulation

## Get started

### JWT token instructions

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
