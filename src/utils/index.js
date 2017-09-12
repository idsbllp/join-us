const { random, ceil } = Math
export const RAF = window.requestAnimationFrame
                   || window.webkitRequestAnimationFrame
                   || window.msRequestAnimationFrame
                   || window.mozRequestAnimationFrame
                   || ( fn => setTimeout(fn, 1000/60) )

export const CRAF = window.cancelAnimationFrame
             || window.mozcancelAnimationFrame
             || window.webkitcancelAnimationFrame
             || ( timerId => clearTimeout(timerId) )

export const getRandomNumber = (min, max) => {
    const randomNum = ceil(random() * max + min)
    return randomNum%2 ? -randomNum : randomNum
}

export const getRandomColor = () => {
    return random() < .5 ? 0xffffff : 0xb1afaf
}

export const $ = el => {
    const els = document.querySelectorAll(el);
    return els.length > 1 ? els : els[0];
}

export const loadJS = url => {
    const script = document.createElement('script')
    script.src = url
    document.body.appendChild(script)
}
