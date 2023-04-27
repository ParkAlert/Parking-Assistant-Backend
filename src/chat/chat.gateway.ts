import { OnModuleInit } from "@nestjs/common";
import {
	WebSocketGateway,
	SubscribeMessage,
	WsResponse,
	WebSocketServer,
	WsException,
	MessageBody,
	ConnectedSocket,
} from "@nestjs/websockets";
import { Socket } from "dgram";

import { Server } from "socket.io";

@WebSocketGateway()
export class ChatGateway implements OnModuleInit {
	@WebSocketServer()
	server: Server;

	onModuleInit() {
		this.server.on("connection", socket => {
			console.log("It is connecting");

			//console.log(socket.handshake.headers["set-cookie"]);
			//console.log(username + " is connect");
			socket.join("chatRoom");
		});
	}

	@SubscribeMessage("newMessage")
	onNewMessage(@MessageBody() body: any, @ConnectedSocket() socket: any) {
		console.log(body);
		this.server.emit("onMessage", {
			msg: "New Msg",
			content: body,
		});
	}
}