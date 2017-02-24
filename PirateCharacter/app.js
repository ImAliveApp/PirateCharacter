/// <reference path="Scripts/collections.ts" />
var AliveClass = (function () {
    function AliveClass() {
        this.lastTick = 0;
    }
    AliveClass.prototype.onTick = function (time) {
        this.states.getValue(this.currentState).onTick(time);
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
    };
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.handler = handler;
        this.handler.getActionManager().move(0, this.handler.getConfigurationManager().getScreenHeight(), 200);
        this.handler.getActionManager().draw("activate.png", this.handler.getConfigurationManager().getMaximalResizeRatio(), false);
        this.initializeStates(handler);
    };
    AliveClass.prototype.initializeStates = function (handler) {
        this.states = new collections.Dictionary();
        var sleepingState = new SleepingState(this);
        var passiveState = new PassiveState(this);
        var activeState = new ActiveState(this);
        sleepingState.onStart(handler);
        passiveState.onStart(handler);
        activeState.onStart(handler);
        this.states.setValue(PirateState.SLEEPING, sleepingState);
        this.states.setValue(PirateState.PASSIVE, passiveState);
        this.states.setValue(PirateState.ACTIVE, activeState);
        var now = handler.getConfigurationManager().getCurrentTime();
        this.setupCurrentState(now);
    };
    AliveClass.prototype.setupCurrentState = function (now) {
        if (now.Hour >= 22 || now.Hour < 8) {
            this.currentState = PirateState.SLEEPING;
        }
        else {
            this.currentState = PirateState.PASSIVE;
        }
    };
    AliveClass.prototype.onPhoneEventOccurred = function (eventName, jsonedData) {
        this.handler.getActionManager().showMessage(eventName);
        this.states.getValue(this.currentState).onPhoneEventOccurred(eventName);
    };
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
        this.states.getValue(this.currentState).onMove(oldX, oldY, newX, newY);
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
        this.states.getValue(this.currentState).onRelease(currentX, currentY);
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
        this.states.getValue(this.currentState).onPick(currentX, currentY);
    };
    AliveClass.prototype.onMenuItemSelected = function (itemName) {
        if (this.handler.getSpeechToTextManager().isSpeechRecognitionAvailable() && itemName == "button") {
            this.handler.getSpeechToTextManager().startSpeechRecognition();
        }
        if (itemName == "button2") {
            this.handler.getAwarenessManager().getPlaces();
            var random = Math.random() * 100;
            this.handler.getMenuManager().setProperty("progress", "Progress", random.toString());
        }
        this.states.getValue(this.currentState).onMenuItemSelected(itemName);
    };
    AliveClass.prototype.onResponseReceived = function (response) {
        this.states.getValue(this.currentState).onResponseReceived(response);
    };
    AliveClass.prototype.onLocationReceived = function (location) {
        this.states.getValue(this.currentState).onLocationReceived(location);
    };
    AliveClass.prototype.onUserActivityStateReceived = function (state) {
        this.states.getValue(this.currentState).onUserActivityStateReceived(state);
    };
    AliveClass.prototype.onHeadphoneStateReceived = function (state) {
        this.states.getValue(this.currentState).onHeadphoneStateReceived(state);
    };
    AliveClass.prototype.onWeatherReceived = function (weather) {
        this.states.getValue(this.currentState).onWeatherReceived(weather);
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) {
        this.states.getValue(this.currentState).onSpeechRecognitionResults(results);
        this.handler.getActionManager().showMessage(results);
        this.handler.getTextToSpeechManager().say(results);
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var button = new ButtonMenuItem();
        button.InitialX = 0;
        button.InitialY = 0;
        button.Height = 1;
        button.Width = 2;
        button.Text = "Hello Button";
        button.TextColor = "#FFFFFF";
        button.BackgroundColor = "#000000";
        button.Name = "button";
        var button2 = new ButtonMenuItem();
        button2.InitialX = 2;
        button2.InitialY = 0;
        button2.Height = 1;
        button2.Width = 2;
        button2.Text = "Hello Button2";
        button2.TextColor = "#FFFFFF";
        button2.BackgroundColor = "#000000";
        button2.Name = "button2";
        var progress = new ProgressBarMenuItem();
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
        var progress2 = new ProgressBarMenuItem();
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
        var picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 2;
        picture.Height = 1;
        picture.Width = 2;
        picture.Name = "picture";
        picture.PictureResourceName = "dead.png";
        var picture2 = new PictureMenuItem();
        picture2.InitialX = 2;
        picture2.InitialY = 2;
        picture2.Height = 1;
        picture2.Width = 2;
        picture2.Name = "picture2";
        picture2.PictureResourceName = "example.gif";
        var checkBox = new CheckBoxMenuItem();
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
        var textBox = new TextBoxMenuItem();
        textBox.InitialX = 0;
        textBox.InitialY = 4;
        textBox.Height = 1;
        textBox.Width = 4;
        textBox.Text = "textBox";
        textBox.TextColor = "#AAFAFB";
        textBox.BackgroundColor = "#000000";
        textBox.Name = "textBox";
        var menuHeader = new MenuHeader();
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
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
        this.handler.getActionManager().showMessage(JSON.stringify(places));
    };
    // IStateSwitchable
    AliveClass.prototype.switchTo = function (state) {
        if (this.states.containsKey(state)) {
            this.currentState = state;
            this.states.getValue(state).initializeState();
        }
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map