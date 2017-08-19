import './utils/music.js'
import loadpic from './utils/loadpic.js'
import { $ } from './utils/index.js'
// const prospect = $('.prospect')
const door = $('.door')
// const pause = $('.pause')

// console.log(new Date().getTime())

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
    $('.prospect').remove()
    $('#canvas').style.opacity = 1
})
