// 避免小黑框
// $(window).on('scroll.elasticity', (e) => {
//     e.preventDefault()
// }).on('touchmove.elasticity', (e) => {
//     e.preventDefault()
// })

import 'three-onevent'
import positionOfBalls from './conf/balls.js'
import OrbitControls from 'three-orbitcontrols'
import { RAF, CRAF } from './utils/index.js'

const { PI, cos, sin, random, ceil } = Math
const START_NUM = 50
const { innerWidth, innerHeight, devicePixelRatio } = window

// 帧
let stats
// 容器和三要素
let container, camera, scene, renderer
// scene 里面的内容
let light, object, circle, material

// controls
let controls
// 定时器
let timer = null

if ( !Detector.webgl ) Detector.addGetWebGLMessage()

function getRandomNumber(min, max) {
    let randomNum = ceil(random() * max + min)
    return randomNum%2 ? -randomNum : randomNum
}

function getRandomColor() {
    return ceil(random() * 10)%2 ? 0xffffff : 0x85030b
}

function init() {
    container = document.getElementById( 'container' )
    // document.body.appendChild( container )
    scene = new THREE.Scene()

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
    renderer.setPixelRatio( devicePixelRatio )
    renderer.setSize( innerWidth, innerHeight )
    renderer.setClearColor(0xffffff, 0)

    camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 1, 1000 )
    camera.position.x = 0
    camera.position.y = 0
    // 取小的那一个的  2/3
    camera.position.z = innerWidth > innerHeight ? innerHeight/1.5 : innerWidth/1.5

    // 给小球添加点击事件
    THREE.onEvent(scene, camera)

    // 开灯 亮度
    scene.add( new THREE.AmbientLight( 0x404040 ) )
    light = new THREE.DirectionalLight( 0xdcc794 )
    light.position.set( 1, 0, 1 )
    scene.add( light )

    // 添加五个球
    positionOfBalls.forEach((value, index) => {
        let map = new THREE.TextureLoader().load( value.pic )
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16
        material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } )

        object = new THREE.Mesh( new THREE.SphereGeometry( value.radius, 75, 75 ), material )
        // 左右, 上下, 斜的？？？？
        console.log(value.pos)
        object.position.set( value.pos[0], value.pos[1], value.pos[2] )
        object.name = `${value.pic}_ball`
        object.on('click', function(e) {
            console.log(`你点击了第${index}个球： ${value.pic}`)
            showDetail(index)
        })
        // 球周围的圆
        circle = new THREE.Mesh( new THREE.TorusGeometry((value.radius+7), 0.4, 5, 60), material )
        circle.position.set( 0,0,0, )
        circle.name = `${value.pic}_circle`
        object.add( circle )
        scene.add( object )

    })
    // 小星星
    for (let i = 0; i < START_NUM; i++) {
        material = new THREE.MeshBasicMaterial( {color: getRandomColor()} )
        object = new THREE.Mesh(new THREE.SphereGeometry( 1, 32, 32 ), material)
        object.position.set(getRandomNumber(0, innerWidth/2), getRandomNumber(0, innerHeight/2), getRandomNumber(0, innerHeight/2))
        scene.add( object )
    }

    // 给屏幕添加手指拖动事件
    controls = new OrbitControls( camera, renderer.domElement, scene.children[2] );
    controls.addEventListener( 'change', render );
    controls.enableZoom = false;

    container.appendChild( renderer.domElement )

    stats = new Stats()
    container.appendChild( stats.dom )

    window.addEventListener( 'resize', onWindowResize, false )
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( window.innerWidth, window.innerHeight )
}
function showDetail(index = 5) {
    // console.log(index)
    if (0 < index >= 5) {
        return
    }
}
function animate() {
    timer = RAF(animate)
    controls.update()
    stats.update()
    // moveBody()
    render()
}

var test = 1

const cameraPos = {
    x: 300,
    y: 400,
    z: 300
}
const startPos = {
    x: 0,
    y: 0
}
let cameraRotate = 0
// http://www.cnblogs.com/v-weiwang/p/6072235.html
function render() {
    // let rotate = 0.004
    // 1 / 360 /2 2 (0.5度)
    let rotate = 0.0028 / 2
    let perimeter = Math.PI * 2
    let per = perimeter / 5
    // camera.position.x = cameraPos.x
    // camera.position.y = cameraPos.y
    // camera.position.z = cameraPos.z
    // controls.update();
    camera.lookAt({ x:0, y:0, z:0 })

    for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
        let object = scene.children[i]
        // 自旋
        object.rotation.x += rotate
        object.rotation.y += rotate
        object.rotation.z += rotate
        // 公转
        if (object.name && test < 20) {
            // test++
            // console.log(object.position.x)
            // object.position.x = 100 * cos(object.rotation.x+per*i)
            // object.position.z = 100 * sin(object.rotation.x+per*i)
        }

        if (test < 4) {
            test++
            // console.log(scene.children)
            // console.log(object.position, camera.position)
        }
    }
    // positionOfBalls.forEach((value, index) => {
    //     object.position.x = 100 * cos(Math.PI * 2.5*i)
    //     object.position.z = 100 * sin(Math.PI * 2.5*i)
    // })
    // 自行转动，绕y轴转动，y轴垂直向上
    cameraRotate -= 0.005
    // cameraPos.x = 300 * cos(cameraRotate)
    // cameraPos.z = 300 * sin(cameraRotate)

    renderer.render( scene, camera )
    // new THREE.OrbitControls(camera)
}
// 手动转动
function moveBody(rotation = { clientX: 0, clientY: cameraPos.y }) {
    const { innerWidth, innerHeight } = window
    let moveHeight = rotation.clientY / 20
    if (Math.abs(cameraPos.y+moveHeight) > innerHeight) {
        return
    }
    cameraPos.y += moveHeight
    // console.log(cameraPos.y)

    renderer.render( scene, camera )
}

// window.addEventListener('touchstart', e => {
//     // CRAF(timer)
//     let { clientX, clientY } = e.changedTouches[0]
//     if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
//         return
//     }
//     startPos.x = clientX
//     startPos.y = clientY
// })

// window.addEventListener('touchmove', e => {
//     let { clientX, clientY } = e.changedTouches[0]
//     if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
//         return
//     }

//     clientX -= startPos.x
//     clientY -= startPos.y

//     // moveBody({ clientX, clientY })

// })

init()
render();
animate()

export default 'llp'

