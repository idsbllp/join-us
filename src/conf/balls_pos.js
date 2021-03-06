import { loadpic } from '../utils/index.js'

import '../img/ball1.jpg'
import '../img/ball2.jpg'
import '../img/ball3.jpg'
import '../img/ball4.jpg'
import '../img/ball5.jpg'

import '../img/ball12.jpg'
import '../img/ball22.jpg'
import '../img/ball32.jpg'
import '../img/ball42.jpg'
import '../img/ball52.jpg'

import '../img/ball7.jpg'

let pics = ['./img/ball1.jpg', './img/ball2.jpg', './img/ball3.jpg', './img/ball4.jpg', './img/ball5.jpg']

const query = location.search
if (/ref=.*activity/.test(query)) {
    pics = ['./img/ball12.jpg', './img/ball22.jpg', './img/ball32.jpg', './img/ball42.jpg', './img/ball52.jpg']
}

// 左下角， 中间 
const theta = Math.PI / 4

// w = 375 
const w = window.innerWidth
// h = 667 
const h = window.innerHeight

// 选取小的一个作为单位 
const per = (h > w ? w : h) / 375

// 球半径 
const radius = [per*17, per*25, per*17, per*20, per*30]

// 球的分段数 
const seg = [20, 20, 20, 20, 20]

// 球的名字 
const ballName = ['运维安全部', '移动开发部', '视觉设计部', 'WEB研发部', '产品策划及运营部']

// 名字的颜色 
const color = []

// 球的位置: y为0则在同一水平面 
const ballPos = [
    [-25*per, -40*per, 70*per],
    [-50*per, 0, 0],
    // [0, 0, 0],
    [10*per, -10*per, -80*per],
    [40*per, 60*per, -130*per],
    [80*per, 0, -50*per]
]

const getPos = () => {
    let pos = []
    for (var i = 0; i < 5; i++) {
        pos.push({
            pic: pics[i],
            pos: ballPos[i],
            seg: seg[i],
            ballName: ballName[i],
            radius: radius[i]
        })
    }
    return pos
}

export default getPos()

