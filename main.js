'use strict';

let reset = document.getElementById('reset');
let game = document.getElementById('game');
let arrSpreadsCards = [];
const RED_SUITS = ['♦', '♥'];
const SUITS = ['♠', '♣', '♦', '♥'];
let selectedCards = { deck: '', card: '', index: '', color: '', suit: '' }; 
const AVAILABLE_SIGNS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

let arrIdDiv = Array(13).fill(null).map((_, i) => i).map(el => document.getElementById(`deck${el}`));
let cards = getDeckOfCards();


let arrDeckInField = function() { // заполняем масивы картами
    Array(6).fill('').map(_ => arrSpreadsCards.push([]));
    let start = [0, 1, 3, 6, 10, 15, 21];
    Array(7).fill('').map((_, i) => arrSpreadsCards.push(cards.splice(start[i], i + 1)));
    arrSpreadsCards[0] = [...cards]; 

    arrSpreadsCards[0].push(new Card('', '', '', '', '', ''))
 }

arrDeckInField();

function Card(name, sign, suit, color, isVisible, selected) { //конструктор шаблон для одной карты
    this.name = name,
    this.sign = sign,
    this.suit = suit,
    this.color = color,
    this.isVisible = isVisible,
    this.selected = selected
}

function getDeckOfCards() { // создает колоду карт и сразу перемешивает
    let arr = [];
    SUITS.forEach(suit => {
        AVAILABLE_SIGNS.forEach(sign => {
            let color = suit === '♦' || suit === '♥' ? 'R' : 'B';
            let nameCard = sign + '  ' + suit;
            
            arr.push(new Card(nameCard, sign, suit, color, false, false));
        })
    })
   return arr.sort((a, b) => Math.random() - 0.5)
}

function spreadTheCards(numberDeck) { // раскладываем карты 
    let addPx = 200;
    if (arrSpreadsCards[0].length === 0) {
        return
    }
    arrIdDiv[numberDeck].innerHTML =  arrSpreadsCards[numberDeck].map((el, i) => `
    ${arrSpreadsCards[numberDeck].length - 1 === i ? el.isVisible = true : ''}
        <div 
             data-numberdeck="${numberDeck}"
             data-numbercard="${i}"
            ${el.color === 'R' ? 'class="partDeck red"' : 'class="partDeck  black"'}
        >   
            ${el.isVisible === true ? el.name : ''}
        </div>`).join(' ')

        for (let i = 0; i < arrIdDiv[numberDeck].children.length; i++) {
            arrSpreadsCards[numberDeck][i].selected // добавляем класс только к выбраным
                ? arrIdDiv[numberDeck].children[i].classList.add('selected') 
                : arrIdDiv[numberDeck].children[i].classList.remove('selected')
            if (numberDeck > 5) {
                arrIdDiv[numberDeck].children[i].style = `top: ${addPx}px`;
            addPx += 28;
            } else {
                arrIdDiv[numberDeck].children[i].style = `top: 5px`; 
            }
        }  
}

render();
function render() {
    arrSpreadsCards.map((_, i) => spreadTheCards(i));

    if (
        arrSpreadsCards[2].length === 13
        && arrSpreadsCards[3].length === 13
        && arrSpreadsCards[4].length === 13
        && arrSpreadsCards[5].length === 13
        ) {
            alert('wins');
        }
}

game.addEventListener('click', function(event) {
    
    const deckId = +event.target.id.substring(4, 6) ;
    let numberdeck = +event.target.dataset.numberdeck || deckId;
    const numbercard = +event.target.dataset.numbercard;
    
    if (event.target.id.substring(0, 4) === 'deck' && arrSpreadsCards[numberdeck].length > 0) return;
   
    if (numberdeck === 0) {
        const obj = arrSpreadsCards[numberdeck].splice(arrSpreadsCards[0].length - 1, 1)
        arrSpreadsCards[1].push(obj[0]);
    }

    if (deckId === 0) {
        if (arrSpreadsCards[0].length === 0) {
           arrSpreadsCards[0] = arrSpreadsCards[1].splice(0, 24);
        } 
    }
 
    if ((numberdeck >= 1 && numberdeck <= 12) ) {
        clearSelect(); // снимает все выделения
        selectVisible(numberdeck, numbercard); // выделяет выбраных
       
       function changeDeck() {
            let count = arrSpreadsCards[selectedCards.deck].length;
            let currentDeck = arrSpreadsCards[numberdeck].length;

            getPermissionMove(numberdeck, numbercard, count, currentDeck);
        }
        
       if (arrSpreadsCards[numberdeck].length === 0) { // если нажали на пустую колоду
            arrSpreadsCards[numberdeck] = []
            if (selectedCards.deck) changeDeck()
       } else {
            if (selectedCards.deck) {
                changeDeck();
                Object.keys(selectedCards).map(el => selectedCards[el] = '')
                clearSelect(); // снимает все выделения
            } else {
                selectedCards.deck = numberdeck;
                selectedCards.card = numbercard;
                selectedCards.index = getIndexSelectCard(numberdeck, numbercard) || '';
                selectedCards.color = arrSpreadsCards[numberdeck][numbercard].color;
                selectedCards.suit = arrSpreadsCards[numberdeck][numbercard].suit;
            }
       }
    }
    render()
})

function clearSelect() { // снимает все выделения
    for (let i = 1; i < arrSpreadsCards.length; i++) { 
        if (arrSpreadsCards[i].length === 0) continue;
        arrSpreadsCards[i].map(el => el.selected = false) 
    }
}

function selectVisible(numberdeck, numbercard) { // выделяет выбраных
    if (arrSpreadsCards[numberdeck]) { 
        for (let i = 0; i < arrSpreadsCards[numberdeck].length; i++) {
            i >= numbercard 
            ? arrSpreadsCards[numberdeck][i].selected = true 
            : arrSpreadsCards[numberdeck][i].selected = false
        } 
    }
}

function getIndexSelectCard(numberdeck, numbercard) {
    let sign = arrSpreadsCards[numberdeck][numbercard].sign || '';
    return AVAILABLE_SIGNS.findIndex((el) => sign === el)
}

function getPermissionMove(numberdeck, numbercard, count, currentDeck) {
    
    // start проверка для верхних четырех стопок
    if ((selectedCards.card !== undefined)
        && (numberdeck === 2 || numberdeck === 3 || numberdeck === 4 || numberdeck === 5)
        && (arrSpreadsCards[selectedCards.deck][selectedCards.card].isVisible === true)
        && (arrSpreadsCards[selectedCards.deck].length - 1 === selectedCards.card)) {
        if (arrSpreadsCards[numberdeck].length === 0) {
            if (selectedCards.index === 12) {
                chancheCards();
                Object.keys(selectedCards).map(el => selectedCards[el] = '');
            }
        } else {
            if (getIndexSelectCard(numberdeck, numbercard) === 12 && selectedCards.index === 0
            && (arrSpreadsCards[numberdeck][numbercard].suit === selectedCards.suit)) {
                chancheCards();
                Object.keys(selectedCards).map(el => selectedCards[el] = '');
            } else {
                if (getIndexSelectCard(numberdeck, numbercard) + 1 === selectedCards.index 
                    && (arrSpreadsCards[numberdeck][numbercard].suit === selectedCards.suit)) {
                        chancheCards();
                        Object.keys(selectedCards).map(el => selectedCards[el] = '');
                }
            } 
        }
    } // and проверка для верхних четырех стопок

     // start проверка для нижних семи стопок
     if (   (numberdeck === 6 
            || numberdeck === 7 
            || numberdeck === 8 
            || numberdeck === 9
            || numberdeck === 10 
            || numberdeck === 11 
            || numberdeck === 12)
            && (arrSpreadsCards[selectedCards.deck][selectedCards.card].isVisible === true)) {
            if (arrSpreadsCards[numberdeck].length === 0) {
                if (selectedCards.index === 11) {
                    for (let i = selectedCards.card; i < count; i++) { 
                        chancheCards();
                    }
                    Object.keys(selectedCards).map(el => selectedCards[el] = '');
                }
            } else {    
                    if (getIndexSelectCard(numberdeck, numbercard) - 1 === selectedCards.index 
                        && arrSpreadsCards[numberdeck][numbercard].color !== selectedCards.color) {
                        for (let i = selectedCards.card; i < count; i++) { 
                            chancheCards();
                        }
                        Object.keys(selectedCards).map(el => selectedCards[el] = '');
                } 
            }
        }
     // and проверка для нижних семи стопок

    function chancheCards() {
        arrSpreadsCards[numberdeck].push(arrSpreadsCards[selectedCards.deck][selectedCards.card])
        arrSpreadsCards[selectedCards.deck].splice([selectedCards.card], 1);
    }
}

reset.addEventListener('click', () => {
    console.log('dfdf')
    arrSpreadsCards = [];
    cards = getDeckOfCards();
    getDeckOfCards();
    arrDeckInField();
    render()
})