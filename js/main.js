const rickAndMortyApiBaseUrl = "https://rickandmortyapi.com/api/character/";
const game = document.getElementById('game');

let isPaused = false;
let firstPick;
let matches;
// document.querySelector('button').addEventListener('click', resetGame)



const loadCharacter = async () => {
    const randomIds = new Set();
    while(randomIds.size < 5){
        const randomNumber = Math.ceil((Math.random() * 826))
        randomIds.add(randomNumber)
    }
    const charPromises = [...randomIds].map( id => fetch(rickAndMortyApiBaseUrl + id))
    const responses = await Promise.all(charPromises);
    return await Promise.all(responses.map(res => res.json()));

   
    
}

const displayCharacter = (character) => {
   character.sort(_ => Math.random() - 0.5);
   const characterHTML = character.map(character => {
    return `
    <section class="card" onclick="clickCard(event)" data-character="${character.name}">
        <section class="front">
        </section>
         <section class="back rotated">
         <img src="${character.image}" alt="${character.name}"/>
        </section>
        
    </section>
    `
   }).join('');
   game.innerHTML = characterHTML;
}

const clickCard = (event) => {
    const characterCard = event.currentTarget;
    const [front, back] = getFrontAndBackFromCard(characterCard);
    
    if(front.classList.contains("rotated") || isPaused) return;

    isPaused = true;
   
    
    
   
    rotateElements([front, back])
    if(!firstPick) {
        firstPick = characterCard;
        isPaused = false;
    } else {
        const secondCharacterName = characterCard.dataset.character;
        const firstCharacterName = firstPick.dataset.character;
        if(firstCharacterName != secondCharacterName) {
            const [firstFront, firstBack] = getFrontAndBackFromCard(firstPick);
            setTimeout(() => {
                rotateElements([front, back, firstFront, firstBack])
                firstPick = null;
                isPaused = false;
            }, 500)
            
        } else {
            matches++;
            if (matches == 5) {
                document.querySelector('h3').innerText = 'Congratulations! You won!'
            }
            firstPick = null;
            isPaused = false;
        }
    }
    
}

const rotateElements = (elements) => {
    if(typeof elements != 'object' || !elements.length) return;

    elements.forEach(element => element.classList.toggle('rotated'));
}

const getFrontAndBackFromCard = (card) => {
    const front = card.querySelector(".front");
    const back = card.querySelector(".back");
    return [front, back]
}


const resetGame = () => {
    
    game.innerHTML = '';
    isPaused = true;
    firstPick = null;
    matches = 0;
    setTimeout(async () => {
        const character = await loadCharacter();
        displayCharacter([...character, ...character]);
        isPaused = false;
    }, 200)
}

resetGame();
// fetch(`https://rickandmortyapi.com/api/character/1`)
// .then(response => response.json())
// .then(data => {
//     console.log(data)
// })
// .catch(err => {
//     console.log(`error ${err}`)
// })


