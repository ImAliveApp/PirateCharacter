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
var PirateState = (function () {
    function PirateState(switchContext) {
        this.switchContext = switchContext;
        this.wordsEvaluator = new WordsEvaluator();
    }
    Object.defineProperty(PirateState, "WALK_TIME", {
        get: function () { return 1000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "SLEEPING", {
        get: function () { return "sleeping"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "PASSIVE", {
        get: function () { return "passive"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "ACTIVE", {
        get: function () { return "active"; },
        enumerable: true,
        configurable: true
    });
    ;
    PirateState.prototype.onStart = function (handler) {
        var _this = this;
        this.categoryOnScreen = "";
        this.walking = false;
        this.managersHandler = handler;
        this.menuManager = handler.getMenuManager();
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.characterManager = handler.getCharacterManager();
        this.configurationManager = handler.getConfigurationManager();
        this.speechToTextManager = handler.getSpeechToTextManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.timerTrigger = new TimerTriggerSystem(function () { return _this.configurationManager.getCurrentTime().currentTimeMillis; });
    };
    PirateState.prototype.walkRandomally = function () {
        var screenWidth = this.configurationManager.getScreenWidth();
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var distanceToMove = Math.abs(currentX - screenWidth);
        var category = AgentConstants.ON_FALLING_RIGHT;
        this.walking = true;
        if (this.shouldEventHappen(0.5) && distanceToMove > screenWidth / 4) {
            this.actionManager.move(distanceToMove / 3, 0, PirateState.WALK_TIME);
        }
        else {
            this.actionManager.move(-distanceToMove / 3, 0, PirateState.WALK_TIME);
            category = AgentConstants.ON_FALLING_LEFT;
        }
        this.drawAndPlayRandomResourceByCategory(category);
    };
    PirateState.prototype.shouldEventHappen = function (chance) {
        return Math.random() < chance;
    };
    PirateState.prototype.drawAndPlayRandomResourceByCategory = function (category) {
        if (this.playingMiniGame)
            return;
        var resToDraw = this.resourceManagerHelper.chooseRandomImage(category);
        if (resToDraw != this.categoryOnScreen)
            this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        this.categoryOnScreen = category;
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound(category);
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    return PirateState;
}());
var PassiveSubstate;
(function (PassiveSubstate) {
    PassiveSubstate[PassiveSubstate["LookingAround"] = 0] = "LookingAround";
    PassiveSubstate[PassiveSubstate["Eating"] = 1] = "Eating";
    PassiveSubstate[PassiveSubstate["Drinking"] = 2] = "Drinking";
    PassiveSubstate[PassiveSubstate["Reading"] = 3] = "Reading";
    PassiveSubstate[PassiveSubstate["DoingSomethingStupid"] = 4] = "DoingSomethingStupid";
    PassiveSubstate[PassiveSubstate["RespondsToEvents"] = 5] = "RespondsToEvents";
    PassiveSubstate[PassiveSubstate["AskingForInteraction"] = 6] = "AskingForInteraction";
    PassiveSubstate[PassiveSubstate["WalkingAround"] = 7] = "WalkingAround";
})(PassiveSubstate || (PassiveSubstate = {}));
var PassiveState = (function (_super) {
    __extends(PassiveState, _super);
    function PassiveState(switchContext) {
        var _this = _super.call(this, switchContext) || this;
        _this.playingMiniGame = false;
        return _this;
    }
    Object.defineProperty(PassiveState, "LOOKING_AROUND_CHANGE", {
        get: function () { return 0.1; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "CHANCE_SWITCH_TO_FUN", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "CHANGE_PASSIVE_STATE", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "EATING_TIME", {
        get: function () { return 10000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "READING_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "HAVING_FUN_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "ASKING_FOR_INTERACTION_TIME", {
        get: function () { return 15000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "DOING_SOMETHING_STUPID_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    PassiveState.prototype.initializeState = function () {
    };
    PassiveState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
        this.lastPlayGameClick = 0;
        this.currentState = PassiveSubstate.LookingAround;
        this.playerWinMessages = ["Very well done! but i'll win next time! for sure :D", "Argh! this is the last time that you win!",
            "What?!? how did you win?! you CHEATER!", "Nice job! you are really good at this :D", "Wooooot, you won this one!, nice! "];
        this.playerLoseMessages = ["Ahahaha, i won!", "You really thought you could win? ehehehe", "Phew, it was close! keep on training!",
            "That was fun! because i won :D", "You really expected a different outcome??"];
    };
    PassiveState.prototype.onTick = function (time) {
        if (this.playingMiniGame) {
            this.miniGame.onTick(time);
            return;
        }
        switch (this.currentState) {
            case PassiveSubstate.LookingAround:
                this.lookingAroundTick(time);
                break;
            case PassiveSubstate.Eating:
                this.eatingTick(time);
                break;
            case PassiveSubstate.Drinking:
                this.drinkingTick(time);
                break;
            case PassiveSubstate.Reading:
                this.readingTick(time);
                break;
            case PassiveSubstate.DoingSomethingStupid:
                this.doingSomethingStupidTick(time);
                break;
            case PassiveSubstate.RespondsToEvents:
                this.respondsToEventsTick(time);
                break;
            case PassiveSubstate.AskingForInteraction:
                this.askingForInteractionTick(time);
                break;
            case PassiveSubstate.WalkingAround:
                this.walkingAroundTick(time);
                break;
        }
    };
    PassiveState.prototype.lookingAroundTick = function (time) {
        if (this.shouldEventHappen(PassiveState.LOOKING_AROUND_CHANGE)) {
            if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.actionManager.stopSound();
                this.currentState = PassiveSubstate.DoingSomethingStupid;
                this.timerTrigger.set("doingSomethingStupid", PassiveState.DOING_SOMETHING_STUPID_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.actionManager.stopSound();
                this.currentState = PassiveSubstate.Eating;
                this.timerTrigger.set("eating", PassiveState.EATING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.actionManager.stopSound();
                this.currentState = PassiveSubstate.Reading;
                this.timerTrigger.set("reading", PassiveState.READING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.actionManager.stopSound();
                this.currentState = PassiveSubstate.Drinking;
                this.timerTrigger.set("drinking", PassiveState.EATING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.actionManager.stopSound();
                this.currentState = PassiveSubstate.AskingForInteraction;
                this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANCE_SWITCH_TO_FUN)) {
                this.switchToFunState();
            }
            else {
                this.actionManager.stopSound();
                this.walkRandomally();
                this.currentState = PassiveSubstate.WalkingAround;
                this.timerTrigger.set("walkingAround", PirateState.WALK_TIME);
            }
        }
        else
            this.lookingAroundEmote(time);
    };
    PassiveState.prototype.lookingAroundEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("lookingAround");
    };
    PassiveState.prototype.eatingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    };
    PassiveState.prototype.eatingEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("eating");
    };
    PassiveState.prototype.drinkingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("drinking")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.drinkingEmote(time);
    };
    PassiveState.prototype.drinkingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("drinking");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    PassiveState.prototype.readingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    };
    PassiveState.prototype.readingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("reading");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    PassiveState.prototype.askingForInteractionTick = function (time) {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    };
    PassiveState.prototype.askingForInteractionEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("askingForInteraction");
    };
    PassiveState.prototype.doingSomethingStupidTick = function (time) {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    };
    PassiveState.prototype.doingSomethingStupidEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("doingSomethingStupid");
    };
    PassiveState.prototype.respondsToEventsTick = function (time) {
    };
    PassiveState.prototype.walkingAroundTick = function (time) {
        if (!this.timerTrigger.isOnGoing("walkingAround")) {
            this.actionManager.stopSound();
            this.walking = false;
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
    };
    PassiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    PassiveState.prototype.onPhoneEventOccurred = function (eventName) {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.switchToFunState();
        }
    };
    PassiveState.prototype.switchToFunState = function () {
        this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
        this.actionManager.stopSound();
        this.switchContext.switchTo(PirateState.ACTIVE);
    };
    PassiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    PassiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    PassiveState.prototype.onPick = function (currentX, currentY) {
        if (this.playingMiniGame) {
            this.miniGame.onEventOccured("touch");
        }
        else {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
        }
    };
    PassiveState.prototype.onMenuItemSelected = function (itemName) {
        switch (itemName) {
            case "speakButton":
                if (!this.speechToTextManager.isSpeechRecognitionAvailable() || this.playingMiniGame)
                    return;
                this.speechToTextManager.stopSpeechRecognition();
                this.speechToTextManager.startSpeechRecognition();
                break;
            case "playButton":
                if (this.playingMiniGame) {
                    this.miniGame.onEventOccured("stop");
                }
                else {
                    var now = this.configurationManager.getCurrentTime().currentTimeMillis;
                    if (now - this.lastPlayGameClick < 2000)
                        return;
                    this.lastPlayGameClick = now;
                    this.playRandomMiniGame(now);
                }
                break;
        }
    };
    PassiveState.prototype.onResponseReceived = function (response) {
    };
    PassiveState.prototype.onLocationReceived = function (location) {
    };
    PassiveState.prototype.onUserActivityStateReceived = function (state) {
    };
    PassiveState.prototype.onHeadphoneStateReceived = function (state) {
    };
    PassiveState.prototype.onWeatherReceived = function (weather) {
    };
    PassiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    PassiveState.prototype.onSpeechRecognitionResults = function (results) {
        if (this.wordsEvaluator.containsBadWord(results) && !this.playingMiniGame) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.AskingForInteraction;
            this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
        }
    };
    PassiveState.prototype.onPlacesReceived = function (places) { };
    PassiveState.prototype.playRandomMiniGame = function (currentTime) {
        var _this = this;
        if (this.playingMiniGame)
            return;
        if (currentTime < this.noPlayPenaltyTime) {
            this.actionManager.showMessage("I said that i don't want to play right now!!", "#4C4D4F", "#ffffff", 2000);
            this.noPlayPenaltyTime = currentTime + 10000;
            return;
        }
        if (this.shouldEventHappen(0.6)) {
            this.actionManager.showMessage("I don't want to play right now..", "#4C4D4F", "#ffffff", 2000);
            this.noPlayPenaltyTime = currentTime + 10000;
            return;
        }
        this.menuManager.setProperty("playButton", "Text", "Surrender");
        this.playingMiniGame = true;
        var randomNumber = Math.random() * 100;
        if (randomNumber <= 30) {
            this.miniGame = new HideAndSeekMiniGame(this.managersHandler, function (playerWon) {
                _this.actionManager.animateAlpha(1, 200);
                _this.miniGameOver(playerWon);
            });
        }
        else if (randomNumber <= 60) {
            this.miniGame = new CatchMiniGame(this.managersHandler, this.resourceManagerHelper, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        else {
            this.miniGame = new ReflexMiniGame(this.managersHandler, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        this.miniGame.onStart(this.configurationManager.getCurrentTime().currentTimeMillis);
    };
    PassiveState.prototype.miniGameOver = function (playerWon) {
        this.actionManager.move(-this.configurationManager.getScreenWidth(), this.configurationManager.getScreenHeight(), 20);
        this.playingMiniGame = false;
        var messageIndex = Math.floor(Math.random() * 4);
        if (playerWon) {
            this.actionManager.draw("pirate__laughing.png", this.configurationManager.getMaximalResizeRatio(), false);
            this.actionManager.showMessage(this.playerWinMessages[messageIndex], "#91CA63", "#ffffff", 5000);
        }
        else {
            this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);
            this.actionManager.showMessage(this.playerLoseMessages[messageIndex], "#EC2027", "#ffffff", 5000);
        }
        this.menuManager.setProperty("playButton", "Text", "Let's play!");
        this.menuManager.setProperty("progress", "maxprogress", "100");
        this.menuManager.setProperty("progress", "progress", "0");
    };
    return PassiveState;
}(PirateState));
var SleepingSubstate;
(function (SleepingSubstate) {
    SleepingSubstate[SleepingSubstate["Normal"] = 0] = "Normal";
    SleepingSubstate[SleepingSubstate["Nap"] = 1] = "Nap";
    SleepingSubstate[SleepingSubstate["Angry"] = 2] = "Angry";
})(SleepingSubstate || (SleepingSubstate = {}));
var SleepingState = (function (_super) {
    __extends(SleepingState, _super);
    function SleepingState(switchContext) {
        return _super.call(this, switchContext) || this;
    }
    Object.defineProperty(SleepingState, "ANNOYED_TO_NORMAL_TIME", {
        get: function () { return 5000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "SNORE_TO_NORMAL_TIME", {
        get: function () { return 5000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "ANNOYED_EMOTE_CHANCE", {
        get: function () { return 0.25; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "NORMAL_TO_SNORE_CHANCE", {
        get: function () { return 0.0027; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "SNORE_TO_SLEEP_WALK_CHANCE", {
        get: function () { return 0.001; },
        enumerable: true,
        configurable: true
    });
    SleepingState.prototype.initializeState = function () {
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onTick = function (time) {
        var now = this.configurationManager.getCurrentTime();
        if (now.Hour < 22 && now.Hour > 8) {
            this.switchContext.switchTo(PirateState.PASSIVE);
            this.actionManager.stopSound();
            return;
        }
        switch (this.currentState) {
            case SleepingSubstate.Normal:
                this.normalTick(time);
                break;
            case SleepingSubstate.Nap:
                this.napTick(time);
                break;
            case SleepingSubstate.Angry:
                this.angryTick(time);
                break;
        }
    };
    SleepingState.prototype.normalTick = function (time) {
        if (!this.configurationManager.isSoundPlaying()) {
            this.normalEmote(time);
        }
        if (this.shouldEventHappen(0.25)) {
            this.actionManager.stopSound();
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    };
    SleepingState.prototype.normalEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("sleeping-normal");
    };
    SleepingState.prototype.napTick = function (time) {
        if (!this.timerTrigger.isOnGoing("sleep_nap")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.napEmote(time);
    };
    SleepingState.prototype.napEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("sleeping-nap");
    };
    SleepingState.prototype.angryTick = function (time) {
        if (!this.timerTrigger.isOnGoing("angry")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.angryEmote(time);
    };
    SleepingState.prototype.angryEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("angry");
    };
    SleepingState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    SleepingState.prototype.onPhoneEventOccurred = function (eventName) {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.actionManager.stopSound();
            this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Angry;
        }
    };
    SleepingState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    SleepingState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    SleepingState.prototype.onPick = function (currentX, currentY) {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onMenuItemSelected = function (itemName) {
        this.actionManager.showMessage("Zzz Zzz Zzzzzzz", "#000000", "#ffffff", 2000);
    };
    SleepingState.prototype.onResponseReceived = function (response) {
    };
    SleepingState.prototype.onLocationReceived = function (location) {
    };
    SleepingState.prototype.onUserActivityStateReceived = function (state) {
    };
    SleepingState.prototype.onHeadphoneStateReceived = function (state) {
    };
    SleepingState.prototype.onWeatherReceived = function (weather) {
    };
    SleepingState.prototype.onConfigureMenuItems = function (menuBuilder) {
    };
    SleepingState.prototype.onSpeechRecognitionResults = function (results) {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Angry;
        this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
    };
    SleepingState.prototype.onPlacesReceived = function (places) { };
    return SleepingState;
}(PirateState));
var ActiveSubstate;
(function (ActiveSubstate) {
    ActiveSubstate[ActiveSubstate["Fun"] = 0] = "Fun";
})(ActiveSubstate || (ActiveSubstate = {}));
var ActiveState = (function (_super) {
    __extends(ActiveState, _super);
    function ActiveState(switchContext) {
        return _super.call(this, switchContext) || this;
    }
    ActiveState.prototype.initializeState = function () {
        this.currentState = ActiveSubstate.Fun;
    };
    ActiveState.prototype.onTick = function (time) {
        switch (this.currentState) {
            case ActiveSubstate.Fun:
                this.onFunTick(time);
                break;
        }
    };
    ActiveState.prototype.onFunTick = function (time) {
        if (!this.timerTrigger.isOnGoing("fun")) {
            this.switchContext.switchTo(PirateState.PASSIVE);
            this.actionManager.stopSound();
            return;
        }
        this.funEmote(time);
    };
    ActiveState.prototype.funEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("fun");
    };
    ActiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    ActiveState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
    };
    ActiveState.prototype.onPhoneEventOccurred = function (eventName) {
    };
    ActiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    ActiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    ActiveState.prototype.onPick = function (currentX, currentY) {
    };
    ActiveState.prototype.onMenuItemSelected = function (itemName) {
    };
    ActiveState.prototype.onResponseReceived = function (response) {
    };
    ActiveState.prototype.onLocationReceived = function (location) {
    };
    ActiveState.prototype.onUserActivityStateReceived = function (state) {
    };
    ActiveState.prototype.onHeadphoneStateReceived = function (state) {
    };
    ActiveState.prototype.onWeatherReceived = function (weather) {
    };
    ActiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    ActiveState.prototype.onSpeechRecognitionResults = function (results) { };
    ActiveState.prototype.onPlacesReceived = function (places) { };
    return ActiveState;
}(PirateState));
//# sourceMappingURL=PirateState.js.map