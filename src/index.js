import 'three-onevent'
import OrbitControls from './utils/OrbitControls.js'
import Detector from './utils/Detector.js'
import './utils/DeviceOrientationControls.js'

import './img/transparent.png'

import Ring from './utils/ring.js'
import { RAF, CRAF, getRandomNumber, getRandomColor, $ } from './utils/index.js'
import positionOfBalls from './conf/balls_pos.js'
import ballsIntro from './conf/balls_intro.js'

const { PI, cos, sin, random, ceil } = Math
const START_NUM = 200
const { innerWidth, innerHeight, devicePixelRatio } = window
const canvas = document.createElement('canvas')
canvas.width = innerWidth
canvas.height = innerHeight

import './img/bg_cp.png'

// 点击按钮载入canvas
$('.redrock').addEventListener('click', e => {
    const prospect = $('.prospect')
    prospect.style.opacity = 0
    canvas.classList.add('canvas')
    setTimeout(() => {
        clearInterval(timer)
        $('.prospect').remove()
        $('.bg').style.backgroundImage = 'url(./img/bg_cp.png)'
        // 为了点击 redrock 时不点击球
        addBalls()
        document.body.appendChild(canvas)
        canvas.style.opacity = 1
    }, 900)
}, false)

// 为了让垃圾 IOS 能变得可点击
canvas.addEventListener('click', e => {})

// 帧
let stats
// 容器和三要素
let container, camera, scene, renderer
// scene 里面的内容
let light, object, circle, material, ring

// controls
let controls
// 定时器
let timer = null

if (!Detector.webgl) Detector.addGetWebGLMessage()

function addBalls() {
    // 添加五个球
    positionOfBalls.forEach((value, index) => {
        let map = new THREE.TextureLoader().load(value.pic)
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16
        if (index === 3) {
            material = new THREE.MeshLambertMaterial({ color: 0x3978ef, map: map, side: THREE.DoubleSide })
        } else {
            material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
        }

        object = new THREE.Mesh(new THREE.SphereBufferGeometry(value.radius, value.seg, value.seg), material)

        object.name = `${value.pic}_ball`
        object.on('click', object => {
            showDetail(index)
        })
        // 左右, 上下, 斜的？？？？
        object.position.set(value.pos[0], value.pos[1], value.pos[2])

        // 球周围的圆
        if (index === 2 || index === 1) {
            function CustomSinCurve(scale) {
                THREE.Curve.call(this)
            }
            CustomSinCurve.prototype = Object.create(THREE.Curve.prototype)
            CustomSinCurve.prototype.constructor = CustomSinCurve

            CustomSinCurve.prototype.getPoint = function (t) {
                return new THREE.Vector3(t, t, t)
            };

            let path = new CustomSinCurve(20)
            let geometry, mesh
            for (let i = 0; i < 20; i++) {
                geometry = new THREE.TubeGeometry(path, 64, value.radius+4+i/10, 64, true)
                mesh = new THREE.Mesh(geometry, material)
                object.add(mesh)
            }
        } else if (index == 0) {
            ring = new Ring({
                radius: 1,
                length: 8,
                wavesMinAmp : 5,
                wavesMaxAmp : 20,
                wavesMinSpeed : 0.001,
                wavesMaxSpeed : 0.003
            })
            object.add(ring.mesh);
        } else if (index ===3) {

        } else {
            map = new THREE.TextureLoader().load(value.pic)
            material = new THREE.MeshPhongMaterial({
                map: map,
                transparent: true,
                opacity: 1,
                shading: THREE.FlatShading
            })
            circle = new THREE.Mesh(new THREE.CylinderGeometry(value.radius+5, value.radius+5, .2, 64, 64), material)
            circle.name = `${value.pic}_circle`
            object.add(circle)
            // 透明
            map = new THREE.TextureLoader().load('./img/transparent.png')
            material = new THREE.MeshLambertMaterial({ map: map, side: THREE.DoubleSide })
            circle = new THREE.Mesh(new THREE.CylinderGeometry(value.radius+3, value.radius+3, .2, 64, 64), material)

            object.add(circle)
        }
        scene.add(object)
    })
}

function init() {
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
    THREE.onEvent(scene, camera)

    // 开灯 亮度
    // scene.add(new THREE.AmbientLight(0x404040))
    light = new THREE.DirectionalLight(0xdcc794, 1.7)
    light.position.set(1, 0, 1)

    scene.add(light)

    light = new THREE.DirectionalLight(0x9e9681)
    light.position.set(-1, 0, -1)
    scene.add(light)
    
    // 背景星星
    drawStars()

    // 添加装饰小球

    const createSmallBall = (x, y, z, color) => {
        let geometry = new THREE.SphereGeometry(1.4)
        let material = new THREE.MeshBasicMaterial({
            color: color
        })
        let cube = new THREE.Mesh(geometry, material)
        cube.position.set(x, y, z)
        return cube
    }

    scene.add(createSmallBall(45, 12, -87, 0xffffff))
    scene.add(createSmallBall(76, 54, 46, 0x68c3c0))
    scene.add(createSmallBall(-10, -75, 12, 0x68c3c0))
    scene.add(createSmallBall(85, 83, -18, 0x68c3c0))
    scene.add(createSmallBall(29, -93, 69, 0x68c3c0))
    scene.add(createSmallBall(-126, 92, 72, 0xffffff))
    scene.add(createSmallBall(-96, 122, -123, 0xffffff))
    scene.add(createSmallBall(-106, 352, 42, 0xffffff))
    scene.add(createSmallBall(-174, 102, 122, 0xffffff))

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
}

function onWindowResize() {
    const { innerWidth, innerHeight } = window
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
}
// 点击球弹出详情， done
let ballIndex = 0
const departmentCon = $('.department-con')
const departmentIntro = departmentCon.children

function showDetail(index = 5, object) {
    if (index < 0 || index >= 5) {
        return
    }
    const ballIntro = ballsIntro[index]
    $('.department').style.display = 'block'
    let intro = `
        <p class="department-title"> ${ballIntro.name} </p>
        <p class="department-intro"> ${ballIntro.intro[0]} </p>
        <p class="department-intro"> ${ballIntro.intro[1]} </p>
        <p class="department-intro"> ${ballIntro.intro[2]} </p>
        <div class="department-logo ${ballIntro.logo}"></div>
    `
    departmentCon.innerHTML = intro
}
$('.righthand').addEventListener('click', e => {
    ballIndex++
    if (ballIndex >= 5) {
        ballIndex = 0
    }
    showDetail(ballIndex)
})
$('.lefthand').addEventListener('click', e => {
    ballIndex--
    if (ballIndex < 0) {
        ballIndex = 4
    }
    showDetail(ballIndex)
})
const hiddenDepartment = e => {
    let classList = e.target.classList

    if (classList.contains('department') || classList.contains('round-inner') || classList.contains('round-outer')) {
        $('.department').style.display = 'none'
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
    let particles = 2000  // 星星数量
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

init()
animate()

export default 'idsbllp'
