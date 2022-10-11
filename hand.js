class Hand {
    /**
     * Hand class used to store Cards that are currently selected in game
     */
    constructor() {
        this.cards = new Array();
    }
    /**
     * Returns the number of cards in the hand
     */
    get length() {
        return this.cards.length;
    }
    /**
     * Returns the list of cards selected in game
     * @returns list
     */
    getCards() {
        return this.cards;
    }
    /**
     * Adds a card to the list of cards or removes it if it is already selected,
     * @param {Card} card 
     */
    select(card) {
        let cardIndex = this.cards.indexOf(card);
        if(cardIndex < 0){
            this.cards.push(card);
        }
        else {
            this.cards.splice(cardIndex, 1)[0];
        }
    }
    /**
     * Clears the list of cards selected
     */
    clear() {
        this.cards = new Array();
    }
}