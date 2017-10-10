import './utils/music.js'
import { $, getRandomNumber, loadpic, loadJS } from './utils/index.js'

import './mp3/music.mp3'
import './font/go.otf'

import './img/prospect.png'
import './img/redrock.png'
import './img/down.png'
import './img/bg.png'
import './img/enroll.png'
import './img/load_effect.png'

const bg = new Image()
bg.src = './img/bg.png'
bg.addEventListener('load', e => {
    $('.bg').style.backgroundImage = 'url(./img/bg.png)'
})

const loadingTime = 4000 
// loading 
setTimeout(() => {
    $('.loading-effect').style.opacity = 1
}, loadingTime-1000)

// 前景
const door = $('.door')

setTimeout(() => {
    door.classList.add('easeIn')
    $('#loading').remove()
}, loadingTime-300)

setTimeout(() => {
    door.remove()
}, loadingTime+6500)

// 消息
const messages = $('.message p')

setTimeout(() => {
    [$('.logo'), $('.down'), $('.title'), $('.redrock')].forEach((val, idx) => {
        val.style.opacity = 1
        if (idx === 1) {
            val.classList.add('fideInOut')
        }
    })
}, loadingTime+10500)
