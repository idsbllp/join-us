export const RAF = window.requestAnimationFrame
                   || window.webkitRequestAnimationFrame
                   || window.msRequestAnimationFrame
                   || window.mozRequestAnimationFrame
                   || ( fn => setTimeout(fn, 1000/60) )

export const CRAF = window.cancelAnimationFrame
             || window.mozcancelAnimationFrame
             || window.webkitcancelAnimationFrame
             || window.mscancelAnimationFrame
             || ( timerId => clearTimeout(timerId) )

export function getRandomNumber(min, max) {
    let randomNum = ceil(random() * max + min)
    return randomNum%2 ? -randomNum : randomNum
}

export function getRandomColor() {
    return random() < .5 ? 0xffffff : 0xb1afaf
}