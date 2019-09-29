const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form') 
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix: true})
const autoscrool = () =>{
    //New Message element
    const $newMessage = $messages.lastElementChild
    //Height of the new message
    
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight

    //visble height
    const visibleHeight = $messages.offsetHeight
    //height of messages container
    const containerHeight = $messages.scrollHeight

    //how far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message) =>{
        console.log(message)
        const html = Mustache.render(messageTemplate, {   
            username: message.username,
            message: message.text,
            createdAt: moment(message.createdAt).format('h:mm:ss a')
        })
        $messages.insertAdjacentHTML('beforeend',html)
        autoscrool()
    })

socket.on('locationMessage', (message) =>{
    console.log(message)
    const location = Mustache.render(locationMessageTemplate, {
        username: message.username,
        url: message.url,
        createdAt: moment(message.createdAt).format('h:mm:ss a')
    })
    $messages.insertAdjacentHTML('beforeend', location)
    autoscrool()
})

socket.on('roomData', ({room, users}) =>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


// document.querySelector('#message-form').addEventListener('submit', (e) =>{
//     e.preventDefault()
//     console.log("blah:",e)
//     // const message = document.querySelector('input').value
//     // const message = e.target.elements.message.value
//     // socket.emit('sendMessage', message)
// }
// )



$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    // console.log(e)
    //disable
    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = e.target.elements.message.value
    // const message = document.querySelector('input').value
    socket.emit('sendMessage', message, (error) => {
    //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if(error) {
            return console.log(error)
        }
        console.log('Message delivered!')
    })
})



$sendLocationButton.addEventListener('click', () =>{
    if(!navigator.geolocation){
        return alert('Geolocation is not support by your browser')
    }
    $sendLocationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(`lat ${lat} and long ${long}`)
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, (messsage) => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Delivered!', messsage)
        })
    })
})

socket.emit('join', {username, room}, (error) =>{
    if(error) {
        alert(error)
        location.href = '/'
    }

})