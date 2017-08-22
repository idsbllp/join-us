import './utils/music.js'
import { $, getRandomNumber, loadpic } from './utils/index.js'

import './styles/index.less'
import './img/prospect.png'
import './img/redrock.png'
import './img/down.png'

// const door = $('.door')
const line = $('.line')

// 门
// door.classList.add('easeIn')
setTimeout(() => {
    $('.door').classList.add('none')
}, 6000)
line.classList.add('fly')
let timer = setInterval(() => {
    line.style.top = `${getRandomNumber(0, 200)}px`
}, 1400)

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
        clearInterval(timer)
        $('.prospect').remove()
        $('#canvas').style.display = 'block'
        $('#canvas').style.opacity = 1
    }, 900)
})
