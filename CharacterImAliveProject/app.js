/// <reference path="Scripts/collections.ts" />
var AliveClass = (function () {
    function AliveClass() {
        this.lastTick = 0;
        this.mirror = false;
    }
    AliveClass.prototype.onTick = function (time) {
        if (time - this.lastTick > 2500) {
            this.handler.getActionManager().draw("breathing.png", 1.5, this.mirror);
            this.lastTick = time;
            this.mirror = !this.mirror;
        }
        this.states.getValue(this.currentState).onTick(time);
    };
    AliveClass.prototype.onBackgroundTick = function (time) {
        this.states.getValue(this.currentState).onBackgroundTick(time);
    };
    AliveClass.prototype.onStart = function (handler) {
        this.handler = handler;
        this.handler.getActionManager().move(0, 2000, 200);
        this.handler.getActionManager().draw("activate.png", 3.0, false);
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
        this.states.setValue(BlobyState.SLEEPING, sleepingState);
        this.states.setValue(BlobyState.PASSIVE, passiveState);
        this.states.setValue(BlobyState.ACTIVE, activeState);
        var now = handler.getConfigurationManager().getCurrentTime();
        this.setupCurrentState(now);
    };
    AliveClass.prototype.setupCurrentState = function (now) {
        if (now.Hour >= 22 || now.Hour <= 8) {
            this.currentState = BlobyState.SLEEPING;
        }
        else {
            this.currentState = BlobyState.PASSIVE;
        }
    };
    AliveClass.prototype.onActionReceived = function (actionName) {
        this.handler.getActionManager().showMessage(actionName);
        this.states.getValue(this.currentState).onActionReceived(actionName);
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
        this.handler.getActionManager().showMessage(itemName + " Selected!");
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
        picture2.PictureResourceName = "dead.png";
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
    };
    AliveClass.prototype.onSpeechRecognitionResults = function (results) { };
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