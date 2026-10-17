const socket=io('http://localhost:3000/chat')
const roomSocket=io('http://localhost:3000/room')
const nickname=prompt('닉네임을 입력해주세요','새 사용자')
let currnetRoom=''
socket.on('connect',()=>{
    console.log('connected')
})
function sendMessage(){
        const message=$('#message').val()
        
         $('#chat').append(`<div> 나 : ${message}</div>`)
         socket.emit('message',{message,nickname})
    }
    
    socket.on('message',(message)=>{
        $('#chat').append(`<div>${message}</div>`)
    })
function createRoom(){
    const room=prompt('방 이름 입력','새 방')
    roomSocket.emit('createRoom',{room,nickname})
}
    roomSocket.on('rooms',data=>{
        console.log(data)
        $('#rooms').empty()
        data.forEach(room => {
            $('#rooms').append(`<li>${room}<button onclick="joinRoom('${room}')"> join</button></li>`)
        });
    })