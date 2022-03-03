
route = ['blue', 'red', 'green', 'yellow']
chances = [-15, -10, 10, 20]
button_state = ['blue', 'blue', 'blue', 'blue', 'blue']

poll = ['🛃', '🛂', '🚮', '🛐', '🚻', '🚼', '♒️', '☢️', '☣️',]

window.addEventListener('click', (e) => {
    document.getElementById('audioplayer').play();
}, { once: true});


function update_btn(n){
    current_color = button_state[n]
    color_index = route.indexOf(button_state[n])
    new_color = route[(color_index + 1) % route.length]
    button_state[n] = new_color
    $(`#key${n}`).removeClass(`key-${current_color}`)
    $(`#key${n}`).addClass(`key-${new_color}`)
    console.log(button_state)
}

$(document).ready(function() {


    $(".key").click(function(e) {
        id = e.target.id
        console.log(id)
        update_btn(parseInt(id[3]))
    })

    $('#key-roll').click(function(e){
        chance = 0
        for (i = 0; i < 5; i++){
            chance += chances[route.indexOf(button_state[i])]
        }
        if (chance < 0){
            chance = 0
        }
        console.log(chance)

        res = []
        for (i = 0; i < 5; i++){
            rand = (Math.random() * 100)
            if (rand < chance){
                res.push('✡️')
            }
            else{
                index = Math.floor((Math.random() * poll.length));
                res.push(poll[index])
            }
        }
        $('#result').html(res.join(''))
    })

    for (i = 0; i < 5; i++){
        update_btn(i)
    }

})

