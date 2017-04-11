abstract class PirateState implements IAliveAgent {
    static get WALK_TIME(): number { return 1000; };
    static get SLEEPING(): string { return "sleeping"; };
    static get PASSIVE(): string { return "passive"; };
    static get ACTIVE(): string { return "active"; };
    protected actionManager: IActionManager;
    protected resourceManager: IResourceManager;
    protected characterManager: ICharacterManager;
    protected configurationMananger: IConfigurationManager;
    protected managersHandler: IManagersHandler;

    protected timerTrigger: TimerTriggerSystem;

    protected currentCategoryPlaying: string;
    protected walking: boolean;

    protected resourceManagerHelper: ResourceManagerHelper;

    protected switchContext: IStateSwitchable;

    constructor(switchContext: IStateSwitchable) {
        this.switchContext = switchContext;
    }

    abstract onTick(time: number): void;

    abstract onBackgroundTick(time: number): void;

    onStart(handler: IManagersHandler): void {
        this.walking = false;
        this.actionManager = handler.getActionManager();
        this.resourceManager = handler.getResourceManager();
        this.characterManager = handler.getCharacterManager();
        this.configurationMananger = handler.getConfigurationManager();
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

    walkRandomally(): void {
        let screenWidth = this.configurationMananger.getScreenWidth();
        let currentX = this.characterManager.getCurrentCharacterXPosition();
        let distanceToMove = Math.abs(currentX - screenWidth);
        let category = AgentConstants.ON_FALLING_RIGHT;
        this.walking = true;
        if (this.shouldEventHappen(50) && distanceToMove > screenWidth / 4) {//walk 
            this.actionManager.move(distanceToMove / 3, 0, PirateState.WALK_TIME);
        }
        else {
            this.actionManager.move(-distanceToMove / 3, 0, PirateState.WALK_TIME);
            category = AgentConstants.ON_FALLING_LEFT;
        }

        let resToDraw = this.resourceManagerHelper.chooseRandomImage(category);
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound(category);
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    }

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
    AskingForInteraction,
    WalkingAround
}

class PassiveState extends PirateState {
    static get LOOKING_AROUND_CHANGE(): number { return 0.1; };
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

            case PassiveSubstate.WalkingAround:
                this.walkingAroundTick(time);
                break;
        }
    }

    lookingAroundTick(time: number): void {
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
        else
            this.lookingAroundEmote(time);
    }

    lookingAroundEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("lookingAround");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("lookingAround");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("eating");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("eating");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        if (!this.configurationMananger.isSoundPlaying())
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
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        if (!this.configurationMananger.isSoundPlaying())
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("askingForInteraction");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("askingForInteraction");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("doingSomethingStupid");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("doingSomethingStupid");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
            this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
            this.actionManager.stopSound();
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

    onSpeechRecognitionResults(results: string): void {
        if (results.indexOf("quite") != -1 || results.indexOf("shut") != -1
            || results.indexOf("stupid") != -1 || results.indexOf("fuck") != -1) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.AskingForInteraction;
            this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
        }
    }

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
        if (!this.configurationMananger.isSoundPlaying()) {
            this.normalEmote(time);
        }

        if (this.shouldEventHappen(0.25)) {
            this.actionManager.stopSound();
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    }

    normalEmote(time: number): void {
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-normal");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-normal");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("sleeping-nap");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("sleeping-nap");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("angry");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("angry");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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
        let resToDraw = this.resourceManagerHelper.chooseRandomImage("fun");
        this.actionManager.draw(resToDraw, this.configurationMananger.getMaximalResizeRatio(), false);
        let soundToPlay = this.resourceManagerHelper.chooseRandomSound("fun");
        if (!this.configurationMananger.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
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