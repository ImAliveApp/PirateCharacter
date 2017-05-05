abstract class PirateState implements IAliveAgent {
    static get WALK_TIME(): number { return 1000; };
    static get SLEEPING(): string { return "sleeping"; };
    static get PASSIVE(): string { return "passive"; };
    static get ACTIVE(): string { return "active"; };

    
    protected configurationManager: IConfigurationManager;
    protected speechToTextManager: ISpeechToTextManager;
    protected characterManager: ICharacterManager;
    protected resourceManager: IResourceManager;
    protected managersHandler: IManagersHandler;
    protected actionManager: IActionManager;
    protected menuManager: IMenuManager;    

    protected wordsEvaluator: WordsEvaluator;

    protected timerTrigger: TimerTriggerSystem;
    protected categoryOnScreen: string;
    protected currentCategoryPlaying: string;
    protected walking: boolean;
    protected playingMiniGame: boolean;

    protected resourceManagerHelper: ResourceManagerHelper;

    protected switchContext: IStateSwitchable;

    constructor(switchContext: IStateSwitchable) {
        this.switchContext = switchContext;
        this.wordsEvaluator = new WordsEvaluator();
    }

    abstract onTick(time: number): void;

    abstract onBackgroundTick(time: number): void;

    onStart(handler: IManagersHandler): void {
        this.categoryOnScreen = "";
        this.walking = false;
        this.managersHandler = handler;
        this.menuManager = handler.getMenuManager();
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.characterManager = handler.getCharacterManager();
        this.speechToTextManager = handler.getSpeechToTextManager();
        this.configurationManager = handler.getConfigurationManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.timerTrigger = new TimerTriggerSystem(() => this.configurationManager.getCurrentTime().currentTimeMillis);
    }

    abstract onSpeechRecognitionResults(results: string): void;

    abstract onPhoneEventOccurred(eventName: string): void;

    abstract onMove(oldX: number, oldY: number, newX: number, newY: number): void;

    abstract onRelease(currentX: number, currentY: number): void;

    abstract onPick(currentX: number, currentY: number): void;

    abstract onMenuItemSelected(itemName: string): void;

    abstract onResponseReceived(response: string): void;

    abstract onLocationReceived(location: IAliveLocation): void;

    abstract onUserActivityStateReceived(state: IAliveUserActivity): void;

    abstract onHeadphoneStateReceived(state: number): void;

    abstract onWeatherReceived(weather: IAliveWeather): void;

    abstract onConfigureMenuItems(menuBuilder: IMenuBuilder): void;

    abstract onPlacesReceived(places: IAlivePlaceLikelihood[]): void;

    abstract initializeState(): void;

    walkRandomally(): void {
        let screenWidth = this.configurationManager.getScreenWidth();
        let currentX = this.characterManager.getCurrentCharacterXPosition();
        let distanceToMove = Math.abs(currentX - screenWidth);
        let category = AgentConstants.ON_FALLING_RIGHT;
        this.walking = true;
        if (this.shouldEventHappen(0.5) && distanceToMove > screenWidth / 4) {//walk 
            this.actionManager.move(distanceToMove / 3, 0, PirateState.WALK_TIME);
        }
        else {
            this.actionManager.move(-distanceToMove / 3, 0, PirateState.WALK_TIME);
            category = AgentConstants.ON_FALLING_LEFT;
        }

        this.drawAndPlayRandomResourceByCategory(category);
    }

    shouldEventHappen(chance: number): boolean {
        return Math.random() < chance;
    }

    drawAndPlayRandomResourceByCategory(category: string): void {
        if (this.playingMiniGame) return;

        let resToDraw = this.resourceManagerHelper.chooseRandomImage(category);
        if (resToDraw != this.categoryOnScreen)
            this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);

        this.categoryOnScreen = category;

        let soundToPlay = this.resourceManagerHelper.chooseRandomSound(category);
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    }
}

enum PassiveSubstate {
    LookingAround,
    Eating,
    Drinking,
    Reading,
    DoingSomethingStupid,
    RespondsToEvents,
    AskingForInteraction,
    WalkingAround
}
class PassiveState extends PirateState {
    static get LOOKING_AROUND_CHANGE(): number { return 0.1; };
    static get CHANCE_SWITCH_TO_FUN(): number { return 0.2; };
    static get CHANGE_PASSIVE_STATE(): number { return 0.2; };
    static get EATING_TIME(): number { return 10000; };
    static get READING_TIME(): number { return 20000; };
    static get HAVING_FUN_TIME(): number { return 20000; };
    static get ASKING_FOR_INTERACTION_TIME(): number { return 15000; };
    static get DOING_SOMETHING_STUPID_TIME(): number { return 20000; };

    private playerLoseMessages: string[];
    private playerWinMessages: string[];
    private cryingMessages: string[];

    private lastPlayGameClick: number;
    private miniGame: MiniGame;
    private currentState: PassiveSubstate;

    private noPlayPenaltyTime: number;

    constructor(switchContext: IStateSwitchable) {
        super(switchContext);
        this.playingMiniGame = false;
    }

    initializeState(): void {

    }

    onStart(handler: IManagersHandler): void {
        super.onStart(handler);
        this.lastPlayGameClick = 0;
        this.currentState = PassiveSubstate.LookingAround;

        this.playerWinMessages = ["Very well done! but i'll win next time! for sure :D", "Argh! this is the last time that you win!",
            "What?!? how did you win?! you CHEATER!", "Nice job! you are really good at this :D", "Wooooot, you won this one!, nice! "];

        this.playerLoseMessages = ["Ahahaha, i won!", "You really thought you could win? ehehehe", "Phew, it was close! keep on training!",
            "That was fun! because i won :D", "You really expected a different outcome??"];

        this.cryingMessages = ["Why are you calling me by names? :(", "Why are you so mean? :'(", "Please stop saying that :(",
            "Stop it! please!", ":'("];
    }

    onTick(time: number): void {
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
    }

    lookingAroundTick(time: number): void {
        this.actionManager.stopSound();
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
    }

    lookingAroundEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("lookingAround");
    }

    eatingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    }

    eatingEmote(time: number) {
        this.drawAndPlayRandomResourceByCategory("eating");
    }

    drinkingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("drinking")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.drinkingEmote(time);
    }

    drinkingEmote(time: number) {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("drinking");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    }

    readingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    }

    readingEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("reading");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    }

    askingForInteractionTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    }

    askingForInteractionEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("askingForInteraction");
    }

    doingSomethingStupidTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    }

    doingSomethingStupidEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("doingSomethingStupid");
    }

    respondsToEventsTick(time: number): void {

    }

    walkingAroundTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("walkingAround")) {
            this.actionManager.stopSound();
            this.walking = false;
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
    }

    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onPhoneEventOccurred(eventName: string): void {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.switchToFunState();
        }
    }

    switchToFunState(): void {
        this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
        this.actionManager.stopSound();
        this.switchContext.switchTo(PirateState.ACTIVE);
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationManager.getScreenHeight();

        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    }

    onPick(currentX: number, currentY: number): void {
        if (this.playingMiniGame) {
            this.miniGame.onEventOccured("touch");
        }
        else {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
        }
    }

    onMenuItemSelected(itemName: string): void {
        switch (itemName) {
            case "speakButton":
                if (!this.speechToTextManager.isSpeechRecognitionAvailable() || this.playingMiniGame) return;
                this.speechToTextManager.stopSpeechRecognition();
                this.speechToTextManager.startSpeechRecognition();
                break;

            case "playButton":
                if (this.playingMiniGame) {
                    this.miniGame.onEventOccured("stop");
                }
                else {
                    let now = this.configurationManager.getCurrentTime().currentTimeMillis;
                    if (now - this.lastPlayGameClick < 2000)
                        return;
                    this.lastPlayGameClick = now;
                    this.playRandomMiniGame(now);
                }
                break;

        }
    }

    onResponseReceived(response: string): void {

    }

    onLocationReceived(location: IAliveLocation): void {

    }

    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {

    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) { }

    onSpeechRecognitionResults(results: string): void {
        if (this.playingMiniGame) return;
        results = results.toLocaleLowerCase();
        let speechResults = "speech results";
        let realResults = results.substring(results.indexOf(speechResults) + speechResults.length); 

        if (this.wordsEvaluator.containsBadWord(results)) {
            this.actionManager.stopSound();
            this.actionManager.showMessage(this.cryingMessages[Math.floor(Math.random() * 4)], "#000000", "#aaaaaa", 2000);
            this.currentState = PassiveSubstate.AskingForInteraction;
            this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
        }
    }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void { }

    playRandomMiniGame(currentTime: number): void {
        if (this.playingMiniGame) return;

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
        let randomNumber = Math.random() * 100;

        if (randomNumber <= 30) {
            this.miniGame = new HideAndSeekMiniGame(this.managersHandler,
                (playerWon: boolean) => {
                    this.actionManager.animateAlpha(1, 200);
                    this.miniGameOver(playerWon);
                });
        }
        else if (randomNumber <= 60) {
            this.miniGame = new CatchMiniGame(this.managersHandler, this.resourceManagerHelper,
                (playerWon: boolean) => {
                    this.miniGameOver(playerWon);
                });
        }
        else {
            this.miniGame = new ReflexMiniGame(this.managersHandler,
                (playerWon: boolean) => {
                    this.miniGameOver(playerWon);
                });
        }

        this.miniGame.onStart(this.configurationManager.getCurrentTime().currentTimeMillis);
    }

    private miniGameOver(playerWon: boolean): void {
        this.actionManager.move(-this.configurationManager.getScreenWidth(), this.configurationManager.getScreenHeight(), 20);
        this.playingMiniGame = false;

        let messageIndex = Math.floor(Math.random() * 4);

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
    }
}

enum SleepingSubstate {
    Normal,
    Nap,
    Angry
}
class SleepingState extends PirateState {
    static get ANNOYED_TO_NORMAL_TIME(): number { return 5000 }
    static get SNORE_TO_NORMAL_TIME(): number { return 5000 }

    static get ANNOYED_EMOTE_CHANCE(): number { return 0.25 }
    static get NORMAL_TO_SNORE_CHANCE(): number { return 0.0027 }
    static get SNORE_TO_SLEEP_WALK_CHANCE(): number { return 0.001 }

    private currentState: SleepingSubstate;

    constructor(switchContext: IStateSwitchable) {
        super(switchContext);
    }

    initializeState(): void {
        this.currentState = SleepingSubstate.Normal;
    }

    onStart(handler: IManagersHandler): void {
        super.onStart(handler);
        this.currentState = SleepingSubstate.Normal;
    }


    onTick(time: number): void {
        let now = this.configurationManager.getCurrentTime();
        if (now.Hour < 22 && now.Hour > 8) {//8:59 is still a valid hour.. so he will sleep from 22:00 to 9:00
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
    }

    normalTick(time: number): void {
        if (!this.configurationManager.isSoundPlaying()) {
            this.normalEmote(time);
        }

        if (this.shouldEventHappen(0.25)) {
            this.actionManager.stopSound();
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    }

    normalEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("sleeping-normal");
    }

    napTick(time: number) {
        if (!this.timerTrigger.isOnGoing("sleep_nap")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.napEmote(time);
    }

    napEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("sleeping-nap");
    }

    angryTick(time: number) {
        if (!this.timerTrigger.isOnGoing("angry")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.angryEmote(time);
    }

    angryEmote(time: number): void {
        this.drawAndPlayRandomResourceByCategory("angry");
    }


    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onPhoneEventOccurred(eventName: string): void {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.actionManager.stopSound();
            this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Angry;
        }
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationManager.getScreenHeight();

        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    }

    onPick(currentX: number, currentY: number): void {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Normal;
    }

    onMenuItemSelected(itemName: string): void {
        this.actionManager.showMessage("Zzz Zzz Zzzzzzz", "#000000", "#ffffff", 2000);
    }

    onResponseReceived(response: string): void {

    }

    onLocationReceived(location: IAliveLocation): void {

    }

    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {

    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) {

    }

    onSpeechRecognitionResults(results: string): void {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Angry;
        this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
    }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void { }
}

enum ActiveSubstate {
    Fun
}
class ActiveState extends PirateState {

    private currentState: ActiveSubstate;

    constructor(switchContext: IStateSwitchable) {
        super(switchContext);
    }

    initializeState(): void {
        this.currentState = ActiveSubstate.Fun;
    }

    onTick(time: number): void {
        switch (this.currentState) {
            case ActiveSubstate.Fun:
                this.onFunTick(time);
                break;
        }
    }

    onFunTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("fun")) {
            this.switchContext.switchTo(PirateState.PASSIVE);
            this.actionManager.stopSound();
            return;
        }

        this.funEmote(time);
    }

    funEmote(time: number) {
        this.drawAndPlayRandomResourceByCategory("fun");
    }

    onBackgroundTick(time: number) {
        this.onTick(time);
    }

    onStart(handler: IManagersHandler): void {
        super.onStart(handler);
    }

    onPhoneEventOccurred(eventName: string): void {

    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationManager.getScreenHeight();

        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    }

    onPick(currentX: number, currentY: number): void {
    }

    onMenuItemSelected(itemName: string): void {

    }

    onResponseReceived(response: string): void {

    }

    onLocationReceived(location: IAliveLocation): void {

    }

    onUserActivityStateReceived(state: IAliveUserActivity) {

    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {

    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) { }

    onSpeechRecognitionResults(results: string): void { }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void { }
}