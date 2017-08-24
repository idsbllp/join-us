import './utils/music.js'
import { $, getRandomNumber, loadpic } from './utils/index.js'

import './styles/index.less'

import './img/prospect.png'
import './img/redrock.png'
import './img/down.png'

// const line = $('.line')

// 门
setTimeout(() => {
    $('.door').remove()
}, 6000)

// 消息
const messages = $('.message p')

setTimeout(() => {
    [messages[4], messages[5], $('.logo'), $('.down')].forEach((val, idx) => {
        val.style.opacity = 1
        if (idx === 3) {
            val.classList.add('fideInOut')
        }
    })
}, 13000)

