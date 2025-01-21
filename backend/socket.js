import { Server } from 'socket.io';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on('connection', (socket) => {
        console.log('A bike connected:', socket.id);

        // Listen for events from the bike
        socket.on('update-bike-data', (data) => {
            const { id, location, speed, battery, status, light } = data;
            console.log(`Bike ${id} data update:`, data);

            io.emit('bike-update', data); // Frontend listens for this event
        });

        // socket.on('update-location', (data) => {
        //     console.log('Location update:', data);
        //     io.emit('bike-update-location', data); // Frontend listens for this event
        // });

        // socket.on('update-speed', (data) => {
        //     console.log('Speed update:', data);
        //     io.emit('bike-update-speed', data); // Frontend listens for this event
        // });

        // socket.on('update-battery', (data) => {
        //     console.log('Battery update:', data);
        //     io.emit('bike-update-battery', data); // Frontend listens for this event
        // });

        socket.on('log-trip', (data) => {
            console.log('Trip log:', data);
        });

        socket.on('disconnect', () => {
            console.log('A bike disconnected:', socket.id);
        });
    });

    return io;
};
