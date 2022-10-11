class Deck {
    /**
     * Deck class used to store Cards in a list, allowing for easy card generation, adding, and removing
     */
    constructor() {
        this.cards = new Array();
        this.populate();
    }
    /**
     * Returns the number of elements or cards in the card list
     */
    get length() {
        return this.cards.length;
    }
    /**
     * Creates a card from every combination of shapes, colors, numbers, and shades and adds it to the card list
     */
    populate() {
        let shapes = ["oval", "rectangle", "diamond"];
        let colors = ["red", "blue", "green"];
        let numbers = ["one", "two", "three"];
        let shades = ["solid", "striped", "outlined"];

        // Iterates all features to make a new card of every combination
        for(let shape of shapes){
            for(let color of colors){
                for(let number of numbers){
                    for(let shade of shades){
                        this.addCard(new Card(shape, color, number, shade));
                    }
                }
            }
        }
    }
    /**
     * Adds a card to the list of cards
     * @param {Card} card 
     */
    addCard(card) {
        this.cards.push(card);
    }
    /**
     * Randomly removes and returns a Card from the list of cards 
     * @returns Card
     */
    randomDraw() {
        let randomIndex = Math.floor(Math.random() * this.length);
        return this.cards.splice(randomIndex, 1)[0];
    }
}