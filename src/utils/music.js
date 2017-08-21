const music = document.querySelector('#music')
const play = document.querySelector('.play')
const pause = document.querySelector('.pause')

music.addEventListener('error', e => {
    e.preventDefault()
})

pause.addEventListener('click', e => {
    music.play()
    pause.style.display = 'none'
})

play.addEventListener('click', e => {
    music.pause()
    pause.style.display = 'block'
})

