!function(e){function n(t){if(r[t])return r[t].exports;var u=r[t]={i:t,l:!1,exports:{}};return e[t].call(u.exports,u,u.exports,n),u.l=!0,u.exports}var r={};n.m=e,n.c=r,n.i=function(e){return e},n.d=function(e,r,t){n.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="./js",n(n.s=1)}([function(e,n,r){"use strict";function t(e){return function(){var n=e.apply(this,arguments);return new Promise(function(e,r){function t(u,o){try{var c=n[u](o),i=c.value}catch(e){return void r(e)}if(!c.done)return Promise.resolve(i).then(function(e){t("next",e)},function(e){t("throw",e)});e(i)}return t("next")})}}Object.defineProperty(n,"__esModule",{value:!0});var u=function(e){return new Promise(function(n){var r=new Image;r.src=e,r.addEventListener("load",function(e){n()})})};n.default=function(){var e=t(regeneratorRuntime.mark(function e(n){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,u(n);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e,this)}));return function(n){return e.apply(this,arguments)}}()},function(e,n,r){"use strict";var t=r(0);(function(e){e&&e.__esModule})(t),document.querySelector(".prospect"),document.querySelector(".door"),document.querySelector(".pause")}]);