var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var BlobyState = (function () {
    function BlobyState(switchContext) {
        this.switchContext = switchContext;
    }
    Object.defineProperty(BlobyState, "SLEEPING", {
        get: function () { return "sleeping"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BlobyState, "PASSIVE", {
        get: function () { return "passive"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(BlobyState, "ACTIVE", {
        get: function () { return "active"; },
        enumerable: true,
        configurable: true
    });
    ;
    BlobyState.prototype.onStart = function (handler) {
        var _this = this;
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
    BlobyState.prototype.shouldEventHappen = function (chance) {
        return Math.random() < chance;
    };
    return BlobyState;
}());
var PassiveSubstate;
(function (PassiveSubstate) {
    PassiveSubstate[PassiveSubstate["LookingAround"] = 0] = "LookingAround";
    PassiveSubstate[PassiveSubstate["Eating"] = 1] = "Eating";
    PassiveSubstate[PassiveSubstate["Reading"] = 2] = "Reading";
    PassiveSubstate[PassiveSubstate["DoingSomethingStupid"] = 3] = "DoingSomethingStupid";
    PassiveSubstate[PassiveSubstate["RespondsToEvents"] = 4] = "RespondsToEvents";
    PassiveSubstate[PassiveSubstate["AskingForInteraction"] = 5] = "AskingForInteraction";
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
        }
    };
    PassiveState.prototype.lookingAroundTick = function (time) {
        if (this.shouldEventHappen(PassiveState.LOOKING_AROUND_CHANGE)) {
            if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.DoingSomethingStupid;
                this.timerTrigger.set("doingSomethingStupid", PassiveState.DOING_SOMETHING_STUPID_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.Eating;
                this.timerTrigger.set("eating", PassiveState.EATING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.Reading;
                this.timerTrigger.set("reading", PassiveState.READING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.AskingForInteraction;
                this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
            }
        }
        this.lookingAroundEmote(time);
    };
    PassiveState.prototype.lookingAroundEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-lookingAround");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    PassiveState.prototype.eatingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    };
    PassiveState.prototype.eatingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-eating");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    PassiveState.prototype.readingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    };
    PassiveState.prototype.readingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-reading");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    PassiveState.prototype.askingForInteractionTick = function (time) {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    };
    PassiveState.prototype.askingForInteractionEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-askingForInteraction");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    PassiveState.prototype.doingSomethingStupidTick = function (time) {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    };
    PassiveState.prototype.doingSomethingStupidEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-doingSomethingStupid");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    PassiveState.prototype.respondsToEventsTick = function (time) {
    };
    PassiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    PassiveState.prototype.onActionReceived = function (categoryName) {
    };
    PassiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    PassiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight, 0);
        }
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
    PassiveState.prototype.onPlacesReceived = function (places) {
    };
    PassiveState.prototype.onHeadphoneStateReceived = function (state) {
    };
    PassiveState.prototype.onWeatherReceived = function (weather) {
    };
    PassiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    PassiveState.prototype.onSpeechRecognitionResults = function (results) { };
    return PassiveState;
}(BlobyState));
var SleepingSubstate;
(function (SleepingSubstate) {
    SleepingSubstate[SleepingSubstate["Normal"] = 0] = "Normal";
    SleepingSubstate[SleepingSubstate["Snoring"] = 1] = "Snoring";
    SleepingSubstate[SleepingSubstate["SleepWalking"] = 2] = "SleepWalking";
    SleepingSubstate[SleepingSubstate["Annoyed"] = 3] = "Annoyed";
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
    Object.defineProperty(SleepingState, "SLEEP_WALK_TO_NORMAL_TIME", {
        get: function () { return 10000; },
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
            this.switchContext.switchTo(BlobyState.PASSIVE);
            return;
        }
        switch (this.currentState) {
            case SleepingSubstate.Annoyed:
                this.annoyedTick(time);
                break;
            case SleepingSubstate.Normal:
                this.normalTick(time);
                break;
            case SleepingSubstate.SleepWalking:
                this.sleepWalkingTick(time);
                break;
            case SleepingSubstate.Snoring:
                this.snoringTick(time);
                break;
        }
    };
    SleepingState.prototype.annoyedTick = function (time) {
        if (!this.timerTrigger.isOnGoing("annoyed")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        if (!this.configurationMananger.getIsSoundPlaying()) {
            if (this.shouldEventHappen(SleepingState.ANNOYED_EMOTE_CHANCE)) {
                this.annoyedEmote(time);
            }
        }
    };
    SleepingState.prototype.annoyedEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-annoyed");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    SleepingState.prototype.normalTick = function (time) {
        if (!this.configurationMananger.getIsSoundPlaying()) {
            if (this.shouldEventHappen(SleepingState.NORMAL_TO_SNORE_CHANCE)) {
                this.currentState = SleepingSubstate.Snoring;
                if (this.shouldEventHappen(SleepingState.SNORE_TO_SLEEP_WALK_CHANCE)) {
                    this.timerTrigger.set("sleep_walk", SleepingState.SLEEP_WALK_TO_NORMAL_TIME);
                    this.currentState = SleepingSubstate.SleepWalking;
                }
                else {
                    this.timerTrigger.set("snoring", SleepingState.SNORE_TO_NORMAL_TIME);
                }
                return;
            }
            this.normalEmote(time);
        }
    };
    SleepingState.prototype.normalEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-normal");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    SleepingState.prototype.sleepWalkingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("sleep_walk")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.sleepWalkingEmote(time);
    };
    SleepingState.prototype.sleepWalkingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-sleepWalking");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    SleepingState.prototype.snoringTick = function (time) {
        if (!this.timerTrigger.isOnGoing("snoring")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.snoringEmote(time);
    };
    SleepingState.prototype.snoringEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-snoring");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    };
    SleepingState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    SleepingState.prototype.onActionReceived = function (categoryName) {
        if (categoryName == AgentConstants.NEW_OUTGOING_CALL ||
            categoryName == AgentConstants.INCOMING_CALL ||
            categoryName == AgentConstants.SMS_RECEIVED) {
            this.timerTrigger.set("annoyed", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Annoyed;
        }
    };
    SleepingState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    SleepingState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight, 0);
        }
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
    SleepingState.prototype.onPlacesReceived = function (places) {
    };
    SleepingState.prototype.onConfigureMenuItems = function (menuBuilder) {
    };
    SleepingState.prototype.onSpeechRecognitionResults = function (results) { };
    return SleepingState;
}(BlobyState));
var ActiveSubstate;
(function (ActiveSubstate) {
    ActiveSubstate[ActiveSubstate["PlayingMiniGame"] = 0] = "PlayingMiniGame";
    ActiveSubstate[ActiveSubstate["AnnoyedByDraggingAround"] = 1] = "AnnoyedByDraggingAround";
})(ActiveSubstate || (ActiveSubstate = {}));
var ActiveState = (function (_super) {
    __extends(ActiveState, _super);
    function ActiveState(switchContext) {
        _super.call(this, switchContext);
    }
    ActiveState.prototype.initializeState = function () {
        this.currentState = ActiveSubstate.PlayingMiniGame;
    };
    ActiveState.prototype.onTick = function (time) {
        switch (this.currentState) {
            case ActiveSubstate.PlayingMiniGame:
                this.onPlayingMiniGameTick(time);
                break;
            case ActiveSubstate.AnnoyedByDraggingAround:
                this.onAnnoyedByDraggingAroundTick(time);
                break;
        }
    };
    ActiveState.prototype.onPlayingMiniGameTick = function (time) { };
    ActiveState.prototype.onAnnoyedByDraggingAroundTick = function (time) { };
    ActiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    ActiveState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
    };
    ActiveState.prototype.onActionReceived = function (categoryName) {
        var res = this.resourceManagerHelper.chooseRandomSound(categoryName);
        this.actionManager.playSound(res);
    };
    ActiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    ActiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationMananger.getScreenHeight();
        if (currentY < screenHeight - 50) {
            this.actionManager.move(0, screenHeight, 0);
        }
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
    ActiveState.prototype.onPlacesReceived = function (places) {
    };
    ActiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    ActiveState.prototype.onSpeechRecognitionResults = function (results) { };
    return ActiveState;
}(BlobyState));
//# sourceMappingURL=BlobyStates.js.map