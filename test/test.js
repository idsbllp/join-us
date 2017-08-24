
// var Colors = {
//     red:0xf25346,
//     white:0xd8d0d1,
//     brown:0x59332e,
//     brownDark:0x23190f,
//     pink:0xF5986E,
//     yellow:0xf4ce93,
//     blue:0x68c3c0,

// };
// var deltaTime = 4;
// var game = {speed:0,
//           initSpeed:.00035,
//           baseSpeed:.00035,
//           targetBaseSpeed:.00035,
//           incrementSpeedByTime:.0000025,
//           incrementSpeedByLevel:.000005,
//           distanceForSpeedUpdate:100,
//           speedLastUpdate:0,

//           distance:0,
//           ratioSpeedDistance:50,
//           energy:100,
//           ratioSpeedEnergy:3,

//           level:1,
//           levelLastUpdate:0,
//           distanceForLevelUpdate:1000,

//           planeDefaultHeight:100,
//           planeAmpHeight:80,
//           planeAmpWidth:75,
//           planeMoveSensivity:0.005,
//           planeRotXSensivity:0.0008,
//           planeRotZSensivity:0.0004,
//           planeFallSpeed:.001,
//           planeMinSpeed:1.2,
//           planeMaxSpeed:1.6,
//           planeSpeed:0,
//           planeCollisionDisplacementX:0,
//           planeCollisionSpeedX:0,

//           planeCollisionDisplacementY:0,
//           planeCollisionSpeedY:0,

//           seaRadius:50,
//           seaLength:50,
//           //seaRotationSpeed:0.006,
//           wavesMinAmp : 5,
//           wavesMaxAmp : 20,
//           wavesMinSpeed : 0.001,
//           wavesMaxSpeed : 0.003,

//           cameraFarPos:500,
//           cameraNearPos:150,
//           cameraSensivity:0.002,

//           coinDistanceTolerance:15,
//           coinValue:3,
//           coinsSpeed:.5,
//           coinLastSpawn:0,
//           distanceForCoinsSpawn:100,

//           ennemyDistanceTolerance:10,
//           ennemyValue:10,
//           ennemiesSpeed:.6,
//           ennemyLastSpawn:0,
//           distanceForEnnemiesSpawn:50,

//           status : "playing",
//          };


// Sea = function() {
//     var geom = new THREE.CylinderGeometry(game.seaRadius, game.seaRadius, game.seaLength, 100, 100);
//     geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
//     geom.mergeVertices();
//     var l = geom.vertices.length;

//     this.waves = [];

//     for (var i = 0; i < l; i++) {
//         var v = geom.vertices[i];
//         //v.y = Math.random()*30;
//         this.waves.push({
//             y: v.y,
//             x: v.x,
//             z: v.z,
//             ang: Math.random() * Math.PI * 2,
//             amp: game.wavesMinAmp + Math.random() * (game.wavesMaxAmp - game.wavesMinAmp),
//             speed: game.wavesMinSpeed + Math.random() * (game.wavesMaxSpeed - game.wavesMinSpeed)
//         });
//     };
//     var mat = new THREE.MeshPhongMaterial({
//         color: Colors.blue,
//         transparent: true,
//         opacity: .8,
//         shading: THREE.FlatShading,

//     });

//     this.mesh = new THREE.Mesh(geom, mat);
//     this.mesh.name = "llp";
//     this.mesh.receiveShadow = true;
// }

// Sea.prototype.moveWaves = function() {
//     var verts = this.mesh.geometry.vertices;
//     var l = verts.length;
//     for (var i = 0; i < l; i++) {
//         var v = verts[i];
//         var vprops = this.waves[i];
//         v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp;
//         v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp;
//         vprops.ang += vprops.speed * deltaTime;
//         this.mesh.geometry.verticesNeedUpdate = true;
//         this.mesh.rotation.z += .0000005
//     }
// }
// var sea;

// function createSea() {
//     sea = new Sea();
//     sea.mesh.position.y = -game.seaRadius;
//     scene.add(sea.mesh);
// }

// // var fov = 40;//拍摄距离
// // var near = 1;//最小范围
// // var far = 100;//最大范围
// // function mousewheel(e) {
// //     e.preventDefault();

// //     //e.stopPropagation();
// //     if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
// //         if (e.wheelDelta > 0) { //当滑轮向上滚动时
// //             console.log('1111', (near < fov ? 1 : 0))
// //             fov -= (near < fov ? 1 : 0);
// //         }
// //         if (e.wheelDelta < 0) { //当滑轮向下滚动时
// //             console.log('11112222', (fov < far ? 1 : 0))
// //             fov += (fov < far ? 1 : 0);
// //         }
// //     } else if (e.detail) {  //Firefox滑轮事件
// //         console.log('222, ', fov)
// //         if (e.detail > 0) { //当滑轮向上滚动时
// //             fov -= 1;
// //         }
// //         if (e.detail < 0) { //当滑轮向下滚动时
// //             fov += 1;
// //         }
// //     }
// //     camera.fov = fov;
// //     camera.updateProjectionMatrix();
// //     renderer.render(scene, camera);
// // }
// // window.addEventListener('mousewheel', mousewheel, false);

//     var canvas = document.querySelector('#main-canvas');

//     canvas.width = window.innerWidth;
//     canvas.height = window.innerHeight;
//     canvas.style.background = '#000';


//     var renderer = new THREE.WebGLRenderer({
//         canvas: canvas,
//         antialias : true
//     });
//     //renderer.setPixelRatio(window.devicePixelRatio);
//     renderer.shadowMap.enabled = true; //辅助线
//     renderer.shadowMapSoft = true; //柔和阴影
//     renderer.setClearColor(0x000000, 0);

//     var scene = new THREE.Scene();

//     var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 ,2000);
//     camera.position.set(0,120,160);
//     camera.lookAt(new THREE.Vector3(0,0,0));

//     var controls = new THREE.OrbitControls(camera, canvas);
//     // controls.target.set(
//     //     camera.position.x,
//     //     camera.position.y,
//     //     camera.position.z - 0.15
//     // );
//     controls.enablePan = false;
//     controls.enableZoom = false;

//     // function setOrientationControls(e){
//     //     console.log(e)
//     //     if (e.alpha) {
//     //         controls = new THREE.DeviceOrientationControls(camera, true);
//     //         controls.connect();
//     //         controls.update();
//     //     }
//     //     window.removeEventListener('deviceorientation', setOrientationControls, true);
//     // }
//     // window.addEventListener('deviceorientation', setOrientationControls, true);

//     scene.add(camera);

//     //环境光
//     var ambient = new THREE.AmbientLight(0x777777);
//     scene.add(ambient);

//     /*太阳光*/
//     var sunLight = new THREE.PointLight(0xddddaa,3,500);
//     scene.add(sunLight);

//     /*太阳皮肤*/
//     var sunSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/sun_9d55320.jpg');
//     /*地球皮肤*/
//     var earthSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/earth_7710f55.jpg');
//     /*地球皮肤*/
//     var jupiterSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/jupiter_9d9c19f.jpg');



//     createSea(scene);
//     // console.log(scene)

//     // var initPlanet = function(name,revolutionSpeed,color,distance,volume,map) {
//     //     var material;

//     //     if(name == 'Sun'){
//     //         material = new THREE.MeshLambertMaterial({
//     //             emissive: 0xdd4422,
//     //             map: map || ''
//     //         });
//     //     }else{
//     //         material = new THREE.MeshLambertMaterial({
//     //             color: color,
//     //             map: map || ''
//     //         });
//     //     }

//     //     var mesh = new THREE.Mesh( new THREE.SphereGeometry( volume, 50,50 ), material);
//     //     mesh.position.x = -distance;
//     //     mesh.receiveShadow = true;
//     //     mesh.castShadow = true;

//     //     mesh.name = name;

//     //     var star = {
//     //         name: name,
//     //         angle: 0,
//     //         revolutionSpeed: revolutionSpeed,
//     //         distance: distance,
//     //         volume: volume,
//     //         Mesh : mesh
//     //     };

//     //     scene.add(mesh);

//     //     var track = new THREE.Mesh( new THREE.RingGeometry(distance - 0.2, distance + 0.2, 100, 1),
//     //         new THREE.MeshBasicMaterial( { color: 0xffffff,transparent: true, opacity: 0.1, side: THREE.DoubleSide } )
//     //     );
//     //     track.rotation.x = - Math.PI / 2;

//     //     scene.add(track);

//     //     return star;
//     // };

//     // var stars = {
//     //     Sun: initPlanet('Sun',0,'rgb(237,20,0)',0,12,sunSkinPic),
//     //     Mercury: initPlanet('Mercury',0.02,'rgb(124,131,203)',20,2),
//     //     Venus: initPlanet('Venus',0.012,'rgb(190,138,44)',30,4),
//     //     Earth: initPlanet('Earth',0.01,'rgb(46,69,119)',40,5,earthSkinPic),
//     //     Mars: initPlanet('Mars',0.008,'rgb(210,81,16)',50,4),
//     //     Jupiter: initPlanet('Jupiter',0.006,'rgb(254,208,101)',70,9,jupiterSkinPic),
//     //     Saturn: initPlanet('Saturn',0.005,'rgb(210,140,39)',100,7),
//     //     Uranus: initPlanet('Uranus',0.003,'rgb(49,168,218)',120,4),
//     //     Neptune: initPlanet('Neptune',0.002,'rgb(84,125,204)',150,3)
//     // };

//     var revolution = function(star){
//         if(!star.revolutionSpeed) return false;
//         star.angle += star.revolutionSpeed;
//         if (star.angle > Math.PI * 2) {
//             star.angle -= Math.PI * 2;
//         }
//         star.Mesh.position.x = -star.distance * Math.cos(star.angle);
//         star.Mesh.position.z = star.distance * Math.sin(star.angle);
//     };

//     ~function draw() {
//         /*背景星星*/
//         var particles = 10000;  //星星数量
//         /*buffer做星星*/
//         var bufferGeometry = new THREE.BufferGeometry();

//         /*32位浮点整形数组*/
//         var positions = new Float32Array( particles * 3 );
//         var colors = new Float32Array( particles * 3 );

//         var color = new THREE.Color();

//         var gap = 1000; // 定义星星的最近出现位置

//         for ( var i = 0; i < positions.length; i += 3 ) {
//             // positions

//             /*-2gap < x < 2gap */
//             var x = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
//             var y = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);
//             var z = ( Math.random() * gap *2 )* (Math.random()<.5? -1 : 1);

//             /*找出x,y,z中绝对值最大的一个数*/
//             var biggest = Math.abs(x) > Math.abs(y) ? (Math.abs(x) > Math.abs(z) ? 'x' : 'z') : (Math.abs(y) > Math.abs(z) ? 'y' : 'z');

//             var pos = { x: x, y: y, z: z};

//             /*如果最大值比n要小（因为要在一个距离之外才出现星星）则赋值为n（-n）*/
//             if(Math.abs(pos[biggest]) < gap) pos[biggest] = pos[biggest] < 0 ? -gap : gap;

//             x = pos['x'];
//             y = pos['y'];
//             z = pos['z'];

//             positions[ i ]     = x;
//             positions[ i + 1 ] = y;
//             positions[ i + 2 ] = z;

//             /*70%星星有颜色*/
//             var hasColor = Math.random() > 0.3;
//             var vx, vy, vz;

//             if(hasColor){
//                 vx = (Math.random()+1) / 2 ;
//                 vy = (Math.random()+1) / 2 ;
//                 vz = (Math.random()+1) / 2 ;
//             }else{
//                 vx = 1 ;
//                 vy = 1 ;
//                 vz = 1 ;
//             }

//             color.setRGB( vx, vy, vz );

//             colors[ i ]     = color.r;
//             colors[ i + 1 ] = color.g;
//             colors[ i + 2 ] = color.b;

//         }

//         bufferGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
//         bufferGeometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
//         bufferGeometry.computeBoundingSphere();

//         /*星星的material*/
//         var material = new THREE.PointsMaterial( { size: 6, vertexColors: THREE.VertexColors } );
//         var particleSystem = new THREE.Points( bufferGeometry, material );
//         scene.add( particleSystem );
//     }()



//     window.addEventListener( 'resize', function(){
//         camera.aspect = window.innerWidth / window.innerHeight;
//         camera.updateProjectionMatrix();
//         renderer.setSize( window.innerWidth, window.innerHeight );
//     }, false );


//     (function render(timestamp) {
//         requestAnimationFrame(render);
//         // controls.update();
//         // sea.mesh.rotation.z += .02
//         sea.moveWaves();
//         // /*太阳自转*/
//         // stars.Sun.Mesh.rotation.y = (stars.Sun.Mesh.rotation.y == 2*Math.PI ? 0.0008*Math.PI : stars.Sun.Mesh.rotation.y+0.0008*Math.PI);
//         // /*地球自转*/
//         // stars.Earth.Mesh.rotation.y = (stars.Earth.Mesh.rotation.y == 2*Math.PI ? 0.02*Math.PI : stars.Earth.Mesh.rotation.y+0.02*Math.PI);
//         // for(var k in stars){
//         //     revolution(stars[k]);
//         // }
//         renderer.render(scene, camera);
//         // effect.render(scene, camera);
//     }());




// var renderer, scene, camera, distance;

// var container = document.getElementById('container');

// init();

// function init() {
//     renderer = new THREE.WebGLRenderer({
//         antialias: true
//     });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     container.appendChild(renderer.domElement);

//     scene = new THREE.Scene();
//     camera = new THREE.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 1, 10000);
//     scene.add(camera);

//     distance = 1000;
//     var geometry = new THREE.Geometry();

//     for (var i = 0; i < 250; i++) {

//         var square = new THREE.CubeGeometry(1, 1, 10);
//         var material = new THREE.MeshBasicMaterial({
//             color: Math.random() * 0xff00000 - 0xff00000,
//             opacity: 0.5,
//             // wireframe: true
//         })
//         var particule = new THREE.Mesh(square, material);

//         particule.position.x = Math.random() * distance * 2 - distance;
//         particule.position.y = Math.random() * distance * 2 - distance;
//         particule.position.z = Math.random() * distance * 2 - distance;
//         particule.scale.x = particule.scale.y = particule.scale.z = Math.random() * 10 + 5;

//         geometry.vertices.push(new THREE.Vector3(particule.position));
//         scene.add(particule);
//     }

//     camera.position.z = 1000;
//     // camera.lookAt(particule); 

//     renderer.render(scene, camera);

//     // document.addEventListener('mousemove', onMouseMove, false);
// }

// function onMouseMove(event) {
//     var mouseX = event.clientX - window.innerWidth / 2;
//     var mouseY = event.clientY - window.innerHeight / 2;
//     camera.position.x += (mouseX - camera.position.x) * 0.05;
//     camera.position.y += (mouseY - camera.position.y) * 0.05;
//     camera.position.z = distance;
//     camera.lookAt(scene.position);
//     renderer.render(scene, camera);
// }
// var fov = 910;
// function render() {
//     if (fov > 770) {
//         requestAnimationFrame(render)
//         fov--
//         camera.fov = fov
//         console.log(fov)
//         camera.updateProjectionMatrix();
//         renderer.render(scene, camera);
//     }
// }
// render()


// function render() {
//     animate();
//     requestAnimationFrame(render);
//     renderer.render(scene, camera);
// }

// function setup_canvas() {
//     var renderer = new THREE.WebGLRenderer();
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     document.body.appendChild(renderer.domElement);

//     return renderer;
// }

// function setup_scene() {

//     var scene = new THREE.Scene();


//     return scene;
// }

// function setup_camera() {
//     var camera = new THREE.PerspectiveCamera(
//         75,
//         window.innerWidth / window.innerHeight,
//         0.1,
//         1000
//     );

//     camera.position.z = 2;
//     return camera;
// }

// function add_cube() {
//     var geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
//     var material = new THREE.MeshLambertMaterial({
//         color: 0xffffff
//     });
//     var cube = new THREE.Mesh(geometry, material);
//     scene.add(cube);
//     return cube;
// }

// function add_sphere() {
//     var geometry = new THREE.SphereGeometry(0.5, 64, 64);
//     var material = new THREE.MeshLambertMaterial({
//         color: 0xffffff
//     });
//     var sphere = new THREE.Mesh(geometry, material);
//     scene.add(sphere);
//     return sphere;
// }

// function get_light_sphere(color) {
//     var geometry = new THREE.SphereGeometry(0.01);
//     var material = new THREE.MeshBasicMaterial({
//         color: color
//     });
//     var cube = new THREE.Mesh(geometry, material);
//     return cube;
// }

// function get_light(x, y, z, color) {
//     var light = new THREE.PointLight(color, 1, 100);
//     light.position.set(x, y, z);
//     light.add(get_light_sphere(color));

//     return light
// }

// var renderer = setup_canvas();
// var scene = setup_scene();
// var obj = add_sphere();

// var camera = setup_camera();

// obj.rotation.x += 0.4;
// obj.rotation.y += 0.5;

// var light_rotor = new THREE.Object3D();
// light_rotor.add(get_light(1, 0, 0, 0xff0000));
// light_rotor.add(get_light(-1, 0, 0, 0x00ff00));
// light_rotor.add(get_light(0, 1, 0, 0x0000ff));
// light_rotor.add(get_light(0, -1, 0, 0xffff00));
// light_rotor.add(get_light(0, 0, 1, 0xff00ff));
// light_rotor.add(get_light(0, 0, -1, 0xffff00));
// scene.add(light_rotor);

// function animate() {
//     obj.rotation.y += 0.02;
//     light_rotor.rotation.x += 0.02;
//     light_rotor.rotation.y += 0.02;
//     light_rotor.rotation.z += 0.02;
// }

// render();



if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}
var container, stats;
var camera, controls, scene, renderer;
var mesh, texture, geometry, material;
var worldWidth = 128, worldDepth = 128,
worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
var clock = new THREE.Clock();
init();
animate();
function init() {
    container = document.getElementById( 'container' );
    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
    camera.position.y = 200;
    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 500;
    controls.lookSpeed = 0.1;
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xaaccff );
    scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 )
    geometry = new THREE.PlaneGeometry( 20000, 20000, worldWidth - 1, worldDepth - 1 );
    geometry.rotateX( - Math.PI / 2 );
    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
        geometry.vertices[ i ].y = 35 * Math.sin( i / 2 );
    }
    var texture = new THREE.TextureLoader().load( "./water.jpg" );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 5, 5 );
    material = new THREE.MeshBasicMaterial( { color: 0x0044ff, map: texture } );
    mesh = new THREE.Mesh( geometry, material );
    scene.add( mesh );
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.innerHTML = "";
    container.appendChild( renderer.domElement );
    // stats = new Stats();
    // container.appendChild( stats.dom );
    //
    window.addEventListener( 'resize', onWindowResize, false );
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}
//
function animate() {
    requestAnimationFrame( animate );
    render();
    // stats.update();
}
function render() {
    var delta = clock.getDelta(),
        time = clock.getElapsedTime() * 10;
    for ( var i = 0, l = geometry.vertices.length; i < l; i ++ ) {
        geometry.vertices[ i ].y = 35 * Math.sin( i / 5 + ( time + i ) / 7 );
    }
    mesh.geometry.verticesNeedUpdate = true;
    controls.update( delta );
    renderer.render( scene, camera );
}

