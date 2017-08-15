const pics = ['asd.jpg', 'q.jpg', 'bg.jpg', 'bl.png', 'dd.jpg']

function getPos() {
    let perimeter = Math.PI * 2
    let per = perimeter / 5

    let pos = []
    for (var i = 5; i > 0; i--) {
        pos.push({
            pic: pics[i-1],
            pos: [100 * Math.cos(per*i), 0, 100 * Math.sin(per*i)]
        })
    }
    return pos
}

export default getPos()

