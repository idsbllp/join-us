// hacked js (删掉一些没用的)
import OrbitControls from './utils/OrbitControls.js'
import Detector from './utils/Detector.js'
import './utils/onEvent.js'
// import './utils/DeviceOrientationControls.js'

import './styles/index.less'
import './img/transparent.png'
import './img/load_effect.png'
import './img/bg_cp.png'

import Ring from './utils/ring.js'
import { RAF, CRAF, getRandomNumber, getRandomColor, $ } from './utils/index.js'
import positionOfBalls from './conf/balls_pos.js'
import ballsIntro from './conf/balls_intro.js'
import './font/HYZhuZiTongNianTiW_Regular.json'

const { PI, cos, sin, random, ceil } = Math
const START_NUM = 200
const { innerWidth, innerHeight, devicePixelRatio } = window
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
        $('.bg').remove()
        canvas.style.opacity = 1
        animate()
    }, 500)
}, false)

// // for test
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
// 手势滑动和定时器
let controls, timer

if (!Detector.webgl) Detector.addGetWebGLMessage()

const addFont = (department, radius, pos, ballName) => {
    new THREE.FontLoader().load('./font/HYZhuZiTongNianTiW_Regular.json', font => {
        let departmentName = new THREE.TextGeometry(ballName, {
            font: font,
            size: 7,
            height: 1,
            curveSegments: 22,
        })
        material = new THREE.MeshPhongMaterial({color: 0xffffff}),
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

function addBalls() {
    // 添加五个球
    positionOfBalls.forEach((value, index) => {
        console.log(index, new Date())
        let { pic, radius, seg, material, pos, ballName } = value
        let map = new THREE.TextureLoader().load(pic)
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16

        if (index === 3) {
            material = new THREE.MeshLambertMaterial({ color: 0x3978ef, map: map, side: THREE.DoubleSide })
        } else {
            material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
        }

        object = new THREE.Mesh(new THREE.SphereBufferGeometry(radius, seg, seg), material)

        object.name = `${pic}_ball`
        object.on('click', object => {
            ballIndex = index
            showDetail(index)
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
const createSmallBall = (x, y, z, color) => {
    let geometry = new THREE.SphereGeometry(getRandomNumber(0.5, 0.8))
    let material = new THREE.MeshBasicMaterial({
        color: color
    })
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
    camera.position.set(0, 0, innerWidth > innerHeight ? innerHeight/1.5 : innerWidth/1.5)
    camera.lookAt(new THREE.Vector3(0,0,0))

    // 给小球添加点击事件
    THREE.onEvent(scene, camera, canvas)

    // 开灯 亮度
    scene.add(new THREE.AmbientLight(0x404040))
    light = new THREE.DirectionalLight(0x4ab0c7, 1.7)
    light.position.set(1, 0, 1)

    scene.add(light)

    light = new THREE.DirectionalLight(0x7db8c0)
    light.position.set(-1, 0, -1)
    scene.add(light)

    // 背景星星
    // drawStars()
    addBalls()
    // 添加装饰小球

    for (let i = 0; i < 30; i++) {
        let color = random() < 0.5 ? 0x68c3c0 : 0xffffff
        scene.add(createSmallBall(getRandomNumber(0, 150), getRandomNumber(0, 150), getRandomNumber(0, 150), color))
    }
    // 给屏幕添加手指拖动事件
    controls = new OrbitControls(camera, canvas)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.23
    controls.enableZoom = true

    // 陀螺仪, 听说不用了
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
    const { innerWidth, innerHeight } = window
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}
// 点击球弹出详情， done
let ballIndex = 0
const department = $('.department')

function showDetail(index = 5, direction) {
    CRAF(timer)
    if (index < 0 || index >= 5) {
        return
    }
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
const hiddenDepartment = e => {
    let classList = e.target.classList

    if (classList.contains('department') || classList.contains('round-inner') || classList.contains('round-outer')) {
        animate()
        $('.department').classList.add('linearOut')
        setTimeout(() => {
            $('.department').classList.remove('linearOut')
            $('.department').style.display = 'none'
        }, 900)
    }
}

$('.department').addEventListener('click', hiddenDepartment)
$('.round-inner').addEventListener('click', hiddenDepartment)
$('.round-outer').addEventListener('click', hiddenDepartment)

function animate() {
    timer = RAF(animate)
    controls.update()
    selfRotate()
    // ring.moveWaves()
    renderer.render(scene, camera)
}

// 相机位置理解: http://www.cnblogs.com/v-weiwang/p/6072235.html
function selfRotate() {
    let rotate = 0.0014

    for (let i = 0, l = scene.children.length; i < l; i ++) {
        let object = scene.children[i]
        // 自转
        if (!object.name) continue
        object.rotation.x += rotate
        object.rotation.y += rotate
        object.rotation.z += rotate
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
