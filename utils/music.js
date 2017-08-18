const music = document.querySelector('#music')
const play = document.querySelector('#play')
const pause = document.querySelector('#pause')

music.addEventListener('error', e => {
    e.preventDefault()
})

pause.addEventListener('click', e => {
    music.pause()
})

play.addEventListener('click', e => {
    music.play()
})

