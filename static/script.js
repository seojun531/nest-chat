const socket=io('http://localhost:3000/chat')
const roomSocket=io('http://localhost:3000/room')
const nickname=prompt('닉네임을 입력해주세요','새 사용자')
let currnetRoom=''

socket.on('connect',()=>{
    console.log('connected')
})
function sendMessage(){
    if(currnetRoom===''){
        alert('방을 선택해주세요')
        return
    }
        const message=$('#message').val()
        const data={ message, nickname, room:currnetRoom}
        
         $('#chat').append(`<div> 나 : ${message}</div>`)
         roomSocket.emit('message',data)
         return false
    }
    
    socket.on('message',(message)=>{
        $('#chat').append(`<div>${message}</div>`)
    })
function createRoom(){
    const room=prompt('방 이름 입력','새 방')
    roomSocket.emit('createRoom',{room,nickname})
}
    socket.on('notice',data=>{
        console.log(data)
        $('#notice').append(`<div>${data.message}</div>`)
    })

    roomSocket.on('message',(data)=>{
        console.log(data)
         $('#chat').append(`<div>${data}</div>`)
    })

    roomSocket.on('rooms',data=>{
        console.log(data)
        $('#rooms').empty()
        data.forEach(room => {
            $('#rooms').append(`<li>${room}<button onclick="joinRoom('${room}')"> join</button></li>`)
        });
    })
function joinRoom(room){
    roomSocket.emit('joinRoom',{room,nickname,toLeaveRoom:currnetRoom})
    $('#chat').html('')
    currnetRoom=room
}