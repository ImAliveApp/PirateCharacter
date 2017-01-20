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

    onStart(handler: IManagersHandler): void {
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

    onActionReceived(actionName: string, jsonedData: string): void {
        this.handler.getActionManager().showMessage(actionName);
        this.states.getValue(this.currentState).onActionReceived(actionName);
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

    onMenuItemSelected(itemName: string): void {
        if (this.handler.getSpeechToTextManager().isSpeechRecognitionAvailable() && itemName == "button") {
            this.handler.getSpeechToTextManager().startSpeechRecognition();
        }

        if (itemName == "button2") {
            this.handler.getAwarenessManager().getPlaces();
            let random = Math.random() * 100;
            this.handler.getMenuManager().setProperty("progress", "Progress", random.toString());
        }

        this.states.getValue(this.currentState).onMenuItemSelected(itemName);
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
        this.handler.getActionManager().showMessage(results);
        this.handler.getTextToSpeechManager().say(results);
    }

    onConfigureMenuItems(menuBuilder: IMenuBuilder): void {
        let button = new ButtonMenuItem();
        button.InitialX = 0;
        button.InitialY = 0;
        button.Height = 1;
        button.Width = 2;
        button.Text = "Hello Button";
        button.TextColor = "#FFFFFF";
        button.BackgroundColor = "#000000";
        button.Name = "button";
        
        let button2 = new ButtonMenuItem();
        button2.InitialX = 2;
        button2.InitialY = 0;
        button2.Height = 1;
        button2.Width = 2;
        button2.Text = "Hello Button2";
        button2.TextColor = "#FFFFFF";
        button2.BackgroundColor = "#000000";
        button2.Name = "button2";
        
        let progress = new ProgressBarMenuItem();
        progress.InitialX = 0;
        progress.InitialY = 1;
        progress.Height = 1;
        progress.Width = 2;
        progress.TextColor = "#FFFFFF";
        progress.BackgroundColor = "#000000";
        progress.Name = "progress";
        progress.Progress = 10;
        progress.MaxProgress = 100;
        progress.FrontColor = "#0FFF0f";

        let progress2 = new ProgressBarMenuItem();
        progress2.InitialX = 2;
        progress2.InitialY = 1;
        progress2.Height = 1;
        progress2.Width = 2;
        progress2.TextColor = "#FFFFFF";
        progress2.BackgroundColor = "#000000";
        progress2.Name = "progress2";
        progress2.Progress = 90;
        progress2.MaxProgress = 100;
        progress2.FrontColor = "#FFAA0f";

        let picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 2;
        picture.Height = 1;
        picture.Width = 2;
        picture.Name = "picture";
        picture.PictureResourceName = "dead.png";

        let picture2 = new PictureMenuItem();
        picture2.InitialX = 2;
        picture2.InitialY = 2;
        picture2.Height = 1;
        picture2.Width = 2;
        picture2.Name = "picture2";
        picture2.PictureResourceName = "example.gif";

        let checkBox = new CheckBoxMenuItem();
        checkBox.InitialX = 0;
        checkBox.InitialY = 3;
        checkBox.Height = 1;
        checkBox.Width = 2;
        checkBox.Text = "On";
        checkBox.UncheckedText = "Off";
        checkBox.TextColor = "#FAAAFF";
        checkBox.FrontColor = "#333333";
        checkBox.BackgroundColor = "#000000";
        checkBox.Name = "checkbox";
        checkBox.Checked = true;

        let textBox = new TextBoxMenuItem();
        textBox.InitialX = 0;
        textBox.InitialY = 4;
        textBox.Height = 1;
        textBox.Width = 4;
        textBox.Text = "textBox";
        textBox.TextColor = "#AAFAFB";
        textBox.BackgroundColor = "#000000";
        textBox.Name = "textBox";

        let menuHeader = new MenuHeader();
        menuHeader.TextColor = "#1a1a00";
        menuHeader.BackgroundColor = "#ffff99";

        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createButton(button);
        menuBuilder.createButton(button2);
        menuBuilder.createTextBox(textBox);
        menuBuilder.createCheckBox(checkBox);
        menuBuilder.createPicture(picture);
        menuBuilder.createPicture(picture2);
        menuBuilder.createProgressBar(progress);
        menuBuilder.createProgressBar(progress2);
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