const load = url => {
    return new Promise(resolve => {
        const img = new Image()
        img.src = url
        img.addEventListener('load', e => {
            resolve()
        })
    })
}

export default async function(url) {
    return await load(url)
}