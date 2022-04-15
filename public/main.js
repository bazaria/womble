const route = ['blue', 'red', 'green', 'yellow'];
const chances = [-15, -10, 10, 20];
var button_state = ['blue', 'blue', 'blue', 'blue', 'blue'];

pool = ['🛃', '🛂', '🚮', '🛐', '🚻', '🚼', '♒️', '☢️', '☣️',];

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

function hash(i) {
    return i * 2654435761 % (Math.pow(2, 32))
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
const root_day = new Date(2022, 0, 1); // first day of 2022
const diff_days = Math.floor((today - root_day) / _MS_PER_DAY);
const todays_hash = hash(diff_days);
const permute_index = calculate_permutations(todays_hash)
const permutes = Array.from(permute_index, x => permutations[x])
// for (let index = 0; index < 15; index++) {
//     console.log(calculate_permutations(hash(diff_days + index)))
// }

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

$(function() {


    $(".key").on('click', function(e) {
        id = e.target.id
        console.log(id)
        update_btn(parseInt(id[3]))
    })

    $('#key-roll').on('click', function(e){
        chance = 0
        for (i = 0; i < 5; i++){
            chance += chances[permutes[i].indexOf(button_state[i])]
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
                index = Math.floor((Math.random() * pool.length));
                res.push(pool[index])
            }
        }
        for (let index = 0; index < res.length; index++) {
            const element = res[index];
            console.log(element)
            $(`#result-${index}`).html(element);
        }
    })

    for (i = 0; i < 5; i++){
        update_btn(i)
    }

});
