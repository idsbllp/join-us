// 避免小黑框
// $(window).on('scroll.elasticity', (e) => {
//     e.preventDefault()
// }).on('touchmove.elasticity', (e) => {
//     e.preventDefault()
// })

import 'three-onevent'
import positionOfBalls from './conf/balls.js'
import { RAF, CRAF } from './utils/index.js'

const { PI, cos, sin, random } = Math

if ( !Detector.webgl ) Detector.addGetWebGLMessage()

// 帧
let stats
// 三要素
let container, camera, scene, renderer
// scene 里面的内容
let light, object, circle

// controls
let controls
// 定时器
let timer = null


function init() {
    container = document.createElement( 'div' )
    document.body.appendChild( container )
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 )

    camera.position.y = 400
    scene = new THREE.Scene()
    // scene.add(WebVR.Camera)
    THREE.onEvent(scene, camera)

    // 开灯 亮度
    scene.add( new THREE.AmbientLight( 0x404040 ) )

    light = new THREE.DirectionalLight( 0xffffff )
    // 应该就是从y轴看
    light.position.set( 0, -1, 0 )
    scene.add( light )

    light = new THREE.DirectionalLight( 0xffffff )
    light.position.set( 0, 1, 0 )
    scene.add( light )

    positionOfBalls.forEach((value, index) => {
        let map = new THREE.TextureLoader().load( value.pic )
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.anisotropy = 16
        let material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } )

        object = new THREE.Mesh( new THREE.SphereGeometry( 15, 75, 75 ), material )
        // 左右, 上下, 斜的？？？？
        object.position.set( value.pos[0], value.pos[1], value.pos[2] )
        object.name = value.pic
        object.on('click', function(e) {
            console.log(`你点击了第${index}个球： ${value.pic}`)
            showDetail(index)
        })
        scene.add( object )
        // controls = new THREE.OrbitControls( object )

        // 球周围的圆
        circle = new THREE.Mesh( new THREE.TorusGeometry(30, 1, 5, 60), material )
        circle.position.set( value.pos[0], value.pos[1], value.pos[2] )
        scene.add( circle )

    })

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } )
    renderer.setPixelRatio( window.devicePixelRatio )
    renderer.setSize( window.innerWidth, window.innerHeight )

    renderer.setClearColor(0xffffff, 0)

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
    stats.update()
    moveBody()
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
    let rotate = 0.03
    camera.position.x = cameraPos.x
    camera.position.y = cameraPos.y
    camera.position.z = cameraPos.z
    // controls.update();
    camera.lookAt({ x:0, y:0, z:0 })

    for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
        let object = scene.children[i]
        // 自旋
        object.rotation.x += rotate
        object.rotation.y += rotate
        object.rotation.z += rotate

        if (test < 20 && i == 3) {
            test++
            // console.log(object.position, camera.position)
        }
    }
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

window.addEventListener('touchstart', e => {
    // CRAF(timer)
    let { clientX, clientY } = e.changedTouches[0]
    if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
        return
    }
    startPos.x = clientX
    startPos.y = clientY
})

window.addEventListener('touchmove', e => {
    let { clientX, clientY } = e.changedTouches[0]
    if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
        return
    }

    clientX -= startPos.x
    clientY -= startPos.y

    // moveBody({ clientX, clientY })

})

init()
animate()

export default 'llp'

