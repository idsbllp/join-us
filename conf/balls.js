// const pics = ['asd.jpg', 'q.jpg', 'bg.jpg', 'bl.png', 'dd.jpg']

// function getPos() {
//     let perimeter = Math.PI * 2
//     let per = perimeter / 5

//     let pos = []
//     for (var i = 5; i > 0; i--) {
//         pos.push({
//             pic: pics[i-1],
//             pos: [100 * Math.cos(per*i), 0, 100 * Math.sin(per*i)]
//         })
//     }
//     return pos
// }

// export default getPos()


const pics = ['./img/asd.jpg', './img/q.jpg', './img/bg.jpg', './img/bl.png', './img/dd.jpg']
// 左下角， 中间
const theta = Math.PI / 4

// w = 375
const w = window.innerWidth
// h = 667
const h = window.innerHeight

// 选取小的一个作为单位
const per = (h > w ? w : h) / 375

const radius = [per*17, per*10, per*7, per*20, per*20]

// 球的位置: y 应该为0，在同一水平面
const ballPos = [
    [-25*per, -40*per, 70*per],
    [-50*per, 0, 0],
    [0, 0, 0],
    [40*per, 60*per, -130*per],
    [80*per, 0, -100*per]
]

function getPos() {
    let perimeter = Math.PI * 2
    let per = perimeter / 5

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

