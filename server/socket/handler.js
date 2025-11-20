module.exports = (io) => {
    let waitingUsers = [];
    const userRooms = new Map(); // Track which room each user is in: socket.id -> roomId
    const rooms = new Map(); // Track room details: roomId -> { id, admin, limit, users: [], muted: Set() }

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        // --- 1-on-1 Random Chat Logic ---

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
                    userRooms.set(socket.id, { roomId, partnerId: partnerSocket.id, type: '1on1' });
                    userRooms.set(partnerSocket.id, { roomId, partnerId: socket.id, type: '1on1' });

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
                // No one waiting, add to queue if not already there
                if (!waitingUsers.some(u => u.id === socket.id)) {
                    waitingUsers.push(socket);
                    console.log(`User ${socket.id} added to queue`);
                }
            }
        });

        socket.on('next', () => {
            // User wants to skip - notify partner
            const userInfo = userRooms.get(socket.id);
            if (userInfo && userInfo.type === '1on1') {
                io.to(userInfo.partnerId).emit('partner_disconnected');

                // Clean up room tracking
                userRooms.delete(socket.id);
                userRooms.delete(userInfo.partnerId);

                // Leave room
                socket.leave(userInfo.roomId);
            }
        });

        // --- Group Room Logic ---

        socket.on('create_room', ({ limit }) => {
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
            const maxUsers = parseInt(limit) || 5;

            rooms.set(roomId, {
                id: roomId,
                admin: socket.id,
                limit: maxUsers,
                users: [socket.id],
                muted: new Set()
            });

            socket.join(roomId);
            userRooms.set(socket.id, { roomId, type: 'group' });

            socket.emit('room_created', { roomId, admin: socket.id });
            console.log(`Room ${roomId} created by ${socket.id} with limit ${maxUsers}`);
        });

        socket.on('join_room', ({ roomId }) => {
            const room = rooms.get(roomId);

            if (!room) {
                socket.emit('error', { message: 'Room not found' });
                return;
            }

            if (room.users.length >= room.limit && !room.users.includes(socket.id)) {
                socket.emit('error', { message: 'Room is full' });
                return;
            }

            // Add user to room if not already there
            if (!room.users.includes(socket.id)) {
                room.users.push(socket.id);
                socket.join(roomId);
                userRooms.set(socket.id, { roomId, type: 'group' });

                // Notify existing users of new peer ONLY if it's a new join
                socket.to(roomId).emit('user_joined', { userId: socket.id });
            } else {
                // Ensure socket is in the room channel (re-join just in case)
                socket.join(roomId);
            }

            // Notify user of success and current participants
            socket.emit('room_joined', {
                roomId,
                users: room.users.filter(id => id !== socket.id),
                admin: room.admin
            });

            console.log(`User ${socket.id} joined/rejoined room ${roomId}`);
        });

        socket.on('kick_user', ({ userId }) => {
            const userInfo = userRooms.get(socket.id);
            if (!userInfo || userInfo.type !== 'group') return;

            const room = rooms.get(userInfo.roomId);
            if (room && room.admin === socket.id) {
                // Admin is kicking someone
                if (room.users.includes(userId)) {
                    io.to(userId).emit('kicked');
                    io.sockets.sockets.get(userId)?.leave(userInfo.roomId);

                    // Remove from room state
                    room.users = room.users.filter(id => id !== userId);
                    userRooms.delete(userId);
                    room.muted.delete(userId);

                    // Notify others
                    io.to(userInfo.roomId).emit('user_left', { userId });
                }
            }
        });

        socket.on('mute_user', ({ userId, muted }) => {
            const userInfo = userRooms.get(socket.id);
            if (!userInfo || userInfo.type !== 'group') return;

            const room = rooms.get(userInfo.roomId);
            if (room && room.admin === socket.id) {
                if (muted) {
                    room.muted.add(userId);
                } else {
                    room.muted.delete(userId);
                }
                // Broadcast mute state to everyone in room
                io.to(userInfo.roomId).emit('user_muted', { userId, muted });
            }
        });

        socket.on('find_random_room', () => {
            // Find a room that is not full
            let foundRoomId = null;
            for (const [id, room] of rooms) {
                if (room.users.length < room.limit) {
                    foundRoomId = id;
                    break;
                }
            }

            if (foundRoomId) {
                socket.emit('random_room_found', { roomId: foundRoomId });
            } else {
                socket.emit('error', { message: 'No public rooms available. Create one!' });
            }
        });

        // --- Common Signaling & Cleanup ---

        socket.on('signal', (data) => {
            // Relay signaling data (offer, answer, ice-candidate) to the target
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

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Remove from waiting queue if present
            waitingUsers = waitingUsers.filter(user => user.id !== socket.id);

            const userInfo = userRooms.get(socket.id);
            if (userInfo) {
                if (userInfo.type === '1on1') {
                    // 1-on-1 cleanup
                    io.to(userInfo.partnerId).emit('partner_disconnected');
                    userRooms.delete(userInfo.partnerId);
                } else if (userInfo.type === 'group') {
                    // Group cleanup
                    const room = rooms.get(userInfo.roomId);
                    if (room) {
                        room.users = room.users.filter(id => id !== socket.id);
                        room.muted.delete(socket.id);

                        if (room.users.length === 0) {
                            rooms.delete(userInfo.roomId);
                        } else {
                            // If admin left, assign new admin (optional, for now just close or leave adminless)
                            // Ideally, assign to next user
                            if (room.admin === socket.id) {
                                room.admin = room.users[0];
                                io.to(userInfo.roomId).emit('new_admin', { admin: room.admin });
                            }
                            io.to(userInfo.roomId).emit('user_left', { userId: socket.id });
                        }
                    }
                }
                userRooms.delete(socket.id);
            }
        });
    });
};
