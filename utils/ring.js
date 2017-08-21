// 球周围的环
const Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    brownDark:0x23190f,
    pink:0xF5986E,
    yellow:0xf4ce93,
    blue:0x68c3c0
}
const deltaTime = 4;
export default class Ring {
    constructor(ball) {
        this.geom = new THREE.CylinderGeometry(ball.radius, ball.radius, ball.length, 100, 100)
        this.geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2))
        this.geom.mergeVertices()
        let l = this.geom.vertices.length

        this.waves = []

        for (let i = 0; i < l; i++) {
            let v = this.geom.vertices[i]
            this.waves.push({
                y: v.y,
                x: v.x,
                z: v.z,
                ang: Math.random() * Math.PI * 2,
                amp: ball.wavesMinAmp + Math.random() * (ball.wavesMaxAmp - ball.wavesMinAmp),
                speed: ball.wavesMinSpeed + Math.random() * (ball.wavesMaxSpeed - ball.wavesMinSpeed)
            })
        }
        let mat = new THREE.MeshPhongMaterial({
            color: Colors.blue,
            transparent: true,
            opacity: .5,
            shading: THREE.FlatShading,

        })

        this.mesh = new THREE.Mesh(this.geom, mat)
        this.mesh.name = "ring"
        this.mesh.receiveShadow = true
    }
    moveWaves() {
        let verts = this.mesh.geometry.vertices
        let l = verts.length
        for (let i = 0; i < l; i++) {
            let v = verts[i];
            let vprops = this.waves[i]
            v.x = vprops.x + Math.cos(vprops.ang) * vprops.amp
            v.y = vprops.y + Math.sin(vprops.ang) * vprops.amp
            vprops.ang += vprops.speed * deltaTime
            this.mesh.geometry.verticesNeedUpdate = true
            // this.mesh.rotation.z += vprops.ang
        }
    }
}
