import { Server } from 'socket.io';

export const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
<<<<<<< HEAD
        allowEIO3: true,
        perMessageDeflate: false,
=======
>>>>>>> 1eb612b (Add cors to socket.io instance)
    });

    io.on('connection', (socket) => {
        console.log('A bike connected:', socket.id);

        // Listen for events from the bike
        socket.on('update-bike-data', (data) => {
            const { id } = data;
            console.log(`Bike ${id} data update:`, data);

            io.emit('bike-update', data); // Frontend listens for this event
        });

        socket.on('disconnect', () => {
            console.log('A bike disconnected:', socket.id);
        });
    });

    return io;
};
