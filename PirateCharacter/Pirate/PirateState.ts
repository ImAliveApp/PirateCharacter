abstract class PirateState implements IAliveAgent {
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

    shouldEventHappen(chance: number): boolean {
        return Math.random() < chance;
    }
}

enum PassiveSubstate {
    LookingAround,
    Eating,
    Drinking,
    Reading,
    DoingSomethingStupid,
    RespondsToEvents,
    AskingForInteraction
}

class PassiveState extends PirateState {
    static get LOOKING_AROUND_CHANGE(): number { return 0.2; };
    static get CHANGE_PASSIVE_STATE(): number { return 0.25; };
    static get EATING_TIME(): number { return 10000; };
    static get READING_TIME(): number { return 20000; };
    static get HAVING_FUN_TIME(): number { return 20000; };
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
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.Drinking;
                this.timerTrigger.set("drinking", PassiveState.EATING_TIME);
            }
            else if (this.shouldEventHappen(PassiveState.CHANGE_PASSIVE_STATE)) {
                this.currentState = PassiveSubstate.AskingForInteraction;
                this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
            }
        }
        this.lookingAroundEmote(time);
    }

    lookingAroundEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("lookingAround");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("lookingAround");
        this.actionManager.playSound(soundToPlay);
    }

    eatingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    }

    eatingEmote(time: number) {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("eating");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("eating");
        this.actionManager.playSound(soundToPlay);
    }

    drinkingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("drinking")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.drinkingEmote(time);
    }

    drinkingEmote(time: number) {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("drinking");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        this.actionManager.playSound(soundToPlay);
    }

    readingTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    }

    readingEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("reading");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        this.actionManager.playSound(soundToPlay);
    }

    askingForInteractionTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    }

    askingForInteractionEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("askingForInteraction");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("askingForInteraction");
        this.actionManager.playSound(soundToPlay);
    }

    doingSomethingStupidTick(time: number): void {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    }

    doingSomethingStupidEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("doingSomethingStupid");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("doingSomethingStupid");
        this.actionManager.playSound(soundToPlay);
    }

    respondsToEventsTick(time: number): void {

    }

    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onPhoneEventOccurred(eventName: string): void {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
            this.switchContext.switchTo(PirateState.ACTIVE);
        }
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationMananger.getScreenHeight();

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
        let now = this.configurationMananger.getCurrentTime();
        if (now.Hour < 22 && now.Hour > 8) {//8:59 is still a valid hour.. so he will sleep from 22:00 to 9:00
            this.switchContext.switchTo(PirateState.PASSIVE);
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
        if (!this.configurationMananger.isSoundPlaying()) {
            this.normalEmote(time);
        }

        if (this.shouldEventHappen(0.25)) {
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    }

    normalEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-normal");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-normal");
        this.actionManager.playSound(soundToPlay);
    }

    napTick(time: number) {
        if (!this.timerTrigger.isOnGoing("sleep_nap")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.napEmote(time);
    }

    napEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-nap");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-nap");
        this.actionManager.playSound(soundToPlay);
    }

    angryTick(time: number) {
        if (!this.timerTrigger.isOnGoing("angry")) {
            this.currentState = SleepingSubstate.Normal;
            return;
        }

        this.angryEmote(time);
    }

    angryEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("angry");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("angry");
        this.actionManager.playSound(soundToPlay);
    }


    onBackgroundTick(time: number): void {
        this.onTick(time);
    }

    onPhoneEventOccurred(eventName: string): void {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Angry;
        }
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {

    }

    onRelease(currentX: number, currentY: number): void {
        let screenHeight = this.configurationMananger.getScreenHeight();

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

    onConfigureMenuItems(menuBuilder: IMenuBuilder) {

    }

    onSpeechRecognitionResults(results: string): void { }

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
            return;
        }

        this.funEmote(time);
    }

    funEmote(time: number) {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("fun");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("fun");
        this.actionManager.playSound(soundToPlay);
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
        let screenHeight = this.configurationMananger.getScreenHeight();

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