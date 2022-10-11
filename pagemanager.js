class PageManager {
    /**
     * PageManager class that controls what page is being displayed on the website
     * Involves generating each page's html and listeners
     * When switching to a new page, it removes the old page and generates the new page
     */
    constructor(){
        this.generateHomePage();
    }
    /**
     * Creates a new game and sets up it's buttons
     */
    start() {
        let game = this.newGame();
        this.setup(game);
    }   
    /**
     * Creates a GameBoard and all additional classes for it
     * This creates a new game, draws 12 cards, and refreshes the board
     * Sets up the pauser function that runs and pauses when the screen loses focus
     * @returns Board
     */
    newGame() {
        let deck = new Deck();
        let hand = new Hand();
        let timer = new Timer();
        let pauser = new Pauser();
        let self = this;
        let endFunction = function(board) { self.generateEndPage(board) };
        let gameBoard = new Board(deck, hand, timer, endFunction, pauser);
        gameBoard.draw(12);
        gameBoard.refreshBoard();

        // Sets up the pauser that pauses the screen when the screen loses focus
        gameBoard.pauser.setId(setInterval(function () {
            let x = document.getElementById("hider-bg")
            let y = document.getElementById("hider")
            // Covers the screen if the document is not in focus
            if (!document.hasFocus()) {
                x.style.display = "block"
                y.style.display = "block"
                // Stops timer while out of focus
                if (!gameBoard.pauser.pauseCheck()) {
                    gameBoard.getTimer().stop()
                    gameBoard.pauser.setPause(true)
                }
            }
            // Removes the cover when it is in focus
            if (document.hasFocus()) {
                x.style.display = "none"
                y.style.display = "none"
                // Resumts timer when back in focus
                if (gameBoard.pauser.pauseCheck()) {
                    gameBoard.getTimer().start()
                    gameBoard.pauser.setPause(false)
                }
            }
        }, 100));
        return gameBoard;
    }
    /**
     * Sets up buttons for the board
     * @param {Board} gameBoard 
     */
    setup(gameBoard) {
        this.setupButtons(gameBoard);
    }
    /**
     * Resets the game by stopping old timers and creates a new game and buttons
     * @param {Board} gameBoard 
     */
    reset(gameBoard) {
        gameBoard.getTimer().stop();
        gameBoard.getPauser().stop();
        gameBoard = null;
        let game = this.newGame();
        this.setupButtons(game);
    }
    /**
     * Sets up reset, find-set, hint, and end button by generating their HTML and adding listeners with functions for them
     * @param {Board} gameBoard 
     */
    setupButtons(gameBoard) {
        let buttons = document.getElementById("buttons-container");
        this.clearDiv(buttons);
        // Sets up the game buttons HTML
        buttons.append((Object.assign(this.makeElement("input", {type: 'button', className: 'button', id: 'reset', value: "Restart"}))));
        buttons.append(Object.assign(this.makeElement("input", {type: 'button', className: 'button', id: 'find-set', value: "Find Set"})));
        buttons.append(Object.assign(this.makeElement("input", {type: 'button', className: 'button', id: 'hint', value: "Hint"})));
        buttons.append(Object.assign(this.makeElement("input", {type: 'button', className: 'button', id: 'end', value: "End Game"})));
    
        let self = this;
        // Adds listeners to each button with their respective functions
        document.getElementById('reset').addEventListener("click", function() { self.reset(gameBoard) });
        document.getElementById('end').addEventListener("click", function() { self.generateEndPage(gameBoard) });
        document.getElementById('find-set').addEventListener("click", function() { gameBoard.displaySolution() });
        document.getElementById('hint').addEventListener("click", function() { gameBoard.displayHint() });
    }
    /**
     * Clears a div's innerHTML
     * @param {*} div 
     */
    clearDiv(div){
        div.innerHTML = "";
    }
    /**
     * Creates an html element given its type and parameters
     * @param {String} type 
     * @param {Object} parameters 
     * @returns element
     */
    makeElement(type, parameters) {
        return Object.assign(document.createElement(type), parameters);
    }
    /**
     * Generates the home page's navigation bar and main menu HTML
     * Sets up a listener to switch pages when clicking the play button
     */
    generateHomePage() {
        let body = document.body;
        this.clearDiv(body);
        // Creates HTML and listeners for the home page
        this.addNavBar(body);
        this.addMainMenu(body);
        let self = this;
        document.getElementById('play-button').addEventListener("click", function() { self.generateGamePage() });
    }
        
    /**
     * Generates the game page's navigation bar, timer, scoreboard, cards, buttons, and pauser HTML
     */
    generateGamePage() {
        let body = document.body;
        // Creates HTML and listeners for the game
        this.clearDiv(body);
        this.addNavBar(body);
        this.addTimer(body);
        this.addScoreboard(body);
        this.addContent(body);
        this.addButtons(body);
        this.addHider(body);
        // Starts the initilization of the game objects
        this.start();
    }
    
    /**
     * Generates the end page's navigation bar and scoreboard HTML given the Board just played
     * Sets up a listener to switch pages when clicking the home button
     * @param {Board} gameBoard 
     */
    generateEndPage(gameBoard) {
        gameBoard.getPauser().stop();
        let body = document.body;
        this.clearDiv(body);
        // Creates HTML and listeners for the game
        this.addNavBar(body);
        this.addEndScoreboard(body);
        document.getElementById('points').innerHTML = 'Points Scored: ' + gameBoard.points;
        document.getElementById('time').innerHTML = 'Time Taken: ' + gameBoard.getTimer().timeAsString();
        document.getElementById("buttons-container").append(this.makeElement("input", {type: 'button', className: 'button', id: 'home', value: 'Return Home'}));
        let self = this;
        document.getElementById('home').addEventListener("click", function() { self.generateHomePage() });
    }
    /**
     * Creates the navigation bar by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addNavBar(div) {
        // Creates HTML elements
        let navBar = this.makeElement("div", {className: 'navbar'});
        let navItem1 = this.makeElement("div", {className: 'nav-item-1'});
        let navItem2 = this.makeElement("div", {className: 'nav-item-2'});
        let navList = this.makeElement("ul", {className: 'navbar-list'});
        let listItem = this.makeElement("li", {className: 'navbar-item'});
        let navTitle = this.makeElement("h1", {className: 'nav-item-1', id: 'navbar-title', innerHTML:"SET" });
        let navRef = this.makeElement("a", {className: 'navbar-link', href: 'howtoplay.html', innerHTML: "How to play" });
    
        // Nests the HTML elements
        navItem1.append(navTitle);
        listItem.append(navRef);
        navBar.append(navItem1);
        navBar.append(navItem2);
        navItem2.append(navList);
        navList.append(listItem);
        div.append(navBar);
    }
    /**
     * Creates the main menu by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addMainMenu(div){
        // Creates HTML elements
        let mainContainer = this.makeElement("div", {className: 'main-container'});
        let emptyDiv = this.makeElement("div", {});
        let header = this.makeElement("h1", {innerHTML: 'SET GAME'});
        let paragraph = this.makeElement("p", {innerHTML: 'Click play to begin!'});
        let gameModeContainer = this.makeElement("div", {className: 'gamemode-container'});
        let gameModeCard = this.makeElement("div", {className: 'gamemode-card'});
        let cardHeader = this.makeElement("h3", {innerHTML: 'Single Player'});
        let cardInput = this.makeElement("input", {id: 'play-button', className: 'button-home', type: 'button', value: 'Play!'});

        // Nests the HTML elements
        mainContainer.append(emptyDiv);
        emptyDiv.append(header, paragraph, gameModeContainer);
        gameModeContainer.append(gameModeCard);
        gameModeCard.append(cardHeader, cardInput);
        div.append(mainContainer);
    }
    /**
     * Creates the timer by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addTimer(div){
        // Creates HTML elements
        let timerDiv = this.makeElement("div", {className: 'timer'});
        let timeDiv = this.makeElement("div", {className: 'time'});
        // Nests the HTML elements
        timerDiv.append(timeDiv);
        div.append(timerDiv);
    }
    /**
     * Creates the scoreboard by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addScoreboard(div) {
        // Creates HTML elements
        let scoreBoard = this.makeElement("div", {className: 'scoreboard'});
        let row = this.makeElement("div", {className: 'row'});
        let left = this.makeElement("div", {className: 'leftScore'});
        let right = this.makeElement("div", {className: 'rightDeckCount'});
        let score = this.makeElement("h2", {id: 'score', innerHTML: 'Score: 0'});
        let deck = this.makeElement("h2", {id: 'deckCount', innerHTML: 'Cards in Deck: 0'});
        // Nests the HTML elements
        scoreBoard.append(row);
        row.append(left, right);
        left.append(score);
        right.append(deck);
        div.append(scoreBoard);
    }
    /**
     * Creates the content container by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addContent(div) {
        let cardsContainer = this.makeElement("div", {className: 'cards-container', id: 'card-container'});
        div.append(cardsContainer);
    }
    /**
     * Creates the button container by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addButtons(div) {
        let buttonContainer = this.makeElement("div", {className: 'buttons-container', id: 'buttons-container'});
        div.append(buttonContainer);
    }
    /**
     * Creates the hider by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addHider(div) {
        // Creates HTML elements
        let background = this.makeElement("div", { id: 'hider-bg' })
        let hider = this.makeElement("div", { id: 'hider', innerHTML: 'Paused' })
        // Nests the HTML elements
        div.append(background);
        div.append(hider);
    }
    /**
     * Creates the end buttons by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addEndButtons(div) {
        let buttonContainer = this.makeElement("div", {className: 'buttons-container-end', id: 'buttons-container'});
        div.append(buttonContainer);
    }
    /**
     * Creates the end scoreboard by generating elements and nesting them into the given div
     * @param {*} div 
     */
    addEndScoreboard(div){
        // Creates HTML elements
        let scoreboard = this.makeElement("div", {className: 'main-container'});
        let emptyDiv = this.makeElement("div", {});
        let header = this.makeElement("h1", {innerHTML: 'Game over!'});
        let score = this.makeElement("p", {id: 'points'});
        let time = this.makeElement("p", {id: 'time'});
        let buttonContainer = this.makeElement("div", {className: 'buttons-container-end', id: 'buttons-container'});
        // Nests the HTML elements
        scoreboard.append(emptyDiv);
        emptyDiv.append(header,score,time, buttonContainer);
        div.append(scoreboard);
    }
}