import './utils/music.js'
import loadpic from './utils/loadpic.js'
import { $ } from './utils/index.js'

const door = $('.door')

// 门
loadpic('../img/png/prospect.png')

door.classList.add('easeIn')
setTimeout(() => {
    door.classList.add('none')
}, 6000)

// 消息
const messages = $('.message p')

setTimeout(() => {
    [messages[4], messages[5], $('.logo'), $('.down')].forEach((val, idx) => {
        val.style.opacity = 1
        if (idx === 3) {
            val.classList.add('fideInOut')
        }
        if (idx === 2) {
            // val.classList.add('fidein')
        }
    })
}, 12500)

$('.redrock').addEventListener('click', e => {
    const prospect = $('.prospect')
    prospect.style.opacity = 0
    setTimeout(() => {
        $('.prospect').remove()
        $('#canvas').style.opacity = 1
    }, 900)
})
