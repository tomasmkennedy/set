class Timer {
    /**
     * Timer class that keeps track of how long the game has been running
     */
    constructor(){
        this.seconds = 0;
        this.interval = setInterval(this.timer.bind(this), 1000);
        this.time_el = document.querySelector('.timer .time');
        this.time_el.innerText = `${'00'}:${'00'}:${'00'}`;
    }
    /**
     * Increments the time by a second and updates the timer display
     */
    timer() {
        this.seconds++;

        let hrs = Math.floor(this.seconds / 3600);
        let mins = Math.floor((this.seconds - (hrs * 3600)) / 60);
        let sec = this.seconds % 60;
        let singleDigitCutOff = 10;

        if (sec < singleDigitCutOff) sec = '0' + sec;
        if (mins < singleDigitCutOff) mins = '0' + mins;
        if (hrs < singleDigitCutOff) hrs = '0' + hrs;

        this.time_el.innerText = `${hrs}:${mins}:${sec}`;
    }
    /**
     * Starts the timer's interval
     */
    start() {
        this.interval = setInterval(this.timer.bind(this), 1000);
    }
    /**
     * Stops the timer's interval
     */
    stop() {
        clearInterval(this.interval);
    }
    /**
     * Resets the timer's time to a given time
     * @param {int} time 
     */
    reset(time) {
        this.seconds = time;
    }
    /**
     * Returns a string of the number of hours, minutes, and seconds in a readable string
     * @returns string
     */
    timeAsString() {
        let hrs = Math.floor(this.seconds / 3600);
        let mins = Math.floor((this.seconds - (hrs * 3600)) / 60);
        let sec = this.seconds % 60;
        let message = ''
        // Does not return a string of hours or minutes if they are 0
        if(hrs > 0) { message+= hrs + ' hours '}
        if(mins > 0) { message+= mins + ' minutes '}
        message+= sec + ' seconds '
        return message;
    }
}