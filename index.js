// 避免小黑框
// $(window).on('scroll.elasticity', (e) => {
//     e.preventDefault();
// }).on('touchmove.elasticity', (e) => {
//     e.preventDefault();
// });

import positionOfBalls from './conf/balls.js'
const { PI, cos, sin, random } = Math

if ( ! Detector.webgl ) Detector.addGetWebGLMessage();
var container, stats;
var camera, scene, renderer;

init();
setTimeout(animate, 200);
// init();
// animate();
function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 2000 );
    // console.log(camera)
    camera.position.y = 400;
    scene = new THREE.Scene();
    var light, object;

    // 开灯 亮度
    scene.add( new THREE.AmbientLight( 0x404040 ) );
    light = new THREE.DirectionalLight( 0xffffff );
    // 应该就是重y轴看
    light.position.set( 0, 1, 0 );
    scene.add( light );

    positionOfBalls.forEach((value, index) => {
        var map = new THREE.TextureLoader().load( value.pic );
        map.wrapS = map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 16;
        var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );

        object = new THREE.Mesh( new THREE.SphereGeometry( 15, 75, 75 ), material );
        // 左右, 上下, 斜的？？？？
        object.position.set( value.pos[0], value.pos[1], value.pos[2] );
        object.name = 'llp' + value.pic;
        scene.add( object );
    })

    renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    renderer.setClearColor(0xffffff, 0)

    container.appendChild( renderer.domElement );
    stats = new Stats();
    container.appendChild( stats.dom );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}
//
function animate() {
    requestAnimationFrame( animate );
    stats.update();
    render();
}
// http://www.cnblogs.com/v-weiwang/p/6072235.html
function render(rotation = { clientX: 0, clientY: PI/2 }) {
    camera.position.x = 300
    camera.position.y = 300
    camera.position.z = 300;
    camera.lookAt({ x:0, y:0, z:0 });
    for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
        var object = scene.children[ i ];
        // 自己旋转
        object.rotation.x += sin(rotation.clientX) / 2
        object.rotation.y += cos(rotation.clientY) / 2
        object.rotation.z = 0.5
        console.log(object)
    }
    renderer.render( scene, camera )
}

window.addEventListener('touchmove', e => {
    let { clientX, clientY } = e.changedTouches[0]
    if (clientX < 0 || clientY < 0 || clientX > window.innerWidth || clientY > window.innerHeight) {
        return;
    }

    render({ clientX, clientY });

})
// function render() {
//     var timer = Date.now() * 0.0001;
//     camera.position.x = Math.cos( timer ) * 800;
//     camera.position.z = Math.sin( timer ) * 800;
//     camera.lookAt( scene.position );
//     for ( var i = 0, l = scene.children.length; i < l; i ++ ) {
//         var object = scene.children[ i ];
//         object.rotation.x = timer * 5;
//         object.rotation.y = timer * 2.5;
//     }
//     renderer.render( scene, camera );
// }

export default 'llp'

