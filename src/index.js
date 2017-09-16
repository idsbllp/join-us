// hacked js (删掉一些没用的)
import OrbitControls from './utils/OrbitControls.js'
import Detector from './utils/Detector.js'
import './utils/onEvent.js'
import './utils/DeviceOrientationControls.js'

import './styles/index.less'
import './img/load_effect.png'
import './img/bg_cp.png'

import Ring from './utils/ring.js'
import { RAF, CRAF, getRandomNumber, getRandomColor, $ } from './utils/index.js'
import positionOfBalls from './conf/balls_pos.js'
import ballsIntro from './conf/balls_intro.js'
import './font/HYZhuZiTongNianTiW_Regular.json'

const { PI, cos, sin, random, ceil, abs, sqrt } = Math
const START_NUM = 200
let { innerWidth, innerHeight, devicePixelRatio } = window
const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight

// 点击按钮载入canvas
$('.redrock').addEventListener('click', e => {
    const prospect = $('.prospect')
    prospect.style.opacity = 0
    canvas.classList.add('canvas')
    document.body.appendChild(canvas)
    
    setTimeout(() => {
        prospect.remove()
        $('.bg').style.backgroundImage = 'url(./img/bg_cp.png)'
        $('.enroll').style.display = 'block'
        canvas.style.opacity = 1
        animate()
    }, 500)
}, false)

// // for dev
// canvas.classList.add('canvas')
// $('.bg').style.backgroundImage = 'url(./img/bg_cp.png)'
// document.body.appendChild(canvas)
// canvas.style.opacity = 1
// setTimeout(() => {
//     animate()
// })

// 为了让 IOS 能变得可点击
canvas.addEventListener('click', e => {})

// 帧
let stats
// 容器和三要素
let container, camera, scene, renderer
// scene 里面的内容
let light, object, circle, material, geometry, mesh, ring
// 手势滑动和定时器, 部门详情定时器
let controls, timer, detialTimer

if (!Detector.webgl) Detector.addGetWebGLMessage()

const addFont = (department, radius, pos, ballName) => {
    new THREE.FontLoader().load('./font/HYZhuZiTongNianTiW_Regular.json', font => {
        let departmentName = new THREE.TextGeometry(ballName, {
            font: font,
            size: 6,
            height: 1,
            curveSegments: 22,
        })
        material = new THREE.MeshPhongMaterial({color: 0xf5e5bc}),
        object = new THREE.Mesh(departmentName, material)
        object.position.set(pos[0]-radius, pos[1]+radius+5, pos[2])
        scene.add(object)
    })
}
function CustomSinCurve(scale) {
    THREE.Curve.call(this)
}
CustomSinCurve.prototype = Object.create(THREE.Curve.prototype)
CustomSinCurve.prototype.constructor = CustomSinCurve

CustomSinCurve.prototype.getPoint = function (t) {
    return new THREE.Vector3(t, t, t)
};

// 添加五个球
const addBalls = () => {
    positionOfBalls.forEach((value, index) => {
        let { pic, radius, seg, material, pos, ballName } = value
        let map = new THREE.TextureLoader().load(pic)
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16

        if (index === 3) {
            material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
        } else {
            material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
        }

        object = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, seg, seg), material)

        object.name = `${pic}_ball`
        object.on('click', object => {
            CRAF(timer)
            ballIndex = index
            showDetail(index, '', object)
        })
        // 左右, 上下, 斜的？？？？
        object.position.set(pos[0], pos[1], pos[2])

        // // 球周围的圆
        // if (index === 2 || index === 1) {
        //     let path = new CustomSinCurve(20)
        //     for (let i = 0; i < 10; i++) {
        //         geometry = new THREE.TubeGeometry(path, 64, radius+4+i/10, 64, true)
        //         mesh = new THREE.Mesh(geometry, material)
        //         object.add(mesh)
        //     }
        // } else if (index == 0) {
        //     ring = new Ring({
        //         radius: 1,
        //         length: 8,
        //         wavesMinAmp : 5,
        //         wavesMaxAmp : 20,
        //         wavesMinSpeed : 0.001,
        //         wavesMaxSpeed : 0.003
        //     })
        //     object.add(ring.mesh);
        // } else if (index ===3) {

        // } else {
        //     map = new THREE.TextureLoader().load(pic)
        //     material = new THREE.MeshPhongMaterial({
        //         map: map,
        //         transparent: true,
        //         opacity: 1,
        //         shading: THREE.FlatShading
        //     })
        //     circle = new THREE.Mesh(new THREE.CylinderGeometry(radius+5, radius+5, .2, 64, 64), material)
        //     circle.name = `${pic}_circle`
        //     object.add(circle)
        //     // 透明
        //     map = new THREE.TextureLoader().load('./img/transparent.png')
        //     material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
        //     circle = new THREE.Mesh(new THREE.CylinderGeometry(radius+3, radius+3, .2, 64, 64), material)

        //     object.add(circle)
        // }

        addFont(object, radius, pos, ballName)

        scene.add(object)
    })
}

const blueBallImgMap = new THREE.TextureLoader().load('./img/ball1.jpg')
const whiteBallImgMap = new THREE.TextureLoader().load('./img/ball7.jpg')

const createSmallBall = (x, y, z, color) => {
    let geometry = new THREE.SphereGeometry(getRandomNumber(0.3, 0.6))
    let material
    if (color === 0xffffff) {
        material = new THREE.MeshLambertMaterial({color: 0xffffff, map: whiteBallImgMap, side: THREE.DoubleSide })
    } else {
        material = new THREE.MeshLambertMaterial({color: 0xffffff, map: blueBallImgMap, side: THREE.DoubleSide })
    }
    let cube = new THREE.Mesh(geometry, material)
    cube.position.set(x, y, z)
    return cube
}

(function init() {
    scene = new THREE.Scene()

    camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 2000)
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas
    })

    renderer.setPixelRatio(devicePixelRatio)
    renderer.setSize(innerWidth, innerHeight)

    // z 轴取小的那一个的  2/3
    camera.position.set(0, 0, innerWidth > innerHeight ? innerHeight/1.2 : innerWidth/1.2)
    camera.lookAt(new THREE.Vector3(0,0,0))

    // 给小球添加点击事件
    THREE.onEvent(scene, camera, canvas)

    // 开灯 亮度
    scene.add(new THREE.AmbientLight(0xf5e5bc))
    light = new THREE.DirectionalLight(0x000000, 1.7)
    light.position.set(1, 0, 1)

    scene.add(light)

    light = new THREE.DirectionalLight(0x7db8c0)
    light.position.set(-1, 0, -1)
    scene.add(light)

    // 背景星星
    drawStars()
    addBalls()

    // 添加装饰小球
    for (let i = 0; i < 100; i++) {
        let color = random() < 0.5 ? 0x68c3c0 : 0xffffff
        scene.add(createSmallBall(getRandomNumber(0, 150), getRandomNumber(0, 150), getRandomNumber(0, 150), color))
    }
    // 给屏幕添加手指拖动事件
    controls = new OrbitControls(camera, canvas)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.5
    controls.enableZoom = true

    // // 陀螺仪, 不用了
    // function setOrientationControls(e){
    //     console.log(e.alpha)
    //     if (e.alpha) {
    //         controls = new THREE.DeviceOrientationControls(camera, true);
    //         controls.connect();
    //         controls.update();
    //     }
    //     window.removeEventListener('deviceorientation', setOrientationControls, true);
    // }
    // window.addEventListener('deviceorientation', setOrientationControls, true);

    window.addEventListener('resize', onWindowResize, false)
})()

function onWindowResize() {
    innerWidth = window.innerWidth
    innerHeight = window.innerWidth
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}
// 点击球弹出详情， done
let ballIndex = 0
const department = $('.department')

// // 记录点击球时候的位置, 和相机位置，中间位置
// let originPosition = [],
//     endPosition = [],
//     cameraPosition = []

// // 详情球的旋转动画
// const showDetialTAnimate = ball => {
//     detialTimer = RAF(() => {
//         showDetialTAnimate(ball)
//     })
//     rotateDitailBall(ball)
//     renderer.render(scene, camera)
// }
// // 详情球的旋转
// const rotateDitailBall = ball => {
//     let rotate = 0.024 / devicePixelRatio
//     // ball.rotation.set(rotate, rotate, rotate)
//     // console.log(ball.rotation)
//     // ball.rotation.x += rotate/devicePixelRatio
//     ball.rotation.y += rotate/devicePixelRatio
//     // ball.rotation.z += rotate/devicePixelRatio
// }
// // 三个方向到 中点
// let xEnd, yEnd, zEnd, moveScaleBallTimer, perDis
// const moveScaleBallAnimation = (object, originPos, endPos) => {
//     perDis = perDis || endPos.map((val, idx) => Math.abs((val-originPos[idx]) / 45))
//     let [ x, y, z ] = originPos
//     if (abs(endPos[0]-x) <= 1.1*perDis[0]) {
//         xEnd = true
//     } else {
//         endPos[0]>x ? x+=perDis[0] : x-=perDis[0]
//     }

//     if (abs(endPos[1]-y) <= 1.1*perDis[1]) {
//         yEnd = true
//     } else {
//         endPos[1]>y ? y+=perDis[1] : y-=perDis[1]
//     }

//     if (abs(endPos[2]-z) <= 1.1*perDis[2]) {
//         zEnd = true
//     } else {
//         endPos[2]>z ? z+=perDis[2] : z-=perDis[2]
//     }
//     originPos = [ x, y, z ]
//     moveScaleBallTimer = RAF(() => {
//         moveScaleBallAnimation(object, originPos, endPos)
//     })

//     if (xEnd && yEnd && zEnd) {
//         CRAF(moveScaleBallTimer)
//         xEnd = yEnd = zEnd = false
//         perDis = null
//         showDetialTAnimate(object)
//     }

//     renderer.render(scene, camera)
//     object.position.set(x, y, z)
// }
// let isShowing = false, preObject

function showDetail(index = 5, direction, object) {
    CRAF(timer)
    if (index < 0 || index >= 5) {
        return
    }

    // // 点击放大效果
    // if (isShowing && preObject) {
    //     let [x, y, z] = originPosition
    //     preObject.position.set(x, y, z)
    // }
    // // object = object || scene.getObjectByName(`./img/ball${index+1}.jpg_ball`, true)
    // // preObject = object
    // // // 记录点击球时候的位置
    // // var { x, y, z } = object.position
    // // originPosition = [x, y, z]

    // // // 相机的位置
    // // var { x, y, z } = camera.position
    // // cameraPosition = [x, y, z]
    // // // 相机到原点的距离
    // // const cameraDis = sqrt(cameraPosition.reduce((sum, val) => {
    // //     return sum + val*val
    // // }, 0))
    // // // 球的终点距离dis = 相机的终点距离减掉一段距离 (radius*4/(innerWidth/375)), 距离比例, 球的终点
    // // const dis = cameraDis - positionOfBalls[index].radius*4 / (innerWidth/375),
    // //     disScale = dis / cameraDis

    // // // 球的终点位置
    // // endPosition = cameraPosition.map(val => disScale*val)

    // // moveScaleBallAnimation(object, originPosition, endPosition)

    // // isShowing = true


    const ballIntro = ballsIntro[index]
    $('.department').style.display = 'block'
    // 之前的 departmentCon 和复制
    const departmentCon = $('.department-con')

    let intro = `
        <div class="department-active">
            <p class="department-title"> ${ballIntro.name} </p>
            <p class="department-intro"> ${ballIntro.intro[0]} </p>
            <p class="department-intro"> ${ballIntro.intro[1]} </p>
            <p class="department-intro"> ${ballIntro.intro[2]} </p>
            <div class="department-logo ${ballIntro.logo}"></div>
        </div>
    `

    // 如果是点球进来进来
    if (!direction) {
        departmentCon.innerHTML = intro
        $('.department').classList.add('linearIn')
        setTimeout(() => {
            $('.department').classList.remove('linearIn')
        }, 900)
        return
    }
    // 如果上一个未移除
    if (departmentCon.length >= 2) return

    const departmentCopy = departmentCon.cloneNode(true)

    departmentCon.classList.add(`show-${direction}`)
    // 改变复制的 departmentCon 元素并添加到 原来的位置 中
    departmentCopy.innerHTML = intro
    departmentCopy.classList.add(`show-${direction}-copy`)

    department.insertBefore(departmentCopy, $('.lefthand'))

    // 动画完之后删去原来的 departmentCon
    setTimeout(() => {
        departmentCopy.classList.remove(`show-${direction}-copy`)
        department.removeChild(departmentCon)
    }, 900)
}
$('.righthand').addEventListener('click', e => {
    ballIndex++
    if (ballIndex >= 5) {
        ballIndex = 0
    }
    showDetail(ballIndex, 'right')
})
$('.lefthand').addEventListener('click', e => {
    ballIndex--
    if (ballIndex < 0) {
        ballIndex = 4
    }
    showDetail(ballIndex, 'left')
})
const hidDepartment = e => {
    let classList = e.target.classList

    if (classList.contains('department') || classList.contains('round-inner') || classList.contains('round-outer')) {
        // CRAF(detialTimer)

        $('.department').classList.add('linearOut')
        // isShowing = false
        // object = scene.getObjectByName(`./img/ball${ballIndex+1}.jpg_ball`, true)
        // moveScaleBallAnimation(object, endPosition, originPosition)
        setTimeout(() => {
            CRAF(timer)
            animate()
            $('.department').classList.remove('linearOut')
            $('.department').style.display = 'none'
        }, 900)
    }
}

$('.department').addEventListener('click', hidDepartment)
$('.round-inner').addEventListener('click', hidDepartment)
$('.round-outer').addEventListener('click', hidDepartment)

const animate = () => {
    timer = RAF(animate)
    controls.update()
    selfRotate()
    renderer.render(scene, camera)
}

// 相机位置理解: http://www.cnblogs.com/v-weiwang/p/6072235.html
const selfRotate = () => {
    let rotate = 0.0114
    for (let i = 0, l = scene.children.length; i < l; i ++) {
        let object = scene.children[i]
        // 自转
        if (!object.name) continue
        object.rotation.x += rotate/devicePixelRatio
        object.rotation.y += rotate/devicePixelRatio
        object.rotation.z += rotate/devicePixelRatio
    }
}

function drawStars() {
    // http://test.nie.163.com/test_html/test/test/test_vr_20161130
    // 背景星星
    let particles = 8000  // 星星数量
    // buffer做星星
    let bufferGeometry = new THREE.BufferGeometry()

    // 32位浮点整形数组
    let positions = new Float32Array(particles * 3)
    let colors = new Float32Array(particles * 3)

    let color = new THREE.Color()

    let gap = 1000 // 定义星星的最近出现位置

    for (let i = 0; i < positions.length; i += 3) {
        /*-2gap < x < 2gap */
        let x = (Math.random() * gap *2)* (Math.random()<.5? -1 : 1)
        let y = (Math.random() * gap *2)* (Math.random()<.5? -1 : 1)
        let z = (Math.random() * gap *2)* (Math.random()<.5? -1 : 1)

        /*找出x,y,z中绝对值最大的一个数*/
        let biggest = Math.abs(x) > Math.abs(y) ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z') : (Math.abs(y) > Math.abs(z) ? 'y' : 'z')

        let pos = { x: x, y: y, z: z}

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap

        x = pos['x']
        y = pos['y']
        z = pos['z']

        positions[i]     = x
        positions[i + 1] = y
        positions[i + 2] = z

        /*70%星星有颜色*/
        let hasColor = Math.random() > 0.3
        let vx, vy, vz

        if (hasColor) {
            vx = (Math.random()+1) / 2 
            vy = (Math.random()+1) / 2 
            vz = (Math.random()+1) / 2 
        } else {
            vx = 1 
            vy = 1 
            vz = 1 
        }

        color.setRGB(vx, vy, vz)

        colors[i]     = color.r
        colors[i + 1] = color.g
        colors[i + 2] = color.b

    }

    bufferGeometry.addAttribute('position', new THREE.BufferAttribute(positions, 3))
    bufferGeometry.addAttribute('color', new THREE.BufferAttribute(colors, 3))
    bufferGeometry.computeBoundingSphere()

    /*星星的material*/
    let material = new THREE.PointsMaterial({ size: 6, vertexColors: THREE.VertexColors })
    let particleSystem = new THREE.Points(bufferGeometry, material)
    scene.add(particleSystem)
}

export default 'idsbllp'
