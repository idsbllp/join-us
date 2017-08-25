import './utils/music.js'
import { $, getRandomNumber, loadpic, loadJS } from './utils/index.js'

import './styles/index.less'
import './mp3/music.mp3'
import './font/go.otf'

import './img/prospect.png'
import './img/redrock.png'
import './img/down.png'
import './img/load_effect.png'

// loding
const loadingTime = 5000
// loading
setTimeout(() => {
    $('.loading-effect').style.opacity = 1
}, 2000)

// 前景
const door = $('.door')

setTimeout(() => {
    door.classList.add('easeIn')
    $('#loading').remove();
}, loadingTime)

setTimeout(() => {
    // loadJS('./js/app.js')
}, loadingTime+1000)

setTimeout(() => {
    door.remove()
}, loadingTime+6000)

// 消息
const messages = $('.message p')

setTimeout(() => {
    [messages[4], messages[5], $('.logo'), $('.down')].forEach((val, idx) => {
        val.style.opacity = 1
        if (idx === 3) {
            val.classList.add('fideInOut')
        }
    })
}, loadingTime+13000)

// e 😄
// loadJS('./app.js')