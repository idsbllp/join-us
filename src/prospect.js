import './utils/music.js'
import { $, getRandomNumber, loadpic, loadJS } from './utils/index.js'

import './mp3/music.mp3'
import './font/go.otf'

import './img/prospect.png'
import './img/redrock.png'
import './img/down.png'
import './img/bg.png'
import './img/load_effect.png'

const loadingTime = 5000
// loading
setTimeout(() => {
    $('.loading-effect').style.opacity = 1
    $('.bg').style.backgroundImage = 'url(./img/bg.png)'
}, 4000)

// 前景
const door = $('.door')

setTimeout(() => {
    door.classList.add('easeIn')
    $('#loading').remove()
    // document.body.style.background = '#0f0f18'
}, loadingTime)

setTimeout(() => {
    door.remove()
}, loadingTime+6500)

// 消息
const messages = $('.message p')

setTimeout(() => {
    [$('.logo'), $('.down'), $('.title')].forEach((val, idx) => {
        val.style.opacity = 1
        if (idx === 1) {
            val.classList.add('fideInOut')
        }
    })
}, loadingTime+13500)
