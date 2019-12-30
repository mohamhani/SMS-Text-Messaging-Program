const numberInput = document.getElementById("number");
const textInput = document.getElementById("message");
const button = document.getElementById("button");
const response = document.querySelector(".response");

button.addEventListener('click', send);

const socket = io();
socket.on('smsStatus', function(data){
    response.innerHTML = '<h5> Text message sent to ' + data.number + '</h5>';
})

function send() {
    const number = numberInput.value.replace(/\D/g, '');
    const text = textInput.value;
    console.log(text);

    fetch('/', {
        method: 'post',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({number: number, text: text})
    })
    .then(function(res){
        console.log(res);
    })
    .catch(function(err){
        console.log(err);
    });
}