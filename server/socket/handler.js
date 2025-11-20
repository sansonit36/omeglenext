module.exports = (io) => {
    let waitingUsers = [];
    const userRooms = new Map(); // Track which room each user is in

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('join_queue', () => {
            // If there's someone waiting, pair them up
            if (waitingUsers.length > 0) {
                const partnerSocket = waitingUsers.pop();

                // Ensure the partner is still connected
                if (io.sockets.sockets.get(partnerSocket.id)) {
                    const roomId = `${socket.id}-${partnerSocket.id}`;

                    socket.join(roomId);
                    partnerSocket.join(roomId);

                    // Track rooms
                    userRooms.set(socket.id, { roomId, partnerId: partnerSocket.id });
                    userRooms.set(partnerSocket.id, { roomId, partnerId: socket.id });

                    // Notify both users they are paired
                    io.to(roomId).emit('paired', { roomId });

                    // Inform each user of their partner's ID
                    socket.emit('partner_found', { partnerId: partnerSocket.id, initiator: true });
                    partnerSocket.emit('partner_found', { partnerId: socket.id, initiator: false });

                    console.log(`Paired ${socket.id} with ${partnerSocket.id} in room ${roomId}`);
                } else {
                    // Partner disconnected, put current user in queue
                    waitingUsers.push(socket);
                }
            } else {
                // No one waiting, add to queue
                waitingUsers.push(socket);
                console.log(`User ${socket.id} added to queue`);
            }
        });

        socket.on('signal', (data) => {
            // Relay signaling data (offer, answer, ice-candidate) to the partner
            io.to(data.target).emit('signal', {
                sender: socket.id,
                signal: data.signal
            });
        });

        socket.on('message', (data) => {
            // Relay text messages
            socket.to(data.roomId).emit('message', {
                sender: socket.id,
                message: data.message,
                timestamp: new Date().toISOString()
            });
        });

        socket.on('next', () => {
            // User wants to skip - notify partner
            const userInfo = userRooms.get(socket.id);
            if (userInfo) {
                io.to(userInfo.partnerId).emit('partner_disconnected');

                // Clean up room tracking
                userRooms.delete(socket.id);
                userRooms.delete(userInfo.partnerId);

                // Leave room
                socket.leave(userInfo.roomId);
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Remove from waiting queue if present
            waitingUsers = waitingUsers.filter(user => user.id !== socket.id);

            // Notify partner if in a room
            const userInfo = userRooms.get(socket.id);
            if (userInfo) {
                io.to(userInfo.partnerId).emit('partner_disconnected');
                userRooms.delete(userInfo.partnerId);
                userRooms.delete(socket.id);
            }
        });
    });
};
