class Pauser {
    /**
     * Pauser class that holds the interval that puts a pause screen when the page is unfocused
     */
    constructor() {
        this.id = null;
        this.isPaused = false;
    }
    /**
     * Assigns the object's interval
     * @param {*} Id 
     */
    setId(Id) {
        this.id = Id;
    }
    /**
     * Assigns the object's pause status
     * @param {*} pause 
     */
    setPause(pause) {
        this.isPaused = pause;
    }
    /**
     * Returns the object's pause status
     * @returns bool
     */
    pauseCheck() {
        return this.isPaused;
    }
    /**
     * Stops the object's interval 
     */
    stop() {
        clearInterval(this.id);
    }
}