// window.onload = function() {
//     document.getElementById('audioplayer').play();
// }

window.addEventListener('click', (e) => {
    console.log('click')
    document.getElementById('audioplayer').play();
}, { once: true});
