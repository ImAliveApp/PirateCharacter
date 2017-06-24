var AliveClass = (function () {
    function AliveClass() {
        this.lastTick = 0;
    }
    AliveClass.prototype.onStart = function (handler, disabledPermissions) {
        this.handler = handler;
        this.handler.getActionManager().move(0, this.handler.getConfigurationManager().getScreenHeight(), 0);
        this.handler.getActionManager().draw("activate.png", this.handler.getConfigurationManager().getMaximalResizeRatio(), false);
        this.initializeStates(handler);
    };
    AliveClass.prototype.onTick = function (time) {
        this.states.getValue(this.currentState).onTick(time);
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
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
        this.states.getValue(this.currentState).onPhoneEventOccurred(eventName);
    };
    AliveClass.prototype.onRelease = function (currentX, currentY) {
        this.states.getValue(this.currentState).onRelease(currentX, currentY);
    };
    AliveClass.prototype.onPick = function (currentX, currentY) {
        this.states.getValue(this.currentState).onPick(currentX, currentY);
    };
    AliveClass.prototype.onMenuItemSelected = function (viewName) {
        this.states.getValue(this.currentState).onMenuItemSelected(viewName);
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
    };
    AliveClass.prototype.onConfigureMenuItems = function (menuBuilder) {
        var button = new ButtonMenuItem();
        button.InitialX = 0;
        button.InitialY = 3;
        button.Height = 1;
        button.Width = menuBuilder.getMaxColumns();
        button.Text = "Click to speak with me!";
        button.TextColor = "#FFFFFF";
        button.BackgroundColor = "#000000";
        button.Name = "speakButton";
        var button2 = new ButtonMenuItem();
        button2.InitialX = 0;
        button2.InitialY = 4;
        button2.Height = 1;
        button2.Width = menuBuilder.getMaxColumns();
        button2.Text = "Let's play!";
        button2.TextColor = "#FFFFFF";
        button2.BackgroundColor = "#000000";
        button2.Name = "playButton";
        var progressLabel = new TextBoxMenuItem();
        progressLabel.BackgroundColor = "#000000";
        progressLabel.TextColor = "#ffffff";
        progressLabel.InitialX = 0;
        progressLabel.InitialY = 5;
        progressLabel.Width = 2;
        progressLabel.Height = 1;
        progressLabel.Name = "progressLabel";
        progressLabel.Text = "Game time:";
        var progress = new ProgressBarMenuItem();
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
        var picture = new PictureMenuItem();
        picture.InitialX = 0;
        picture.InitialY = 0;
        picture.Height = 3;
        picture.Width = menuBuilder.getMaxColumns();
        picture.Name = "picture";
        picture.PictureResourceName = PictureMenuItem.UseCoverPicture;
        var menuHeader = new MenuHeader();
        menuHeader.TextColor = "#1a1a00";
        menuHeader.BackgroundColor = "#ffff99";
        menuBuilder.createMenuHeader(menuHeader);
        menuBuilder.createButton(button);
        menuBuilder.createButton(button2);
        menuBuilder.createPicture(picture);
        menuBuilder.createTextBox(progressLabel);
        menuBuilder.createProgressBar(progress);
    };
    AliveClass.prototype.onPlacesReceived = function (places) {
        this.handler.getActionManager().showMessage(JSON.stringify(places), "#000000", "#eeeeee", 10000);
    };
    AliveClass.prototype.switchTo = function (state) {
        if (this.states.containsKey(state)) {
            this.currentState = state;
            this.states.getValue(state).initializeState();
        }
    };
    AliveClass.prototype.onUserEventOccurred = function (eventName, jsonedData) {
        this.states.getValue(this.currentState).onUserEventOccurred(eventName, jsonedData);
    };
    return AliveClass;
}());
//# sourceMappingURL=app.js.map