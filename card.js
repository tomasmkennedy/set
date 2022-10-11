class Card {
    /**
     * Card class used to store features of the card
     * @param {String} shape 
     * @param {String} color 
     * @param {String} number 
     * @param {String} shade 
     */
    constructor(shape, color, number, shade) {
        this.shape = shape;
        this.color = color;
        this.number = number;
        this.shade = shade;
    }
    /**
     * Returns a list of each feature
     */
    get features() {
        return [this.shape, this.color, this.number, this.shade];
    }
}
