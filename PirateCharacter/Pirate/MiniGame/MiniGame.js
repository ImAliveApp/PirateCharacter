var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MiniGame = (function () {
    function MiniGame() {
    }
    return MiniGame;
}());
var HideAndSeekMiniGame = (function (_super) {
    __extends(HideAndSeekMiniGame, _super);
    function HideAndSeekMiniGame(handler, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.finishCallback = finishCallback;
        return _this;
    }
    /**
     * This method gets called once when the user clicks on the 'Lets play' button in the Menu.
     * We use this method to initiate the game and display an explanation about it, so the user will know what to do.
     * @param currentTime The current system time.
     */
    HideAndSeekMiniGame.prototype.onStart = function (currentTime) {
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
    };
    HideAndSeekMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.actionManager.animateAlpha(0, 50);
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
        }
        else {
            this.catches = 0;
        }
        //game time is over.
        if (currentTime - this.startTime > this.gameTime * 1000) {
            this.finishCallback(false);
        }
    };
    HideAndSeekMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.gameStartTime;
        var remainingTime = 60 - ongoingTime / 1000;
        if (remainingTime < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (remainingTime < 40)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");
        this.menuManager.setProperty("progress", "Progress", remainingTime.toString());
    };
    HideAndSeekMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomX = Math.floor(Math.random() * this.configurationManager.getScreenWidth());
        var randomY = Math.floor(Math.random() * this.configurationManager.getScreenHeight());
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var currentY = this.characterManager.getCurrentCharacterYPosition();
        var disX = Math.abs(currentX - randomX);
        var disY = Math.abs(currentY - randomY);
        var moveX = currentX > randomX ? -disX : disX;
        var moveY = currentY > randomY ? -disY : disY;
        this.actionManager.move(moveX, moveY, 20);
    };
    HideAndSeekMiniGame.prototype.onEventOccured = function (eventName) {
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
    };
    return HideAndSeekMiniGame;
}(MiniGame));
//# sourceMappingURL=MiniGame.js.map