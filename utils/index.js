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

