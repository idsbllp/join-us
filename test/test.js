// standard global variables
var container, scene, camera, renderer, controls, textMesh2, pivot
//var axis = new THREE.Vector3(0,1,1);

function init() {
    // SCENE
    scene = new THREE.Scene();

    // CAMERA
    var SCREEN_WIDTH = window.innerWidth,
        SCREEN_HEIGHT = window.innerHeight;
    var VIEW_ANGLE = 45,
        ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT,
        NEAR = 0.1,
        FAR = 20000;
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    scene.add(camera);
    camera.position.set(0, 0, 1000);
    camera.lookAt(scene.position);
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container = document.getElementById('canvas');
    container.appendChild(renderer.domElement);
    // CONTROLS
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // console.log(controls)
    // 开灯 亮度
    scene.add(new THREE.AmbientLight(0xf5e5bc))
    light = new THREE.DirectionalLight(0x000000, 1.7)
    light.position.set(1, 0, 1)

    scene.add(light)

    // add 3D text beveled and sized
    var material2 = new THREE.MeshPhongMaterial({
        color: 0xff4444, //default is 0xffffff
        //vertexColors: THREE.FaceColors,//THREE.VertexColors,
        //morphTargets: true,//? doesn't work here
        shading: THREE.FlatShading, //comment out for other default shading type
        //shading:THREE.NoShading,//uncomment for no shading at all.
        wireframe: false,
        wireframeLinewidth: 1, //windows is always 1, but macs/linux will change line width
        //emissive: 0xFF0300,//color of the material, essentially a solid color unaffected by other lighting. Default is black.
        specular: 0xFF0300, //color of shine
        shininess: 65, //default is 30, higher the shinier
        //reflectivity: 100,//not sure what values are, but didn't make diff
        //opacity: 0.4,//0.0 - 1.0 
        transparent: true,
    });
    new THREE.FontLoader().load('../src/font/HYZhuZiTongNianTiW_Regular.json', font => {
        var textGeom2 = new THREE.TextGeometry('WEB', {
            font,
            size: 120, //text size
            height: 10, //thicknes of text's extrude!
            curveSegments: 3,
            weight: 'normal', //normal or bold(both don't always work with all fonts)
            style: 'normal', //normal or italics(both don't always work with all fonts)
            bevelThickness: 12, //how deep bevel goes into text
            bevelSize: 8, //dist of bevel from text outline
            bevelEnabled: true
        });
        // textGeom2.center();
        textMesh2 = new THREE.Mesh(textGeom2, material2);

        textGeom2.computeBoundingBox();
        var textWidth2 = textGeom2.boundingBox.max.x - textGeom2.boundingBox.min.x;

        textMesh2.position.set(-0.5 * textWidth2, 0, 60); //left-rt/high/far
        scene.add(textMesh2);

        // var box = new THREE.Box3().setFromObject( textMesh2 );
        // box.center( textMesh2.position ); // this re-sets the mesh position
        // textMesh2.position.multiplyScalar( - 1 );

        // pivot = new THREE.Object3D();
        // pivot.add(textMesh2);
        // scene.add(pivot);

        animate();
    })
} //end init function

function render() {
    renderer.render(scene, camera);
}

function animate() {
    window.requestAnimationFrame(animate);
    render();
    textMesh2.rotation.y += 0.015;
    // console.log(pivot)
}

init();
// animate();