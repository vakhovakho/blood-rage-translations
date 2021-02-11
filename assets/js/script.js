function renderCard(card, parent) {
    const container = document.createElement('div');
    container.classList.add('card', card.type);

    const innerBox = document.createElement('div');
    innerBox.classList.add('inner-box');
    
    const innerLeftBox = document.createElement('div'); 
    innerLeftBox.classList.add('inner-left');
    
    const innerRightBox = document.createElement('div');
    innerRightBox.classList.add('inner-right'); 

    innerBox.appendChild(innerLeftBox);
    innerBox.appendChild(innerRightBox);

    renderStar(card, container);

    renderTitle(card, container);

    if(card.demand !== null) {
        renderDemand(card, container);
    }

    renderCardType(card, innerLeftBox);

    if(card.bonus !== null) { 
        renderBonus(card, innerRightBox);
    }

    if(card.text !== null) {
        renderText(card, innerRightBox);
    }

    if(card.rewards !== null) {
        renderRewards(card, innerRightBox);
    }

    if(card.str !== null) {
        renderStr(card, innerRightBox);
    }

    container.appendChild(innerBox);

    parent.appendChild(container);
}

function renderStar(card, parent) {
    const starElement = document.createElement('div');
    starElement.classList.add('star');

    const starIcon = document.createElement('i');
    starIcon.classList.add('fas', 'fa-star');
    starIcon.addEventListener('click', e => saveHandler(e, card));
    
    if(card.saved) {
        starElement.classList.add('saved');
    }

    starElement.appendChild(starIcon);
    parent.appendChild(starElement);
}

function renderTitle(card, parent) {
    let title = document.createElement('h4');
    title.textContent = card.title;
    parent.appendChild(title);
}

function renderCardType(card, parent) {
    let cardType = document.createElement('p');
    cardType.textContent = card.type.toUpperCase();
    parent.appendChild(cardType);
}

function renderDemand(card, parent) {
    let demand = document.createElement('p');
    demand.classList.add('demand');
    demand.textContent = card.demand;
    parent.appendChild(demand);
}

function renderText(card, parent) {
    let text = document.createElement('p');
    text.classList.add('text');
    text.textContent = card.text;
    parent.appendChild(text);
}

function renderBonus(card, parent) {
    let bonus = document.createElement('p');
    bonus.classList.add('bonus');
    bonus.textContent = '+' + card.bonus;
    parent.appendChild(bonus);
}

function renderStr(card, parent) {
    let str = document.createElement('div');
    str.classList.add('str', 'score');
    let strText = document.createElement('div');
    strText.textContent = card.str;

    if(card.special) {
        const sup = document.createElement('sup');
        sup.textContent = "*";
        strText.appendChild(sup);
        str.classList.add('special');
    }

    str.appendChild(strText);
    parent.appendChild(str);
}

function renderRewards(card, parent) {
    const rewardsElement = document.createElement('div');
    rewardsElement.classList.add('rewards', 'score');
    
    card.rewards.forEach( reward => {
        const rewardElement = document.createElement('div')
        const rewardTextElement = document.createElement('p');
        rewardTextElement.textContent = reward;
        rewardsElement.appendChild(rewardElement);
        rewardElement.appendChild(rewardTextElement);
    });

    parent.appendChild(rewardsElement);
    
}

function saveHandler(e, card) {
    card.saved = !card.saved;
    e.target.parentElement.classList.toggle('saved');
    savedCardsIds = cards.filter(card => card.saved).map(card => card.id);
    localStorage.setItem('saved-cards', JSON.stringify(savedCardsIds));
}

function filter(query = "", saved = false) {
    cardsWrapper.innerHTML = '';
    if(query === "") {
        if(saved) {
            filteredCards = cards.filter(card => card.saved);
            if(!filteredCards.length) {
                alert("You don't have saved cards yet!!!");
                filteredCards = cards;
            } else {
                savedCardsButton.classList.add('selected');
                window.scrollTo(0, 0);
            }
            
        } else {
            filteredCards = cards;
            savedCardsButton.classList.remove('selected');
        }
    } else {
        filteredCards = cards.filter(card =>  card.title.toLowerCase().indexOf(query.toLowerCase()) > -1);
        savedCardsButton.classList.remove('selected');
    }

    filteredCards.forEach(card => {
        renderCard(card, cardsWrapper);
    });
}

function getLangFromUrl(){
    const url = new URL(window.location.href);
    return url.searchParams.get("lang");
}

let cards = [];
const lang = getLangFromUrl() || 'ka'

const cardsWrapper = document.querySelector(".cards-wrapper");
const searchElement = document.getElementById('search');
const savedCardsButton = document.getElementById('saved-cards');
const arrowUp = document.getElementById('arrow-up');

fetch('/translations/' + lang + '.json')
    .then(res => res.json())
    .then(data => {
        cards = data;
        const savedCardsIds = JSON.parse(localStorage.getItem('saved-cards')) || [];
        if(savedCardsIds.length) {
            cards.forEach(card => {
                if(savedCardsIds.includes(card.id)) {
                    card.saved = true;
                }
            });
        }
        filter();
    });

searchElement.addEventListener("keyup", () => {
    filter(searchElement.value);
});

savedCardsButton.addEventListener('click', () => {
    filter("", true);
});

arrowUp.addEventListener('click', () => {
    window.scrollTo(0, 0);
})