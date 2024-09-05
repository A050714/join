function showHeaderNav() {
    document.getElementById('mobile_headerNav').classList.remove('dNone')
    document.getElementById('test').classList.remove('dNone')
    document.getElementById('test').classList.add('header_overlay')
}

function closeHeaderNav() {
    document.getElementById('mobile_headerNav').classList.add('dNone')
    document.getElementById('test').classList.add('dNone')
    document.getElementById('test').classList.remove('header_overlay')
}