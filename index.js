// 避免 QQ浏览器 下拉出现小黑框
document.addEventListener('touchmove', e => {
    e.preventDefault();
}, false)

import 'three-onevent'
import OrbitControls from './utils/OrbitControls.js'
import Detector from './utils/Detector.js'
import './utils/DeviceOrientationControls.js'

import Ring from './utils/ring.js'
import { RAF, CRAF, getRandomNumber, getRandomColor } from './utils/index.js'
import positionOfBalls from './conf/balls.js'

const { PI, cos, sin, random, ceil } = Math
const START_NUM = 200
const { innerWidth, innerHeight, devicePixelRatio } = window
const canvas = document.querySelector('#canvas')
canvas.width = innerWidth
canvas.height = innerHeight

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

if ( !Detector.webgl ) Detector.addGetWebGLMessage()

function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 1, 2000 )
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas
    })

    renderer.setPixelRatio( devicePixelRatio )
    renderer.setSize( innerWidth, innerHeight )

    // z 轴取小的那一个的  2/3
    camera.position.set(0, 0, innerWidth > innerHeight ? innerHeight/1.5 : innerWidth/1.5)
    camera.lookAt(new THREE.Vector3(0,0,0))

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

        object = new THREE.Mesh( new THREE.SphereBufferGeometry( value.radius, value.seg, value.seg ), material )
        // 左右, 上下, 斜的？？？？
        object.position.set( value.pos[0], value.pos[1], value.pos[2] )
        object.name = `${value.pic}_ball`
        object.on('click', e => {
            console.log(index)
            showDetail(index, object)
        })
        // 球周围的圆
        if (index != 12) {
            circle = new THREE.Mesh( new THREE.TorusGeometry((value.radius+7), 0.4, 5, 60), material )
            circle.position.set( 0,0,0, )
            circle.name = `${value.pic}_circle`
            object.add( circle )
        } else {
            ring = new Ring({
                radius: value.radius-5,
                length: 2,
                wavesMinAmp : 5,
                wavesMaxAmp : 20,
                wavesMinSpeed : 0.001,
                wavesMaxSpeed : 0.003
            })
            ring.mesh.position.y = 0
            object.add(ring.mesh);
        }
        scene.add( object )
    })
    // 背景星星
    drawStars()

    // 给屏幕添加手指拖动事件
    controls = new OrbitControls(camera, canvas)
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.1
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

    window.addEventListener( 'resize', onWindowResize, false )
}

function onWindowResize() {
    const { innerWidth, innerHeight } = window
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize( innerWidth, innerHeight )
}
// 点击球弹出详情， doing
function showDetail(index = 5, object) {
    if (0 < index >= 5) {
        return
    }
    const originalPostion = new THREE.Vector3().copy(camera.position);

    console.log(originalPostion, camera.position, camera.rotation)

}
function animate() {
    timer = RAF(animate)
    controls.update()
    render()
    // ring.moveWaves();
    renderer.render( scene, camera )
}

// 相机位置理解: http://www.cnblogs.com/v-weiwang/p/6072235.html
function render() {
    let rotate = 0.0014

    for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
        let object = scene.children[i]
        // 自旋
        if (!object.name) continue
        object.rotation.x += rotate
        object.rotation.y += rotate
        object.rotation.z += rotate
    }
}

function drawStars() {
    // http://test.nie.163.com/test_html/test/test/test_vr_20161130
    // 背景星星
    let particles = 10000  // 星星数量
    // buffer做星星
    let bufferGeometry = new THREE.BufferGeometry()

    // 32位浮点整形数组
    let positions = new Float32Array( particles * 3 )
    let colors = new Float32Array( particles * 3 )

    let color = new THREE.Color()

    let gap = 1000 // 定义星星的最近出现位置

    for ( let i = 0; i < positions.length; i += 3 ) {
        // positions

        /*-2gap < x < 2gap */
        let x = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1)
        let y = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1)
        let z = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1)

        /*找出x,y,z中绝对值最大的一个数*/
        let biggest = Math.abs(x) > Math.abs(y) ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z') : (Math.abs(y) > Math.abs(z) ? 'y' : 'z')

        let pos = { x: x, y: y, z: z}

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap

        x = pos['x']
        y = pos['y']
        z = pos['z']

        positions[ i ]     = x
        positions[ i + 1 ] = y
        positions[ i + 2 ] = z

        /*70%星星有颜色*/
        let hasColor = Math.random() > 0.3
        let vx, vy, vz

        if(hasColor){
            vx = (Math.random()+1) / 2 
            vy = (Math.random()+1) / 2 
            vz = (Math.random()+1) / 2 
        }else{
            vx = 1 
            vy = 1 
            vz = 1 
        }

        color.setRGB( vx, vy, vz )

        colors[ i ]     = color.r
        colors[ i + 1 ] = color.g
        colors[ i + 2 ] = color.b

    }

    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) )
    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) )
    bufferGeometry.computeBoundingSphere()

    /*星星的material*/
    let material = new THREE.PointsMaterial( { size: 6, vertexColors: THREE.VertexColors } )
    let particleSystem = new THREE.Points( bufferGeometry, material )
    scene.add( particleSystem )
}

init()
animate()

export default 'idsbllp'

