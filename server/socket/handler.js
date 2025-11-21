const geoip = require('geoip-lite');

// In-memory stats storage (reset on server restart)
const stats = {
    totalVisits: 0,
    activeUsers: 0,
    totalTimeSpent: 0, // in seconds
    countryDistribution: {}, // { "US": 10, "IN": 5 }
    sessions: new Map() // socket.id -> startTime
};

module.exports = (io) => {
    let waitingUsers = [];
    const userRooms = new Map();
    const rooms = new Map();

    // Expose stats getter for API
    io.getStats = () => ({
        totalVisits: stats.totalVisits,
        activeUsers: stats.activeUsers,
        avgTimeSpent: stats.totalVisits > 0 ? Math.round(stats.totalTimeSpent / stats.totalVisits) : 0,
        countryDistribution: stats.countryDistribution
    });

    io.on('connection', (socket) => {
        // Track new visit
        stats.totalVisits++;
        stats.activeUsers++;
        stats.sessions.set(socket.id, Date.now());

        // Track Country
        const ip = socket.handshake.headers['x-forwarded-for'] || socket.handshake.address;
        const geo = geoip.lookup(ip);
        const country = geo ? geo.country : 'Unknown';

        stats.countryDistribution[country] = (stats.countryDistribution[country] || 0) + 1;

        console.log(`User connected: ${socket.id} from ${country}`);

        // --- 1-on-1 Random Chat Logic ---

        socket.on('join_queue', () => {
            if (waitingUsers.length > 0) {
                const partnerSocket = waitingUsers.pop();

                if (io.sockets.sockets.get(partnerSocket.id)) {
                    const roomId = `${socket.id}-${partnerSocket.id}`;

                    socket.join(roomId);
                    partnerSocket.join(roomId);

                    userRooms.set(socket.id, { roomId, partnerId: partnerSocket.id, type: '1on1' });
                    userRooms.set(partnerSocket.id, { roomId, partnerId: socket.id, type: '1on1' });

                    io.to(roomId).emit('paired', { roomId });

                    socket.emit('partner_found', { partnerId: partnerSocket.id, initiator: true });
                    partnerSocket.emit('partner_found', { partnerId: socket.id, initiator: false });

                    console.log(`Paired ${socket.id} with ${partnerSocket.id} in room ${roomId}`);
                } else {
                    waitingUsers.push(socket);
                }
            } else {
                if (!waitingUsers.some(u => u.id === socket.id)) {
                    waitingUsers.push(socket);
                    console.log(`User ${socket.id} added to queue`);
                }
            }
        });

        socket.on('next', () => {
            const userInfo = userRooms.get(socket.id);
            if (userInfo && userInfo.type === '1on1') {
                io.to(userInfo.partnerId).emit('partner_disconnected');
                userRooms.delete(socket.id);
                userRooms.delete(userInfo.partnerId);
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

            if (!room.users.includes(socket.id)) {
                room.users.push(socket.id);
                socket.join(roomId);
                userRooms.set(socket.id, { roomId, type: 'group' });
                socket.to(roomId).emit('user_joined', { userId: socket.id });
            } else {
                socket.join(roomId);
            }

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
                if (room.users.includes(userId)) {
                    io.to(userId).emit('kicked');
                    io.sockets.sockets.get(userId)?.leave(userInfo.roomId);

                    room.users = room.users.filter(id => id !== userId);
                    userRooms.delete(userId);
                    room.muted.delete(userId);

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
                io.to(userInfo.roomId).emit('user_muted', { userId, muted });
            }
        });

        socket.on('find_random_room', () => {
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
            io.to(data.target).emit('signal', {
                sender: socket.id,
                signal: data.signal
            });
        });

        socket.on('message', (data) => {
            socket.to(data.roomId).emit('message', {
                sender: socket.id,
                message: data.message,
                timestamp: new Date().toISOString()
            });
        });

        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);

            // Update Stats
            stats.activeUsers = Math.max(0, stats.activeUsers - 1);
            const startTime = stats.sessions.get(socket.id);
            if (startTime) {
                const duration = (Date.now() - startTime) / 1000; // seconds
                stats.totalTimeSpent += duration;
                stats.sessions.delete(socket.id);
            }

            waitingUsers = waitingUsers.filter(user => user.id !== socket.id);

            const userInfo = userRooms.get(socket.id);
            if (userInfo) {
                if (userInfo.type === '1on1') {
                    io.to(userInfo.partnerId).emit('partner_disconnected');
                    userRooms.delete(userInfo.partnerId);
                } else if (userInfo.type === 'group') {
                    const room = rooms.get(userInfo.roomId);
                    if (room) {
                        room.users = room.users.filter(id => id !== socket.id);
                        room.muted.delete(socket.id);

                        if (room.users.length === 0) {
                            rooms.delete(userInfo.roomId);
                        } else {
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
