// 避免小黑框
// $(window).on('scroll.elasticity', (e) => {
//     e.preventDefault()
// }).on('touchmove.elasticity', (e) => {
//     e.preventDefault()
// })

import 'three-onevent'
import OrbitControls from 'three-orbitcontrols'
// import Detector from './js/Detector.js'
// import './js/DeviceOrientationControls.js'
import positionOfBalls from './conf/balls.js'
import { RAF, CRAF } from './utils/index.js'

const { PI, cos, sin, random, ceil } = Math
const START_NUM = 200
const { innerWidth, innerHeight, devicePixelRatio } = window
const canvas = document.querySelector('#canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

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
    return random() < .5 ? 0xffffff : 0xb1afaf
}

function init() {}
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera( 45, innerWidth / innerHeight, 1, 2000 )
    renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas
    })

    renderer.setPixelRatio( devicePixelRatio )
    renderer.setSize( innerWidth, innerHeight )
    // renderer.setClearColor(0xffffff, 0)

    camera.position.set(0, 0, innerWidth > innerHeight ? innerHeight/1.5 : innerWidth/1.5)
    camera.lookAt(new THREE.Vector3(0,0,0))
    // camera.position.x = 0
    // camera.position.y = 0
    // 取小的那一个的  2/3
    // camera.position.z = innerWidth > innerHeight ? innerHeight/1.5 : innerWidth/1.5

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
        // console.log(value.pos)
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
    drawStars()

    // 给屏幕添加手指拖动事件
    controls = new OrbitControls(camera, canvas);

    controls.enablePan = false;
    controls.enableZoom = false;

    function setOrientationControls(e){
        console.log(e)
        if (e.alpha) {
            controls = new THREE.DeviceOrientationControls(camera, true);
            controls.connect();
            controls.update();
        }
        window.removeEventListener('deviceorientation', setOrientationControls, true);
    }
    window.addEventListener('deviceorientation', setOrientationControls, true);

    scene.add(camera);

    window.addEventListener( 'resize', onWindowResize, false )
// }

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
    render()
    renderer.render( scene, camera )
}

var test = 1

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

    for ( let i = 0, l = scene.children.length; i < l; i ++ ) {
        let object = scene.children[i]
        // 自旋
        if (!object.name) continue
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

        if (test < 40) {
            test++
            // console.log(object.name)
            // console.log(scene.children)
            // console.log(object.position, camera.position)
        }
    }

    // 自行转动，绕y轴转动，y轴垂直向上
    cameraRotate -= 0.005
    // cameraPos.x = 300 * cos(cameraRotate)
    // cameraPos.z = 300 * sin(cameraRotate)
}

function drawStars() {
    /*背景星星*/
    var particles = 10000;  //星星数量
    /*buffer做星星*/
    var bufferGeometry = new THREE.BufferGeometry();

    /*32位浮点整形数组*/
    var positions = new Float32Array( particles * 3 );
    var colors = new Float32Array( particles * 3 );

    var color = new THREE.Color();

    var gap = 1000; // 定义星星的最近出现位置

    for ( var i = 0; i < positions.length; i += 3 ) {
        // positions

        /*-2gap < x < 2gap */
        var x = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        var y = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
        var z = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);

        /*找出x,y,z中绝对值最大的一个数*/
        var biggest = Math.abs(x) > Math.abs(y) ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z') : (Math.abs(y) > Math.abs(z) ? 'y' : 'z');

        var pos = { x: x, y: y, z: z};

        /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
        if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

        x = pos['x'];
        y = pos['y'];
        z = pos['z'];

        positions[ i ]     = x;
        positions[ i + 1 ] = y;
        positions[ i + 2 ] = z;

        /*70%星星有颜色*/
        var hasColor = Math.random() > 0.3;
        var vx, vy, vz;

        if(hasColor){
            vx = (Math.random()+1) / 2 ;
            vy = (Math.random()+1) / 2 ;
            vz = (Math.random()+1) / 2 ;
        }else{
            vx = 1 ;
            vy = 1 ;
            vz = 1 ;
        }

        color.setRGB( vx, vy, vz );

        colors[ i ]     = color.r;
        colors[ i + 1 ] = color.g;
        colors[ i + 2 ] = color.b;

    }

    bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
    bufferGeometry.computeBoundingSphere();

    /*星星的material*/
    var material = new THREE.PointsMaterial( { size: 6, vertexColors: THREE.VertexColors } );
    var particleSystem = new THREE.Points( bufferGeometry, material );
    scene.add( particleSystem );
}

init()
animate()

export default 'llp'

