class Board {
    /**
     * Board class that stores references to all classes related to the game
     * Allows for adding, removing and drawing cards
     * Allows for easy access of each referenced object
     * Refreshes the board to the current time, highlighted cards, score, cards
     * Checks when the game has ended
     * Allows for finding sets in the hand, finding hints, and highlighting cards  
     * @param {Deck} deck 
     * @param {Hand} hand 
     * @param {Timer} timer 
     * @param {function} endFunc 
     * @param {Pauser} pauser 
     */
    constructor(deck, hand, timer, endFunc, pauser) {
        this.cards = new Array();
        this.deck = deck;
        this.hand = hand;
        this.timer = timer;
        this.pauser = pauser;
        this.points = 0;
        // Used to stop delayed animations after the game has ended
        this.running = true;
        // Function used to end the game and switch pages
        this.endFunction = endFunc;
        // Default game values
        this.setSuccessPoints = 50;
        this.setFailPoints = -10;
        this.animationDelay = 500;
        this.boardCardCount = 12;
        this.setCardCount = 3;
        this.identifiers = 4;
        this.cardWidth = 160;
        this.cardHeight = 180;
    }
    /**
     * Returns the length of the cards on the board
     */
    get length() {
        return this.cards.length;
    }
    /**
     * Adds a card to the board's list of cards
     * @param {Card} card 
     */
    addCard(card) {
        this.cards.push(card);
    }
    /**
     * Removes a card from the board's list of cards
     * @param {Card} card 
     * @returns card
     */
    removeCard(card) {
        let cardIndex = this.cards.indexOf(card);
        return this.cards.splice(cardIndex, 1)[0];
    }
    /**
     * Draws a number of cards from the board's deck into the boards's list of cards
     * @param {*} count 
     */
    draw(count) {
        // Draws a number of cards based on count
        for (var i = 0; i < count; i++) {
            if(this.deck.length > 0){
                this.addCard(this.deck.randomDraw());
            }
        }
    }
    /**
     * Returns the list of cards on the board
     * @returns list
     */
    getCards() {
        return this.cards;
    }
    /**
     * Returns the board's deck
     * @returns deck
     */
    getDeck() {
        return this.deck;
    }
    /**
     * Returns the board's selected cards
     * @returns hand
     */
    getHand() {
        return this.hand;
    }
    /**
     * Returns the board's timer 
     * @returns Timer
     */
    getTimer() {
        return this.timer;
    }
    /**
     * Returns the board's points
     * @returns int
     */
    getPoints() {
        return this.points;
    }
    /**
     * Returns the board's pauser
     * @returns pauser
     */
    getPauser() {
        return this.pauser;
    }
    /**
     * Generates the board's cards by creating each card's HTML and listeners 
     * Updates the board's deck count, score and highlighted cards
     * Each card has a listener that when clicked, it selects the card and checks if there was a set
     * Given a set, it draws 3 more cards if possible and needed or ends the game
     * Updates score based on score success or failure
     * 
     *  */
    refreshBoard() {
        if(this.running == false){
            return;
        }
        let container = document.getElementById("card-container");
        container.innerHTML = "";
        let arr = this.cards;
        for(var i = 0; i < this.length; i++){
            // Creates a div for each card
            let card = document.createElement("div");
            card.setAttribute("id", "" + i);
            let vis = arr[i].number + arr[i].color + arr[i].shade + arr[i].shape + ".png";
            // Assigns that div an image based on the card's features
            card.innerHTML = "<img src=images/" + vis + " width = '" + this.cardWidth + "' height = '" + this.cardHeight + "'></img>";
            const self = this;
            // Adds a listener to each card when the card is clicked
            card.addEventListener("click", function(event) {
                let cardId = parseInt(event.currentTarget.id);
                let hand = self.getHand();
                // Select the card and highlight or unhighlight it
                self.selectById(cardId);
                self.highlightCards('green', self.hand.getCards());
                // If there are three highlighted cards, check if it was a set or not
                if (hand.length == self.setCardCount) {
                    var setFromSelected = self.validSet(hand.getCards());
                    if(setFromSelected) {
                        // If it was a set, add points, remove the cards from the board and draw more until a set exists in the board's list of cards
                        self.points+=self.setSuccessPoints;
                        hand.getCards().forEach(card => self.removeCard(card));
                        if(self.length < self.boardCardCount){
                            self.draw(self.setCardCount);
                        }
                        // End the game if it has not more sets or draw more cards if no set exists and there are cards in the deck
                        self.endOrLockCheck();
                        // Delay the card replacement animation for effect
                        setTimeout(function() {self.refreshBoard()}, self.animationDelay);
                    } else {
                        // Deduct points if the selected set was incorrect
                        self.points = Math.max(self.points + self.setFailPoints, 0);
                    }   
                    // Delay animations for effect
                    setTimeout(function() {self.scoreUpdate()}, self.animationDelay);
                    hand.clear();
                    setTimeout(function() {self.highlightCards('green', self.hand.getCards())}, self.animationDelay);
                }
            });
            container.append(card);
        }
        // Update the scoreboard and deck count
        this.deckCountUpdate();
        this.scoreUpdate();
        this.endOrLockCheck();
    }
    /**
     * Draws 3 more cards if the board there are no sets and the deck has cards
     * Ends the game if no more sets or cards to be drawn
     */
    endOrLockCheck(){
        while(this.getBoardSolutions().length == 0 && this.deck.length > 0){
            this.draw(3);
            this.refreshBoard();
        }
        if(this.getBoardSolutions().length == 0 && this.deck.length == 0){
            this.running = false;
            // End game by switching to end game page
            this.endFunction(this);
        }
    }
    /**
     * Selects a card in the board's list of cards given an index
     * @param {int} id 
     */
    selectById(id) {
        let card = this.cards[id];
        this.hand.select(card);
    }
    /**
     * Given a list of three cards, check if all three form a valid set by checking each identifier if they are all the same or different
     * @param {list} cards 
     * @returns bool
     */
    validSet(cards){
        // Checks each card's features by seeing if they are all the same or all different by using a set for unique checking
        for(let i = 0; i < this.identifiers; i++){
            let uniques = new Set();
            cards.forEach(card => uniques.add(card.features[i]));
            if(uniques.size == (this.setCardCount - 1)){
                return false;
            }
        }
        return true;
    }
    /**
     * Checks every combination of cards in the board's cards
     * Returns a list of each set of cards that form a valid set
     * @returns list of lists
     */
    getBoardSolutions() {
        let boardCards = this.cards;
        let boardSize = this.length;
        let setSolutions = new Array();
        // Iterates through every combination of cards in the board's list of cards
        for(let i = 0; i < boardSize; i++){
            for(let j = i + 1; j < boardSize; j++){
                for(let k = j + 1; k < boardSize; k++){
                    // If this set of cards is valid, add the solution to a list that will be returned
                    if(this.validSet([boardCards[i], boardCards[j], boardCards[k]])){
                        setSolutions.push([boardCards[i], boardCards[j], boardCards[k]]);
                    }
                }
            }
        }
        return setSolutions;
    }
    /**
     * Highlights 3 cards that form a valid set 
     */
    displaySolution() {
        let solutions = this.getBoardSolutions();
        let solution = solutions[0];
        this.hand.clear();
        // Highlight red three cards that form a set
        this.highlightCards('red', solution);
    }
    /**
     * Highlights 1 card that is apart of a valid set
     */
    displayHint() {
        let solution = this.getBoardSolutions()[0][0];
        this.hand.clear();
        // Highlight blue a card that is apart of a set
        this.highlightCards('blue', [solution]);
    }
    /**
     * Remove all gameboard's cards highlights
     * Given a list of cards, highlight those cards on the gameboard by giving the div a border of specified color 
     * @param {string} color 
     * @param {list} highlightedCards 
     * @returns 
     */
    highlightCards(color, highlightedCards) {
        if(this.running == false){
            return;
        }
        let cardNumber;
        let cardDiv;
        // Remove all card's current highlights on the board
        for(let i = 0; i < this.cards.length; i++){
            document.getElementById("" + i).style.border = '';
        }
        // Assign the specified colored highlighting to each specified card's div 
        for(let i = 0; i < highlightedCards.length; i++){
            cardNumber = this.cards.indexOf(highlightedCards[i]);
            cardDiv = document.getElementById("" + cardNumber);
            cardDiv.style.border = 'solid';
            cardDiv.style.borderColor = color;
        }
    }
    /**
     * Updates the deck count HTML div with the number of cards in the board's deck 
     */
    deckCountUpdate() {
        document.getElementById("deckCount").innerHTML = "Cards in Deck: ".concat(this.deck.length.toString());
    }
    /**
     * Updates the score HTML div with the board's score
     */
    scoreUpdate() {
        if(this.running == false){
            return;
        }
        document.getElementById("score").innerHTML = "Score: " + this.points.toString();
    }
}