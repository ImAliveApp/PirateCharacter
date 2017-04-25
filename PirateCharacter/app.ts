/// <reference path="Scripts/collections.ts" />
class AliveClass implements IAliveAgent, IStateSwitchable {
    private states: collections.Dictionary<string, PirateState>;
    private handler: IManagersHandler;

    private currentState: string;
    private lastTick: number;

    public constructor() {
        this.lastTick = 0;
    }

    /**
     * This method gets called once when the character is being activated by the system.
     * @param handler An object that allows the code to get reference to the managers.
     * @param disabledPermissions A list of permissions that the user disabled.
     */
    onStart(handler: IManagersHandler, disabledPermissions: string[]): void {
        this.handler = handler;
        this.handler.getActionManager().move(0, this.handler.getConfigurationManager().getScreenHeight(), 200);
        this.handler.getActionManager().draw("activate.png", this.handler.getConfigurationManager().getMaximalResizeRatio(), false);
        this.initializeStates(handler);
    }

    /**
     * This method gets called every 250 milliseconds by the system, any logic updates to the state of your character should occur here.
     * Note: onTick only gets called when the screen is ON.
     * @param time The current time (in milliseconds) on the device.
     */
    onTick(time: number): void {
        this.states.getValue(this.currentState).onTick(time);
    }

    /**
     * This method gets called by the system every 1 hour (may be in a different rate depending on the device).
     * Note: this method only gets called when the screen is OFF.
     * @param time The current time (in milliseconds) on the device.
     */
    onBackgroundTick(time: number) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
    }

    /**
     * This method initialize the pirate.
     * @param handler An object that allows to get reference to the managers.
     */
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

    /**
     * This method gets called once the pirate is initializing, it will set the initial state.
     * @param now The current time on the device.
     */
    setupCurrentState(now: ICurrentTime) {
        if (now.Hour >= 22 || now.Hour < 8) {
            this.currentState = PirateState.SLEEPING;
        } else {
            this.currentState = PirateState.PASSIVE;
        }
    }

    /**
     * This method gets called whenever a phone event (that you registered to) occur on the phone.
     * @param eventName The name of the event that occurred.
     * @param jsonedData The data of the event that occurred.
     * For example, SMS_RECEIVED event will hold data about who sent the SMS, and the SMS content.
     */
    onPhoneEventOccurred(eventName: string, jsonedData: string): void {
        //this.handler.getActionManager().showMessage(eventName, "#000000", "#eeeeee", 1000);
        this.states.getValue(this.currentState).onPhoneEventOccurred(eventName);
    }

    /**
     * This method gets called when the user is holding and moving the image of your character (on screen).
     * @param oldX The X coordinate in the last tick (Top left).
     * @param oldY The Y coordinate in the last tick (Top left).
     * @param newX The X coordinate in the current tick (Top left).
     * @param newY The Y coordinate in the current tick (Top left).
     */
    onMove(oldX: number, oldY: number, newX: number, newY: number): void {
        this.states.getValue(this.currentState).onMove(oldX, oldY, newX, newY);
    }

    /**
     * This method gets called when the user raised his finger off the character image (on screen).
     * @param currentX The X coordinate of the character image on screen (Top left).
     * @param currentY The Y coordinate of the character image on the screen (Top left).
     */
    onRelease(currentX: number, currentY: number): void {
        this.states.getValue(this.currentState).onRelease(currentX, currentY);
    }

    /**
     * This method gets called whenever the user is holding the character image (on screen).
     * @param currentX The current X coordinate of the character image (Top left).
     * @param currentY The current Y coordinate of the character image (Top left).
     */
    onPick(currentX: number, currentY: number): void {
        this.states.getValue(this.currentState).onPick(currentX, currentY);
    }

    /**
     * This method gets called whenever the user has pressed a view in the character menu.
     * @param viewName The 'Name' property of the view that was pressed.
     */
    onMenuItemSelected(viewName: string): void {
        this.states.getValue(this.currentState).onMenuItemSelected(viewName);
    }

    /**
     * This method is called when the system received a reply from a previously HTTP request made by the character.
     * @param response The reply body in a JSON form.
     */
    onResponseReceived(response: string): void {
        this.states.getValue(this.currentState).onResponseReceived(response);
    }

    /**
     * This method gets called when the system done collecting information about the device location.
     * @param location The location information collected by the system.
     */
    onLocationReceived(location: IAliveLocation): void {
        this.states.getValue(this.currentState).onLocationReceived(location);
    }

    /**
     * This method gets called when the system done collecting information about the user activity.
     * @param state Information about the user activity.
     * Possible states: IN_VEHICLE, ON_BICYCLE, ON_FOOT, STILL, TILTING, WALKING, RUNNING, UNKNOWN.
     */
    onUserActivityStateReceived(state: IAliveUserActivity): void {
        this.states.getValue(this.currentState).onUserActivityStateReceived(state);
    }

    /**
     * This method gets called when the system done collecting information about the headphone state.
     * @param state 1 - the headphones are PLUGGED, 2 - the headphones are UNPLUGGED.
     */
    onHeadphoneStateReceived(state: number): void {
        this.states.getValue(this.currentState).onHeadphoneStateReceived(state);
    }

    /**
     * This method gets called when the system done collecting information about the weather in the location of the device.
     * @param weather Information about the weather.
     */
    onWeatherReceived(weather: IAliveWeather): void {
        this.states.getValue(this.currentState).onWeatherReceived(weather);
    }

    /**
     * This method gets called when the system done processing the speech recognition input.
     * @param results A stringed version of what the user said.
     */
    onSpeechRecognitionResults(results: string): void {
        this.states.getValue(this.currentState).onSpeechRecognitionResults(results);
    }

    /**
     * This method gets called once just before the onStart method and is where the character menu views are defined.
     * @param menuBuilder An object that fills the character menu.
     */
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

        let button2 = new ButtonMenuItem();
        button2.InitialX = 0;
        button2.InitialY = 4;
        button2.Height = 1;
        button2.Width = menuBuilder.getMaxColumns();
        button2.Text = "Let's play!";
        button2.TextColor = "#FFFFFF";
        button2.BackgroundColor = "#000000";
        button2.Name = "playButton"; 

        let progressLabel = new TextBoxMenuItem();
        progressLabel.BackgroundColor = "#000000";
        progressLabel.TextColor = "#ffffff";
        progressLabel.InitialX = 0;
        progressLabel.InitialY = 5;
        progressLabel.Width = 2;
        progressLabel.Height = 1;
        progressLabel.Name = "progressLabel";
        progressLabel.Text = "Remaining time:";

        let progress = new ProgressBarMenuItem();
        progress.InitialX = 2;
        progress.InitialY = 5;
        progress.Width = 2;
        progress.Height = 1;
        progress.MaxProgress = 100;
        progress.Name = "progress";
        progress.Progress = 0;
        progress.TextColor = "#ffffff";
        progress.BackgroundColor = "#000000";
        progress.FrontColor = "#00ff00";

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
        menuBuilder.createButton(button2);
        menuBuilder.createPicture(picture);
        menuBuilder.createTextBox(progressLabel);
        menuBuilder.createProgressBar(progress);
    }

    /**
     * This method gets called when the system done collecting information about nearby places around the device.
     * @param places A list of places that are near the device.
     */
    onPlacesReceived(places: IAlivePlaceLikelihood[]): void {
        this.handler.getActionManager().showMessage(JSON.stringify(places), "#000000", "#eeeeee", 10000);
    }

    // IStateSwitchable
    /**
     * This method switches the current pirates state to a different state.
     * @param state The new pirate state.
     */
    switchTo(state: string) {
        if (this.states.containsKey(state)) {
            this.currentState = state;
            this.states.getValue(state).initializeState();
        }
    }
}