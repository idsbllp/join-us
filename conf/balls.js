const pics = ['./img/asd.jpg', './img/q.jpg', './img/bg.jpg', './img/bl.png', './img/sea.jpg']
// 左下角， 中间
const theta = Math.PI / 4

// w = 375
const w = window.innerWidth
// h = 667
const h = window.innerHeight

// 选取小的一个作为单位
const per = (h > w ? w : h) / 375

const radius = [per*17, per*10, per*7, per*20, per*30]

// 球的位置: y 应该为0，在同一水平面
const ballPos = [
    [-25*per, -40*per, 70*per],
    [-50*per, 0, 0],
    [0, 0, 0],
    [40*per, 60*per, -130*per],
    [80*per, 0, -100*per]
]

function getPos() {
    let pos = []
    for (var i = 0; i < 5; i++) {
        pos.push({
            pic: pics[i],
            pos: ballPos[i],
            radius: radius[i]
        })
    }
    return pos
}

export default getPos()

