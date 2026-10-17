import { SubscribeMessage, WebSocketGateway, WebSocketServer, MessageBody } from "@nestjs/websockets";
 
import { Socket, Server  } from "socket.io";

@WebSocketGateway({namespace:'chat'})
export class ChatGateway{
    @WebSocketServer() server:Server
    @SubscribeMessage('message')
    handleMessage(socket:Socket, data:any):void{
        const {message,nickname}=data
       socket.broadcast.emit('message',`${nickname}:${message}`)
    }
   
}
@WebSocketGateway({namespace:'room'})
export class RoomGateway{
    rooms: string[] = []
    @WebSocketServer() server:Server
    @SubscribeMessage('createRoom')
    handleMessage(@MessageBody() data:any):void{
        const {room,nickname}=data
        this.rooms.push(room)
        this.server.emit('rooms',this.rooms)
    }
}