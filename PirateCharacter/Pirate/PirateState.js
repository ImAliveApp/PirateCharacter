var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PirateState = (function () {
    function PirateState(switchContext) {
        this.switchContext = switchContext;
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
        this.walking = false;
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.databaseManager = handler.getDatabaseManager();
        this.characterManager = handler.getCharacterManager();
        this.menuManager = handler.getMenuManager();
        this.configurationMananger = handler.getConfigurationManager();
        this.restManager = handler.getRestManager();
        this.awarenessManager = handler.getAwarenessManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.timerTrigger = new TimerTriggerSystem(function () { return _this.configurationMananger.getCurrentTime().currentTimeMillis; });
    };
    PirateState.prototype.walkRandomally = function () {
        var screenWidth = this.configurationMananger.getScreenWidth();
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var distanceToMove = Math.abs(currentX - screenWidth);
        var category = AgentConstants.ON_FALLING_RIGHT;
        this.walking = true;
        if (this.shouldEventHappen(50) && distanceToMove > screenWidth / 4) {
            this.actionManager.move(distanceToMove / 3, 0, PirateState.WALK_TIME);
        }
        else {
            this.actionManager.move(-distanceToMove / 3, 0, PirateState.WALK_TIME);
            category = AgentConstants.ON_FALLING_LEFT;
        }
        var resToDraw = this.resourceManagerHelper.chooseRandomImage(category);
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound(category);
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
    };
    PirateState.prototype.shouldEventHappen = function (chance) {
        return Math.random() < chance;
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
        _super.call(this, switchContext);
    }
    Object.defineProperty(PassiveState, "LOOKING_AROUND_CHANGE", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "CHANGE_PASSIVE_STATE", {
        get: function () { return 0.25; },
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
        this.currentState = PassiveSubstate.LookingAround;
    };
    PassiveState.prototype.onTick = function (time) {
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
            else {
                this.actionManager.stopSound();
                this.walkRandomally();
                this.currentState = PassiveSubstate.WalkingAround;
                this.timerTrigger.set("walkingAround", PirateState.WALK_TIME);
            }
        }
        this.lookingAroundEmote(time);
    };
    PassiveState.prototype.lookingAroundEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("lookingAround");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("lookingAround");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("eating");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("eating");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("askingForInteraction");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("askingForInteraction");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("doingSomethingStupid");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("doingSomethingStupid");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
            this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
            this.actionManager.stopSound();
            this.switchContext.switchTo(PirateState.ACTIVE);
        }
    };
    PassiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    PassiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    PassiveState.prototype.onPick = function (currentX, currentY) {
    };
    PassiveState.prototype.onMenuItemSelected = function (itemName) {
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
        if (results.indexOf("quite") != -1 || results.indexOf("shut") != -1
            || results.indexOf("stupid") != -1 || results.indexOf("fuck") != -1) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.AskingForInteraction;
            this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
        }
    };
    PassiveState.prototype.onPlacesReceived = function (places) { };
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
        _super.call(this, switchContext);
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
        var now = this.configurationMananger.getCurrentTime();
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
        if (!this.configurationMananger.isSoundPlaying()) {
            this.normalEmote(time);
        }
        if (this.shouldEventHappen(0.25)) {
            this.actionManager.stopSound();
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    };
    SleepingState.prototype.normalEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-normal");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-normal");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-nap");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-nap");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("angry");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("angry");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    SleepingState.prototype.onPick = function (currentX, currentY) {
    };
    SleepingState.prototype.onMenuItemSelected = function (itemName) {
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
        _super.call(this, switchContext);
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
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("fun");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("fun");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay);
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
        var screenHeight = this.configurationMananger.getScreenHeight();
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