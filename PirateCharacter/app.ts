/// <reference path="Scripts/collections.ts" />
class AliveClass implements IAliveAgent, IStateSwitchable {
    private states: collections.Dictionary<string, PirateState>;
    private handler: IManagersHandler;

    private currentState: string;
    private lastTick: number;

    public constructor() {
        this.lastTick = 0;
    }

    onTick(time: number): void {
        this.states.getValue(this.currentState).onTick(time);
    }

    onBackgroundTick(time: number) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
    }

    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.handler = handler;
        this.handler.getActionManager().move(0, this.handler.getConfigurationManager().getScreenHeight(), 200);
        this.handler.getActionManager().draw("activate.png", this.handler.getConfigurationManager().getMaximalResizeRatio(), false);
        this.initializeStates(handler);
    }

    initializeStates(handler: IManagersHandler) {
        this.states = new collections.Dictionary<string, PirateState>();
        let sleepingState = new SleepingState(this);
        let passiveState = new PassiveState(this);
        let activeState = new ActiveState(this);
        sleepingState.onStart(handler);
        passiveState.onStart(handler);
        activeState.onStart(handler);

        this.states.setValue(PirateState.SLEEPING, sleepingState);
        this.states.setValue(PirateState.PASSIVE, passiveState);
        this.states.setValue(PirateState.ACTIVE, activeState);

        let now = handler.getConfigurationManager().getCurrentTime();

        this.setupCurrentState(now);
    }

    setupCurrentState(now: ICurrentTime) {
        if (now.Hour >= 22 || now.Hour < 8) {
            this.currentState = PirateState.SLEEPING;
        } else {
            this.currentState = PirateState.PASSIVE;
        }
    }

    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
        this.handler.getActionManager().showMessage(eventName);
        this.states.getValue(this.currentState).onPhoneEventOccurred(eventName);
    }

    onMove(oldX: number, oldY: number, newX: number, newY: number): void {
        this.states.getValue(this.currentState).onMove(oldX, oldY, newX, newY);
    }

    onRelease(currentX: number, currentY: number): void {
        this.states.getValue(this.currentState).onRelease(currentX, currentY);
    }

    onPick(currentX: number, currentY: number): void {
        this.states.getValue(this.currentState).onPick(currentX, currentY);
    }

    onMenuItemSelected(viewName: string): void {
        if (this.handler.getSpeechToTextManager().isSpeechRecognitionAvailable() && viewName == "speakButton") {
            this.handler.getSpeechToTextManager().startSpeechRecognition();
        }

        this.states.getValue(this.currentState).onMenuItemSelected(viewName);
    }

    onResponseReceived(response: string): void {
        this.states.getValue(this.currentState).onResponseReceived(response);
    }

    onLocationReceived(location: IAliveLocation): void {
        this.states.getValue(this.currentState).onLocationReceived(location);
    }

    onUserActivityStateReceived(state: IAliveUserActivity): void {
        this.states.getValue(this.currentState).onUserActivityStateReceived(state);
    }

    onHeadphoneStateReceived(state: number): void {
        this.states.getValue(this.currentState).onHeadphoneStateReceived(state);
    }

    onWeatherReceived(weather: IAliveWeather): void {
        this.states.getValue(this.currentState).onWeatherReceived(weather);
    }

    onSpeechRecognitionResults(results: string): void {
        this.states.getValue(this.currentState).onSpeechRecognitionResults(results);
    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder): void {
        let button = new ButtonMenuItem();
        button.InitialX = 0;
        button.InitialY = 3;
        button.Height = 1;
        button.Width = menuBuilder.getMaxColumns();
        button.Text = "Click to speak with me!";
        button.TextColor = "#FFFFFF";
        button.BackgroundColor = "#000000";
        button.Name = "speakButton";      

        let picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 0;
        picture.Height = 3;
        picture.Width = menuBuilder.getMaxColumns();
        picture.Name = "picture";
        picture.PictureResourceName = PictureMenuItem.UseCoverPicture;

        let menuHeader = new MenuHeader();
        menuHeader.TextColor = "#1a1a00";
        menuHeader.BackgroundColor = "#ffff99";

        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createButton(button);
        menuBuilder.createPicture(picture);
    }

    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {
        this.handler.getActionManager().showMessage(JSON.stringify(places));
    }

    // IStateSwitchable
    switchTo(state: string) {
        if (this.states.containsKey(state)) {
            this.currentState = state;
            this.states.getValue(state).initializeState();
        }
    }
}