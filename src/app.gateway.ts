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
    constructor(private readonly chatGateway:ChatGateway){}
    rooms: string[] = []
    @WebSocketServer() server:Server
    @SubscribeMessage('createRoom')
    handleMessage(@MessageBody() data:any):void{
        const {room,nickname}=data
        this.chatGateway.server.emit('notice',{
            message:`${nickname}님이 ${room} 방을 만들었습니다`
        })
        this.rooms.push(room)
        this.server.emit('rooms',this.rooms)
    }
    @SubscribeMessage('joinRoom')
    handleJoinRoom(socket:Socket,data:any){
        const {nickname,room,toLeaveRoom}=data
        socket.leave(toLeaveRoom)
        if(room!=toLeaveRoom)this.chatGateway.server.emit('notice',{message:`${nickname}님이 ${toLeaveRoom} 방에서 퇴장했습니다`})
        this.chatGateway.server.emit('notice',{message:`${nickname}님이 ${room} 방에 입장했습니다`})
        socket.join(room)
    }

    @SubscribeMessage('message')
    handleMessageToEoom(socket:Socket, data:any):void{
        const {message,nickname,room}=data
       socket.broadcast.to(room).emit('message',`${nickname}:${message}`)
    }
}