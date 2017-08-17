var canvas = document.querySelector('#main-canvas');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.background = '#000';

canvas.addEventListener('click',function(){
    if (canvas.requestFullscreen) {
        canvas.requestFullscreen();
    } else if (canvas.msRequestFullscreen) {
        canvas.msRequestFullscreen();
    } else if (canvas.mozRequestFullScreen) {
        canvas.mozRequestFullScreen();
    } else if (canvas.webkitRequestFullscreen) {
        canvas.webkitRequestFullscreen();
    } else if(canvas.webkitEnterFullscreen){
        canvas.webkitEnterFullscreen();
    }
},false);

var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias : true
});
// renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true; //辅助线
renderer.shadowMapSoft = true; //柔和阴影
renderer.setClearColor(0x000000, 0);

var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1 ,2000);
camera.position.set(0,20,60);
camera.lookAt(new THREE.Vector3(0,0,0));

var controls = new THREE.OrbitControls(camera, canvas);
controls.target.set(
    camera.position.x,
    camera.position.y,
    camera.position.z - 0.15
);
controls.noPan = true;
controls.noZoom = true;


function setOrientationControls(e){
    alert(e.alpha)
    if (e.alpha) {
        controls = new THREE.DeviceOrientationControls(camera, true);
        controls.connect();
        controls.update();
    }
    window.removeEventListener('deviceorientation', setOrientationControls, true);
}
window.addEventListener('deviceorientation', setOrientationControls, true);

// Apply VR stereo rendering to renderer.
var effect = new THREE.StereoEffect(renderer);

scene.add(camera);

//环境光
var ambient = new THREE.AmbientLight(0x777777);
scene.add(ambient);

/*太阳光*/
var sunLight = new THREE.PointLight(0xddddaa,3,500);
scene.add(sunLight);

/*太阳皮肤*/
var sunSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/sun_9d55320.jpg');
/*地球皮肤*/
var earthSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/earth_7710f55.jpg');
/*地球皮肤*/
var jupiterSkinPic = THREE.ImageUtils.loadTexture('http://test.nie.163.com/test_cdn/test/m/qt/20161130144455/img/jupiter_9d9c19f.jpg');



var initPlanet = function(name,revolutionSpeed,color,distance,volume,map) {
    var material;

    if(name == 'Sun'){
        material = new THREE.MeshLambertMaterial({
            emissive: 0xdd4422,
            map: map || ''
        });
    }else{
        material = new THREE.MeshLambertMaterial({
            color: color,
            map: map || ''
        });
    }

    var mesh = new THREE.Mesh( new THREE.SphereGeometry( volume, 50,50 ), material);
    mesh.position.x = -distance;
    mesh.receiveShadow = true;
    mesh.castShadow = true;

    mesh.name = name;

    var star = {
        name: name,
        angle: 0,
        revolutionSpeed: revolutionSpeed,
        distance: distance,
        volume: volume,
        Mesh : mesh
    };

    scene.add(mesh);

    var track = new THREE.Mesh( new THREE.RingGeometry(distance - 0.2, distance + 0.2, 100, 1),
        new THREE.MeshBasicMaterial( { color: 0xffffff,transparent: true, opacity: 0.1, side: THREE.DoubleSide } )
    );
    track.rotation.x = - Math.PI / 2;

    scene.add(track);

    return star;
};

var stars = {
    Sun: initPlanet('Sun',0,'rgb(237,20,0)',0,12,sunSkinPic),
    Mercury: initPlanet('Mercury',0.02,'rgb(124,131,203)',20,2),
    Venus: initPlanet('Venus',0.012,'rgb(190,138,44)',30,4),
    Earth: initPlanet('Earth',0.01,'rgb(46,69,119)',40,5,earthSkinPic),
    Mars: initPlanet('Mars',0.008,'rgb(210,81,16)',50,4),
    Jupiter: initPlanet('Jupiter',0.006,'rgb(254,208,101)',70,9,jupiterSkinPic),
    Saturn: initPlanet('Saturn',0.005,'rgb(210,140,39)',100,7),
    Uranus: initPlanet('Uranus',0.003,'rgb(49,168,218)',120,4),
    Neptune: initPlanet('Neptune',0.002,'rgb(84,125,204)',150,3)
};

var revolution = function(star){
    if(!star.revolutionSpeed) return false;
    star.angle += star.revolutionSpeed;
    if (star.angle > Math.PI * 2) {
        star.angle -= Math.PI * 2;
    }
    star.Mesh.position.x = -star.distance * Math.cos(star.angle);
    star.Mesh.position.z = star.distance * Math.sin(star.angle);
};


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


window.addEventListener( 'resize', function(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    effect.setSize(window.innerWidth, window.innerHeight);
}, false );


(function render(timestamp) {
    requestAnimationFrame(render);
    controls.update();
    /*太阳自转*/
    stars.Sun.Mesh.rotation.y = (stars.Sun.Mesh.rotation.y == 2*Math.PI ? 0.0008*Math.PI : stars.Sun.Mesh.rotation.y+0.0008*Math.PI);
    /*地球自转*/
    stars.Earth.Mesh.rotation.y = (stars.Earth.Mesh.rotation.y == 2*Math.PI ? 0.02*Math.PI : stars.Earth.Mesh.rotation.y+0.02*Math.PI);
    for(var k in stars){
        revolution(stars[k]);
    }
    renderer.render(scene, camera);
    effect.render(scene, camera);
})()
