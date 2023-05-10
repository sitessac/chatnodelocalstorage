var socket = io('/');
var info = {
    numberMessages: 0,
    connected: 0
}
var author = ''
//var forasteyros = '13'

socket.on('receivedMessage', function(message){
    renderMessage(message)
});

socket.on('previousMessages', function(messages){
    for (message of messages){
        renderMessage(message)
    };

    renderConnectionsInfo()

});

socket.on('ConnectionsInfo', function(connectionsInfo){
    info.connected = connectionsInfo.connections._connections;
    renderConnectionsInfo();
})

getAuthor()
        
function getAuthor(){
    let user = localStorage.getItem('user')

    if(user){
        author = user
    }
    else if(!user){
        toggleBoxForNewUser('tog')
    }
}

function generateMessageTemplate({ message, author, time }) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    const userImageElement = document.createElement('div');
    userImageElement.classList.add('user-image');

    const userIconElement = document.createElement('i');
    userIconElement.classList.add('fal');
    userIconElement.classList.add('fa-user-circle');

    userImageElement.appendChild(userIconElement);

    const messageContentElement = document.createElement('div');

    const authorInfoElement = document.createElement('h2');
    authorInfoElement.textContent = author;

    const messageTimeElement = document.createElement('span');
    messageTimeElement.textContent = time;

    authorInfoElement.appendChild(messageTimeElement);

    const messageTextElement = document.createElement('p');
    messageTextElement.setAttribute('aria-expanded', true);
    messageTextElement.textContent = message;

    messageContentElement.appendChild(authorInfoElement);
    messageContentElement.appendChild(messageTextElement);

    messageElement.appendChild(userImageElement);
    messageElement.appendChild(messageContentElement);

    return messageElement;
}

function renderMessage(message) {
    const messagesContainer = document.querySelector('.messages');
    const messageTemplate = generateMessageTemplate(message);

    messagesContainer.appendChild(messageTemplate);

    info.numberMessages += 1;
    moveScroll();
    renderConnectionsInfo();
}

function renderConnectionsInfo(){
    $('#online').html(`<h3><i class="fas fa-circle"></i> ${info.connected} Online</h3>`)

    $('#messages-received').html(`<h3 id="messages-received"><i class="fad fa-inbox-in"></i> ${info.numberMessages} ${info.numberMessages === 1 ? "Mensagem" : "Mensagens"}</h3>`)
}

function toggleBoxForNewUser(met){
    if(met === 'tog'){
        let input = document.getElementById('enter-user');
        input.classList.toggle('active');
        input.focus()
        message.focus()
        let forasteyros = 13;
        let newUser = 'forasteyross';
      
        
        localStorage.setItem('user', newUser)
        author = newUser
        toggleBoxForNewUser('tog')
    }
    if(met === 'get'){
        localStorage.clear('user')
      //  let newUser = '';
      
        message.focus()
        localStorage.setItem('user', newUser)
        author = newUser
        toggleBoxForNewUser('tog')
    }
}

function moveScroll(){
    var objDiv = document.getElementById("messages");
    objDiv.scrollTop = objDiv.scrollHeight;
}

function Submit(event){
    event.preventDefault();

    getAuthor()

    var message = document.querySelector('input[name=message]').value;
    $('#input-message').val('')

    if(message.length){
        let now = new Date
        let time = now.getHours() + ':' + now.getMinutes()
        if (now.getHours() > 12){
            time += 'pm';
        }
        else{
            time += 'am';
        };

        var messageObject = {
            author,
            message,
            time,
        }

        renderMessage(messageObject)
        moveScroll()

        socket.emit('sendMessage', messageObject);
    } 
};

function handleToggleLeftBar(){
    const bar = document.querySelector('#left-bar');
    const chat = document.querySelector('#chat-area');
    const icon = document.querySelector('#toggleInfo');

    bar.classList.toggle('active');
    chat.classList.toggle('active');

    icon.className = icon.className === 'fal fa-info-circle' ? 'fal fa-times' : 'fal fa-info-circle';
}
