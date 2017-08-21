import { loadpic } from '../utils/index.js'

import '../img/ball1.jpg'
import '../img/ball2.jpg'
import '../img/ball3.jpg'
import '../img/ball4.jpg'
import '../img/ball5.jpg'

const pics = ['./img/ball1.jpg', './img/ball2.jpg', './img/ball3.jpg', './img/ball4.jpg', './img/ball5.jpg']

// 左下角， 中间
const theta = Math.PI / 4

// w = 375
const w = window.innerWidth
// h = 667
const h = window.innerHeight

// 选取小的一个作为单位
const per = (h > w ? w : h) / 375

// 球半径
const radius = [per*17, per*10, per*14, per*20, per*30]

// 球的分段数
const seg = [20, 20, 12, 8, 9]

// 球的位置: y为0则在同一水平面
const ballPos = [
    [-25*per, -40*per, 70*per],
    [-50*per, 0, 0],
    [0, 0, 0],
    [40*per, 60*per, -130*per],
    [80*per, 0, -100*per]
]

const getPos = () => {
    let pos = []
    for (var i = 0; i < 5; i++) {
        pos.push({
            pic: pics[i],
            pos: ballPos[i],
            seg: seg[i],
            radius: radius[i]
        })
    }
    return pos
}

export default getPos()

