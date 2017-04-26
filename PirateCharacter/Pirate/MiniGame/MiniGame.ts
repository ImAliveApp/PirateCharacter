abstract class MiniGame {
    abstract onEventOccured(eventName: string): void;
    abstract onStart(currentTime: number): void;
    abstract onTick(currentTime: number): void;
}

class HideAndSeekMiniGame extends MiniGame {
    //explain the game here.
    private configurationManager: IConfigurationManager;
    private characterManager: ICharacterManager;
    private actionManager: IActionManager;
    private menuManager: IMenuManager;

    private finishCallback: (playerWon: boolean) => void;
    private gameStartTime: number;
    private startTime: number;
    private goalCatches: number;
    private catches: number;

    private gameTime: number

    public constructor(handler: IManagersHandler, finishCallback: (playerWon: boolean) => void) {
        super();

        this.menuManager = handler.getMenuManager();
        this.actionManager = handler.getActionManager();
        this.characterManager = handler.getCharacterManager();
        this.configurationManager = handler.getConfigurationManager();

        this.finishCallback = finishCallback;
    }

    /**
     * This method gets called once when the user clicks on the 'Lets play' button in the Menu.
     * We use this method to initiate the game and display an explanation about it, so the user will know what to do.
     * @param currentTime The current system time.
     */
    onStart(currentTime: number): void {
        this.catches = 0;
        this.goalCatches = Math.floor(Math.random() * 20) + 1; //number of times to catch (number between 1-21)
        this.gameTime = Math.floor(this.goalCatches * Math.random() * 10) + 5; //total time to catch/play (number between 5-215)

        this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);

        //Displaying an explainer message for 10 seconds.
        this.actionManager.showMessage("This is a hide and seek game! i will hide, and your job is to catch me "
            + this.goalCatches + " times in "
            + this.gameTime
            + " seconds! :D \n(The phone will vibrate everytime you catch me)", "#6599FF", "#ffffff", 10000);

        this.menuManager.setProperty("progress", "maxprogress", this.gameTime.toString());
        this.menuManager.setProperty("progress", "progress", this.gameTime.toString());
        this.startTime = currentTime;

        //the game will start after 10 seconds.
        this.gameStartTime = this.startTime + 10000;
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param currentTime The current time (in milliseconds) on the device.
     */
    onTick(currentTime: number): void {
        if (currentTime > this.gameStartTime) {//game has started.
            this.actionManager.animateAlpha(0, 50);
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
        }
        else {//game hasn't started yet.
            this.catches = 0;
        }

        //game time is over.
        if (currentTime - this.startTime > this.gameTime * 1000) {
            this.finishCallback(false);
        }
    }

    private updateProgress(currentTime: number): void {
        let ongoingTime = currentTime - this.gameStartTime;
        let remainingTime = this.gameTime - ongoingTime / 1000;

        if (remainingTime < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (remainingTime < 40)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");

        this.menuManager.setProperty("progress", "Progress", remainingTime.toString());
    }

    private moveToRandomLocation(currentTime: number): void {
        let randomX = Math.floor(Math.random() * this.configurationManager.getScreenWidth());
        let randomY = Math.floor(Math.random() * this.configurationManager.getScreenHeight());

        let currentX = this.characterManager.getCurrentCharacterXPosition();
        let currentY = this.characterManager.getCurrentCharacterYPosition();

        let disX = Math.abs(currentX - randomX);
        let disY = Math.abs(currentY - randomY);

        let moveX = currentX > randomX ? -disX : disX;
        let moveY = currentY > randomY ? -disY : disY;

        this.actionManager.move(moveX, moveY, 20);
    }

    onEventOccured(eventName: string): void {
        switch (eventName) {
            case "touch":
                this.catches++;
                this.actionManager.showSystemMessage("catches: " + this.catches.toString());
                this.actionManager.vibrate(250);
                if (this.catches >= this.goalCatches) {
                    this.finishCallback(true);
                    return;
                }
                break;

            case "stop":
                if (this.configurationManager.getCurrentTime().currentTimeMillis - this.gameStartTime > 0)
                    this.finishCallback(false);

                break;
        }
    }
}

class ReflexMiniGame extends MiniGame {
    private configurationManager: IConfigurationManager;
    private characterManager: ICharacterManager;
    private actionManager: IActionManager;
    private menuManager: IMenuManager;

    private finishCallback: (playerWon: boolean) => void;
    private gameStartTime: number;
    private startTime: number;
    private touches: number;

    private lastDecreaseTime: number;

    private difficulty: number;
    private dancingTime: number;
    private currentDrawable: string;

    private progress: number

    public constructor(handler: IManagersHandler, finishCallback: (playerWon: boolean) => void) {
        super();

        this.menuManager = handler.getMenuManager();
        this.actionManager = handler.getActionManager();
        this.characterManager = handler.getCharacterManager();
        this.configurationManager = handler.getConfigurationManager();

        this.finishCallback = finishCallback;
    }

    /**
     * This method gets called once when the user clicks on the 'Lets play' button in the Menu.
     * We use this method to initiate the game and display an explanation about it, so the user will know what to do.
     * @param currentTime The current system time.
     */
    onStart(currentTime: number): void {
        this.lastDecreaseTime = currentTime;
        this.touches = 1;
        this.progress = 50;
        this.dancingTime = 0;
        this.currentDrawable = "breathing.png";

        this.difficulty = Math.random() * 100;

        let difficultyTrimmed = this.difficulty.toString().substring(0, 4);

        this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);

        //Displaying an explainer message for 10 seconds.
        this.actionManager.showMessage("This is a reflex game! i will walk around the screen, and you will need to touch me ,but ONLY while i DANCE! :D "
            + "\nOnce the progress bar in the menu will reach 100%, you will win! but if it reaches 0%... i will win! :D"
            + "\nThe phone will vibrate everytime you do it incorrectly"
            + "\nDifficulty: " + difficultyTrimmed, "#6599FF", "#ffffff", 10000);

        this.menuManager.setProperty("progress", "maxprogress", "100");
        this.menuManager.setProperty("progress", "progress", this.progress.toString());
        this.startTime = currentTime;

        //the game will start after 10 seconds.
        this.gameStartTime = this.startTime + 10000;
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param currentTime The current time (in milliseconds) on the device.
     */
    onTick(currentTime: number): void {
        if (currentTime > this.gameStartTime) {//game has started.
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
            this.maybeDance(currentTime);
            this.drawCurrentState();
        }
        else {//game hasn't started yet.
            this.lastDecreaseTime = currentTime;
            this.touches = 1;
        }
    }

    private updateProgress(currentTime: number): void {
        let ongoingTime = currentTime - this.lastDecreaseTime;
        if (ongoingTime > 1000) {
            this.progress = this.progress - 1 - this.difficulty/100;
            this.lastDecreaseTime = currentTime;
        }

        if (this.progress <= 0) {
            this.finishCallback(false);
        }

        if (this.progress < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (this.progress < 60)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");

        this.menuManager.setProperty("progress", "Progress", this.progress.toString());
    }

    private moveToRandomLocation(currentTime: number): void {
        let randomMove = Math.floor(Math.random() * this.difficulty * 50) - Math.floor(Math.random() * this.difficulty * 50);//move the x,y in a number between(-difficulty * 50, +difficulty * 50)

        this.actionManager.move(randomMove, randomMove, 250);
    }

    private maybeDance(currentTime: number): void {
        if (currentTime > this.dancingTime) {
            this.currentDrawable = "breathing.png";
        }

        let danceChance = (100 - this.progress) / 100;
        if (danceChance < 0.15)
            danceChance = 0.15;

        if (Math.random() < danceChance) {
            this.dancingTime = currentTime + danceChance * 2000;
            this.currentDrawable = "pirate-dancing.png";
        }
    }

    private drawCurrentState(): void {
        this.actionManager.draw(this.currentDrawable, this.configurationManager.getMaximalResizeRatio(), false);
    }

    onEventOccured(eventName: string): void {
        let now = this.configurationManager.getCurrentTime().currentTimeMillis;
        switch (eventName) {
            case "touch":
                this.handleTouch(now);
                break;

            case "stop":
                if (now - this.gameStartTime > 0)
                    this.finishCallback(false);

                break;
        }
    }

    private handleTouch(currentTime: number): void {
        if (currentTime > this.dancingTime) {//touched when the pirate wasn't dancing.
            this.progress -= this.touches;
            this.actionManager.vibrate(250);
            this.touches--;
            this.actionManager.showSystemMessage("BAD " + this.progress.toString());
        }
        else {
            this.touches++;
            this.actionManager.showSystemMessage("Good :" + this.progress.toString());
            this.progress += this.touches;
        }

        if (this.progress <= 0)
            this.finishCallback(false);
        else if (this.progress >= 100)
            this.finishCallback(true);

        this.currentDrawable = "breathing.png";
    }
}