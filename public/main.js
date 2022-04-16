const route = ['blue', 'red', 'green', 'yellow'];
const chances = [-15, -10, 10, 20];
var button_state = ['blue', 'blue', 'blue', 'blue', 'blue'];

pool = ['🛃', '🛂', '🚮', '🛐', '🚻', '🚼', '♒️'];
radiation_pool = ['☢️', '☣️'];


window.addEventListener('click', (e) => {
    document.getElementById('audioplayer').play();
}, { once: true});

function permutator(inputArr) {
    let result = [];
    const permute = (arr, m = []) => {
      if (arr.length === 0) {
        result.push(m)
      } else {
        for (let i = 0; i < arr.length; i++) {
          let curr = arr.slice();
          let next = curr.splice(i, 1);
          permute(curr.slice(), m.concat(next))
       }
     }
   }

   permute(inputArr)

   return result;
}

// return a random element
function choice(array){
    index = Math.floor((Math.random() * array.length));
    return array[index]
}

function hash(i) {
    return i * 2654435761 % (Math.pow(2, 32))
}

function copyToClipboard(textToCopy) {
    // navigator clipboard api needs a secure context (https)
    if (navigator.clipboard && window.isSecureContext) {
        // navigator clipboard api method'
        return navigator.clipboard.writeText(textToCopy);
    } else {
        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });
    }
}

const permutations = permutator(route)
const needed_permutation = Math.pow(permutations.length, button_state.length)

function calculate_permutations(n){
    n = n % needed_permutation;
    res = []
    for (let index = 0; index < button_state.length; index++) {
        ans = n % permutations.length;
        res.push(ans)
        n  = Math.floor(n / permutations.length);
    }
    return res
}

const _MS_PER_DAY = 1000 * 60 * 60 * 24;
const today = new Date();
const root_day = new Date(2022, 3, 15); // 15/04/2022 - day before release
const diff_days = Math.floor((today - root_day) / _MS_PER_DAY);
const todays_hash = hash(diff_days);
const permute_index = calculate_permutations(todays_hash)
const permutes = Array.from(permute_index, x => permutations[x])

console.log(diff_days);
console.log(hash(diff_days));
console.log(permutes)

function update_btn(n){
    current_color = button_state[n]
    color_index = route.indexOf(button_state[n])
    new_color = route[(color_index + 1) % route.length]
    button_state[n] = new_color
    $(`#key${n}`).removeClass(`key-${current_color}`)
    $(`#key${n}`).addClass(`key-${new_color}`)
    console.log(button_state)
}

class Game{
    constructor(){
        this.guesses = [];
        this.game_done = false
        this.victory = false
    }

    update_guess(guess){
        this.guesses.push(guess)
        if(guess.join('') == '✡️✡️✡️✡️✡️'){
            this.victory = true;
            this.game_done = true
        }
        else if (this.guesses.length == 50){
            this.game_done = true
        }
        $("#guesses_tracker").html(`${this.guesses.length} / 50`)


        this.active_game_done()
    }


    get_result(){
        let start = this.guesses.length > 6 ? this.guesses.length - 6 : 0
        let message_number = this.victory ? this.guesses.length : 'X'
        let str = `Daily Womble #${diff_days}\n${message_number} / 50\nwombledumble.herokuapp.com\n\n`


        for(let i = start; i < this.guesses.length; i++){
            str += this.guesses[i].join('') + '\n'
        }

        return str
    }

    active_game_done(){
        if(!this.game_done){
            return
        }

        console.log(`game - done ${this.victory}`)
        if(this.victory){
            var audio = $('#audioplayer');
            audio[0].pause();
            $('#audiosrc').attr('src', 'img\\victory.mp3');
            audio[0].load();
            audio[0].play();

            $('#victory-nessage').html('victory')
        }
        else{
            $('#victory-nessage').html('defeat')
        }

        $('#victory-screen').css('display', 'flex')

    }

}

game = new Game()

$(function() {

    $(".key").on('click', function(e) {
        if(game.game_done){
            return
        }
        id = e.target.id
        console.log(id)
        update_btn(parseInt(id[3]))
    });

    $('#copy_result').on('click', function(e){
        console.log(game.get_result())
        copyToClipboard(game.get_result()).then(() => {
            $('#copy_result').html('copied!')
        }).catch(() => {
            $('#copy_result').html('error')
        });

        setInterval(() => {
            $('#copy_result').html('copy result')
        }, 1000);
    });

    $('#key-roll').on('click', function(e){
        if(game.game_done){
            return
        }
        chance = 0
        radiation_change = 0
        for (i = 0; i < 5; i++){
            chance += chances[permutes[i].indexOf(button_state[i])]
        }

        console.log(chance)

        if (chance < 0){
            radiation_change = -chance
            chance = 0
        }

        console.log(radiation_change)

        res = []
        for (i = 0; i < 5; i++){
            rand = (Math.random() * 100)
            if (rand < chance){
                res.push('✡️')
            }
            else if (rand < radiation_change) {
                res.push(choice(radiation_pool))
            }
            else{
                res.push(choice(pool))
            }
        }
        game.update_guess(res)
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            $(`#result-${index}`).html(element);
        }
    })

    for (i = 0; i < 5; i++){
        update_btn(i)
    }

});
