abstract class BlobyState implements IAliveAgent {
    static get SLEEPING(): string { return "sleeping"; };
    static get PASSIVE(): string { return "passive"; };
    static get ACTIVE(): string { return "active"; };
    protected actionManager: IActionManager;
    protected resourceManager: IResourceManager;
    protected databaseManager: IDatabaseManager;
    protected characterManager: ICharacterManager;
    protected menuManager: IMenuManager;
    protected configurationMananger: IConfigurationManager;
    protected restManager: IRestManager;
    protected managersHandler: IManagersHandler;
    protected awarenessManager: IAwarenessManager;
    protected timerTrigger: TimerTriggerSystem;

    protected resourceManagerHelper: ResourceManagerHelper;


    protected switchContext: IStateSwitchable;

    constructor(switchContext: IStateSwitchable) {
        this.switchContext = switchContext;
    }

    abstract onTick(time: number): void;

    abstract onBackgroundTick(time: number): void;

    onStart(handler: IManagersHandler): void {
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.databaseManager = handler.getDatabaseManager();
        this.characterManager = handler.getCharacterManager();
        this.menuManager = handler.getMenuManager();
        this.configurationMananger = handler.getConfigurationManager();
        this.restManager = handler.getRestManager();
        this.awarenessManager = handler.getAwarenessManager();
        this.resourceManagerHelper = new ResourceManagerHelper(this.resourceManager);
        this.timerTrigger = new TimerTriggerSystem(() => this.configurationMananger.getCurrentTime().currentTimeMillis);
    }

    
    abstract onActionReceived(categoryName: string): void;

    abstract onMove(oldX: number, oldY: number, newX: number, newY: number): void;

    abstract onRelease(currentX: number, currentY: number): void;

    abstract onPick(currentX: number, currentY: number): void;

    abstract onMenuItemSelected(itemName: string): void;

    abstract onResponseReceived(response: string): void;

    abstract onLocationReceived(location: IAliveLocation): void;

    abstract onUserActivityStateReceived(state: IAliveUserActivity): void;

    abstract onHeadphoneStateReceived(state: number): void;

    abstract onWeatherReceived(weather: IAliveWeather): void;

    abstract onPlacesReceived(places: IAlivePlaceLikelihood[]): void

    abstract onConfigureMenuItems(menuBuilder: IMenuBuilder): void;

    abstract onSpeechRecognitionResults(results: string): void;

    abstract initializeState(): void;

    shouldEventHappen(chance: number): boolean {
        return Math.random() < chance;
    }
}

enum PassiveSubstate {
    LookingAround,
    Eating,
    Reading,
    DoingSomethingStupid,
    RespondsToEvents,
    AskingForInteraction
}

class PassiveState extends BlobyState {
    static get LOOKING_AROUND_CHANGE(): number { return 0.2; };
    static get CHANGE_PASSIVE_STATE(): number { return 0.25; };
    static get EATING_TIME(): number { return 10000; };
    static get READING_TIME(): number { return 20000; };
    static get ASKING_FOR_INTERACTION_TIME(): number { return 15000; };
    static get DOING_SOMETHING_STUPID_TIME(): number { return 20000; };

    private currentState: PassiveSubstate;

    constructor(switchContext: IStateSwitchable) {
        super(switchContext);
    }

    initializeState(): void {

    }

    onStart(handler: IManagersHandler): void {
        super.onStart(handler);
        this.currentState = PassiveSubstate.LookingAround;
    }

    onTick(time: number): void {
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
    }

    lookingAroundTick(time: number): void {
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
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)){
                this.currentState = PassiveSubstate.AskingForInteraction;
                this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
            }
        }
        this.lookingAroundEmote(time);
    }

    lookingAroundEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-lookingAround");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    eatingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    }

    eatingEmote(time: number) {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-eating");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    readingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    }

    readingEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-reading");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    askingForInteractionTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    }

    askingForInteractionEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-askingForInteraction");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    doingSomethingStupidTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    }

    doingSomethingStupidEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("passive-doingSomethingStupid");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    respondsToEventsTick(time: number): void {

    }

    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onActionReceived(categoryName: string): void {

    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationMananger.getScreenHeight();

        if (currentY < screenHeight - 50)
        {
            this.actionManager.move(0, screenHeight, 0);
        }
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

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {
        
    }

    onHeadphoneStateReceived(state: number) {

    }

    onWeatherReceived(weather: IAliveWeather) {

    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) { }

    onSpeechRecognitionResults(results: string): void { }
}

enum SleepingSubstate {
    Normal,
    Snoring,
    SleepWalking,
    Annoyed
}

class SleepingState extends BlobyState {
    static get ANNOYED_TO_NORMAL_TIME(): number { return 5000; }
    static get SLEEP_WALK_TO_NORMAL_TIME(): number { return 10000; }
    static get SNORE_TO_NORMAL_TIME(): number { return 5000; }

    static get ANNOYED_EMOTE_CHANCE(): number { return 0.25; }
    static get NORMAL_TO_SNORE_CHANCE(): number { return 0.0027; }
    static get SNORE_TO_SLEEP_WALK_CHANCE(): number { return 0.001; }

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
        let now = this.configurationMananger.getCurrentTime();
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
    }

    annoyedTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("annoyed")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        if (!this.configurationMananger.getIsSoundPlaying()) {
            if (this.shouldEventHappen(SleepingState.ANNOYED_EMOTE_CHANCE)) {
                this.annoyedEmote(time);
            }
        }
    }

    annoyedEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-annoyed");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    normalTick(time: number): void {
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
    }

    normalEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-normal");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    sleepWalkingTick(time: number) {
        if (!this.timerTrigger.isOnGoing("sleep_walk")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.sleepWalkingEmote(time);
    }

    sleepWalkingEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-sleepWalking");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }

    snoringTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("snoring")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.snoringEmote(time)
    }

    snoringEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-snoring");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
    }




    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onActionReceived(categoryName: string): void {
        if (categoryName == AgentConstants.NEW_OUTGOING_CALL ||
            categoryName == AgentConstants.INCOMING_CALL ||
            categoryName == AgentConstants.SMS_RECEIVED) {
            this.timerTrigger.set("annoyed", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Annoyed;
        }
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationMananger.getScreenHeight();

        if (currentY < screenHeight - 50)
        {
            this.actionManager.move(0, screenHeight, 0);
        }
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

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {

    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) {

    }

    onSpeechRecognitionResults(results: string): void { }
}

enum ActiveSubstate {
    PlayingMiniGame,
    AnnoyedByDraggingAround
}

class ActiveState extends BlobyState {

    private currentState: ActiveSubstate;

    constructor(switchContext: IStateSwitchable) {
        super(switchContext);
    }

    initializeState(): void {
        this.currentState = ActiveSubstate.PlayingMiniGame;
    }

    onTick(time: number): void {
        switch (this.currentState) {
            case ActiveSubstate.PlayingMiniGame:
                this.onPlayingMiniGameTick(time);
                break;

            case ActiveSubstate.AnnoyedByDraggingAround:
                this.onAnnoyedByDraggingAroundTick(time);
                break;
        }
    }

    onPlayingMiniGameTick(time: number): void { }

    onAnnoyedByDraggingAroundTick(time: number): void { }

    onBackgroundTick(time: number) {
        this.onTick(time);
    }

    onStart(handler: IManagersHandler): void {
        super.onStart(handler);
    }

    onActionReceived(categoryName: string): void {
        let res = this.resourceManagerHelper.chooseRandomSound(categoryName);
        this.actionManager.playSound(res);
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationMananger.getScreenHeight();

        if (currentY < screenHeight - 50)
        {
            this.actionManager.move(0, screenHeight, 0);
        }
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

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {
     
    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder) { }

    onSpeechRecognitionResults(results: string): void { }
}