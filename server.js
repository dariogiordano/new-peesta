const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");
const crypto = require("crypto");
const app = express();
// our localhost port
const port = process.env.PORT || 3000;
//const port = 3001;
// our server instance
const server = http.createServer(app);
// This creates our socket using the instance of the server
const io = socketIO();
app.use(express.static(path.join(__dirname, "build")));
app.get("*", (req, res) => {
	res.sendFile(path.resolve(__dirname, "build", "index.html"));
});
server.listen(port, () => console.log(`Listening on port ${port}`));
io.listen(server);
//////////////////////////////////////////////

var matches = [];

io.on("connection", (socket) => {
	console.log("User connected with id:", socket.id);
	socket.on("user reconnected", (roomName) => {
		socket.roomName = roomName;
		socket.join(roomName);
		io.to(socket.roomName).emit("connection recovered");
	});

	socket.on("registerPlayer", (trackData, roomName) => {
		const newRoomName = roomName || crypto.randomBytes(2).toString("hex");
		socket.roomName = newRoomName;
		socket.join(newRoomName);
		//se non viene passato un roomName vuol dire che e una nuova partita: in questo caso va registrato il player numero1
		if (!roomName) {
			let match = {
				trackData,
				roomName: newRoomName,
				player1: { id: socket.id },
			};
			matches.push(match);
			console.log(
				`Player 1 registered. New room Name: ${socket.roomName} Player ID: ${socket.id}`
			);

			io.to(newRoomName).emit("setPlayer1", newRoomName, socket.id);
		} else {
			let match = matches.find((match) => match.roomName === roomName);
			if (match) {
				match.player2 = { id: socket.id };
				console.log(
					`Player 2 registered. Room Name: ${socket.roomName} Player ID: ${socket.id}`
				);
				io.to(newRoomName).emit("setPlayer2", match.trackData, socket.id);
			}
		}
	});

	socket.on("moved", (point) => {
		console.log(`Update room n° ${socket.roomName}`);
		console.log(`new point ${point.x} ${point.y}`);
		io.to(socket.roomName).emit("update", socket.id, point);
	});

	socket.on("firstToFinishRace", (point) => {
		console.log("firstToFinishRace: ", socket.id);
		io.to(socket.roomName).emit("lastChance", socket.id, point);
	});

	socket.on("lost", (point) => {
		console.log("won");
		io.to(socket.roomName).emit("won", socket.id, point);
	});

	socket.on("draw", (point) => {
		console.log("draw ", socket.id);
		io.to(socket.roomName).emit("draw", socket.id, point);
	});

	socket.on("player will unregister", () => {
		matches = matches.filter((match) => match.roomName !== socket.roomName);
		console.log(`User from room n° ${socket.roomName} disconnected`);
		socket.leftRoom = true;
		socket.disconnect();
	});
	socket.on("disconnect", () => {
		//rimuovo il match dalla lista dei match registrati
		if (socket.leftRoom) io.to(socket.roomName).emit("left alone");
		else io.to(socket.roomName).emit("connection lost");
	});
});
