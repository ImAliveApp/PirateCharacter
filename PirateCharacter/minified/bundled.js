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
    AliveClass.prototype.onMove = function (oldX, oldY, newX, newY) {
        this.states.getValue(this.currentState).onMove(oldX, oldY, newX, newY);
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
var AgentConstants = (function () {
    function AgentConstants() {
    }
    Object.defineProperty(AgentConstants, "ON_PICK", {
        get: function () { return "ON_PICK"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_RELEASE", {
        get: function () { return "ON_RELEASE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_MOVE", {
        get: function () { return "ON_MOVE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "CHARACTER_ACTIVATION", {
        get: function () { return "CHARACTER_ACTIVATION"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "CHARACTER_DEACTIVATION", {
        get: function () { return "CHARACTER_DEACTIVATION"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_MOVE_RIGHT", {
        get: function () { return "ON_MOVE_RIGHT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_MOVE_LEFT", {
        get: function () { return "ON_MOVE_LEFT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_MOVE_UP", {
        get: function () { return "ON_MOVE_UP"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_MOVE_DOWN", {
        get: function () { return "ON_MOVE_DOWN"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_FALLING_LEFT", {
        get: function () { return "ON_FALLING_LEFT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ON_FALLING_RIGHT", {
        get: function () { return "ON_FALLING_RIGHT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "SMS_RECEIVED", {
        get: function () { return "SMS_RECEIVED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "INCOMING_CALL", {
        get: function () { return "INCOMING_CALL"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "NEW_OUTGOING_CALL", {
        get: function () { return "NEW_OUTGOING_CALL"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "MENU_ACTION_FEED_ME", {
        get: function () { return "Feed me."; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "MENU_ACTION_CURE_ME", {
        get: function () { return "Cure me."; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "MENU_ACTION_REVIVE_ME", {
        get: function () { return "Revive me."; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ORIENTATION_PORTRAIT", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ORIENTATION_LANDSCAPE", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "FUNNY_CATEGORY", {
        get: function () { return "FUNNY"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "SCARY_CATEGORY", {
        get: function () { return "SCARY"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "GENERAL_CATEGORY", {
        get: function () { return "GENERAL"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "MINI_GAMES_CATEGORY", {
        get: function () { return "MINI GAMES"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "REAL_PEOPLE_CATEGORY", {
        get: function () { return "REAL PEOPLE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "ADULT_CATEGORY", {
        get: function () { return "ADULT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "CARTOON_CATEGORY", {
        get: function () { return "CARTOON"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_CHARACTER_UP_VOTE", {
        get: function () { return "APPLICATION_EVENT_CHARACTER_UP_VOTE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_CHARACTER_DOWN_VOTE", {
        get: function () { return "APPLICATION_EVENT_CHARACTER_DOWN_VOTE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_CHARACTER_DOWNLOAD", {
        get: function () { return "APPLICATION_EVENT_CHARACTER_DOWNLOAD"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_CHARACTER_DELETED", {
        get: function () { return "APPLICATION_EVENT_CHARACTER_DELETED"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_USER_CHANGE_PICTURE", {
        get: function () { return "APPLICATION_EVENT_USER_CHANGE_PICTURE"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "APPLICATION_EVENT_USER_COMMENT", {
        get: function () { return "APPLICATION_EVENT_USER_COMMENT"; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AgentConstants, "IConfigurationManager", {
        get: function () { return "IConfigurationManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "IActionManager", {
        get: function () { return "IActionManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "ICharacterManager", {
        get: function () { return "ICharacterManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "IDatabaseManager", {
        get: function () { return "IDatabaseManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "IResourceManager", {
        get: function () { return "IResourceManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "IMenuManager", {
        get: function () { return "IMenuManager"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(AgentConstants, "IAwarenessManager", {
        get: function () { return "IAwarenessManager"; },
        enumerable: true,
        configurable: true
    });
    return AgentConstants;
}());
;
//# sourceMappingURL=AgentConstants.js.map
var AliveSmsData = (function () {
    function AliveSmsData() {
    }
    return AliveSmsData;
}());
//# sourceMappingURL=AliveSmsData.js.map
;
//# sourceMappingURL=IAliveResource.js.map
//# sourceMappingURL=ICharacter.js.map
//# sourceMappingURL=ICurrentTime.js.map
//# sourceMappingURL=IMenuBuilder.js.map
//# sourceMappingURL=IRectangle.js.map
//# sourceMappingURL=ITime.js.map
//# sourceMappingURL=IUserInformation.js.map
//# sourceMappingURL=IVoice.js.map
var ResourceManagerHelper = (function () {
    function ResourceManagerHelper(resourceManager) {
        this.resourceManager = resourceManager;
        this.setupResourceMap();
    }
    ResourceManagerHelper.prototype.setupResourceMap = function () {
        this.soundResources = new collections.Dictionary();
        this.imageResources = new collections.Dictionary();
        this.soundList = new Array();
        this.imageList = new Array();
        this.setupResourceLists();
        this.setupResourceMaps();
    };
    ResourceManagerHelper.prototype.setupResourceLists = function () {
        var allResources = this.resourceManager.getAllResources();
        for (var i = 0; i < allResources.length; i++) {
            if (allResources[i].getType() === 5) {
                this.soundList.push(allResources[i]);
            }
            else {
                this.imageList.push(allResources[i]);
            }
        }
    };
    ResourceManagerHelper.prototype.setupResourceMaps = function () {
        var arraySoundResources = this.soundList;
        var arrayImageResources = this.imageList;
        for (var i = 0; i < this.soundList.length; i++) {
            this.addResourceToMap(arraySoundResources[i], this.soundResources);
        }
        for (var i = 0; i < this.imageList.length; i++) {
            this.addResourceToMap(arrayImageResources[i], this.imageResources);
        }
    };
    ResourceManagerHelper.prototype.addResourceToMap = function (res, dict) {
        var categoryName = res.getCategoryName();
        if (dict.containsKey(categoryName)) {
            dict.getValue(categoryName).push(res);
        }
        else {
            var newSet = new Array();
            newSet.push(res);
            dict.setValue(categoryName, newSet);
        }
    };
    ResourceManagerHelper.prototype.chooseRandomImage = function (categoryName) {
        var randomIndex = this.getRandomIndex(this.imageResources.getValue(categoryName));
        if (randomIndex < 0)
            return null;
        return this.imageResources.getValue(categoryName)[randomIndex].getResourceName();
    };
    ResourceManagerHelper.prototype.chooseRandomSound = function (categoryName) {
        var randomIndex = this.getRandomIndex(this.soundResources.getValue(categoryName));
        if (randomIndex < 0)
            return null;
        return this.soundResources.getValue(categoryName)[randomIndex].getResourceName();
    };
    ResourceManagerHelper.prototype.getRandomIndex = function (list) {
        var index = -1;
        if (list == null)
            return index;
        index = Math.floor(Math.random() * list.length);
        return index;
    };
    return ResourceManagerHelper;
}());
//# sourceMappingURL=ResourceManagerHelper.js.map
;
//# sourceMappingURL=IActionManager.js.map
;
//# sourceMappingURL=IAliveAgent.js.map
;
//# sourceMappingURL=IAwarenessManager.js.map
//# sourceMappingURL=ICalendarManager.js.map
;
//# sourceMappingURL=ICharacterManager.js.map
;
//# sourceMappingURL=IConfigurationManager.js.map
;
//# sourceMappingURL=IDatabaseManager.js.map
//# sourceMappingURL=IInformationManager.js.map
//# sourceMappingURL=IManagersHandler.js.map
;
//# sourceMappingURL=IMenuManager.js.map
;
//# sourceMappingURL=IResourceManager.js.map
//# sourceMappingURL=IRestManager.js.map
;
//# sourceMappingURL=ISpeechToTextManager.js.map
;
//# sourceMappingURL=ITextToSpeechManager.js.map
//# sourceMappingURL=IStateSwitchable.js.map
var TimerTriggerSystem = (function () {
    function TimerTriggerSystem(currentTimeCallback) {
        this.currentTime = currentTimeCallback;
        this.dict = new collections.Dictionary();
    }
    TimerTriggerSystem.prototype.set = function (timerName, length) {
        this.dict.setValue(timerName, this.currentTime() + length);
    };
    TimerTriggerSystem.prototype.isOnGoing = function (timerName) {
        if (!this.dict.containsKey(timerName)) {
            return false;
        }
        return this.currentTime() < this.dict.getValue(timerName);
    };
    return TimerTriggerSystem;
}());
//# sourceMappingURL=TimerTriggerSystem.js.map
var WordsEvaluator = (function () {
    function WordsEvaluator() {
    }
    WordsEvaluator.prototype.containsBadWord = function (sentence) {
        sentence = sentence.toLowerCase();
        return this.hasWord(sentence, "shut") || this.hasWord(sentence, "fuck") || this.hasWord(sentence, "bitch")
            || this.hasWord(sentence, "stupid") || this.hasWord(sentence, "idiot") || this.hasWord(sentence, "assbite")
            || this.hasWord(sentence, "jerk") || this.hasWord(sentence, "suck") || this.hasWord(sentence, "sucker")
            || this.hasWord(sentence, "gay") || this.hasWord(sentence, "cock") || this.hasWord(sentence, "vagina")
            || this.hasWord(sentence, "junkey") || this.hasWord(sentence, "pig") || this.hasWord(sentence, "arse")
            || this.hasWord(sentence, "bastard") || this.hasWord(sentence, "whore") || this.hasWord(sentence, "cunt");
    };
    WordsEvaluator.prototype.hasWord = function (sentence, word) {
        return sentence.indexOf(word) != -1;
    };
    return WordsEvaluator;
}());
//# sourceMappingURL=WordsEvaluator.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var collections;
(function (collections) {
    var _hasOwnProperty = Object.prototype.hasOwnProperty;
    var has = function (obj, prop) {
        return _hasOwnProperty.call(obj, prop);
    };
    function defaultCompare(a, b) {
        if (a < b) {
            return -1;
        }
        else if (a === b) {
            return 0;
        }
        else {
            return 1;
        }
    }
    collections.defaultCompare = defaultCompare;
    function defaultEquals(a, b) {
        return a === b;
    }
    collections.defaultEquals = defaultEquals;
    function defaultToString(item) {
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (collections.isString(item)) {
            return '$s' + item;
        }
        else {
            return '$o' + item.toString();
        }
    }
    collections.defaultToString = defaultToString;
    function makeString(item, join) {
        if (join === void 0) { join = ","; }
        if (item === null) {
            return 'COLLECTION_NULL';
        }
        else if (collections.isUndefined(item)) {
            return 'COLLECTION_UNDEFINED';
        }
        else if (collections.isString(item)) {
            return item.toString();
        }
        else {
            var toret = "{";
            var first = true;
            for (var prop in item) {
                if (has(item, prop)) {
                    if (first)
                        first = false;
                    else
                        toret = toret + join;
                    toret = toret + prop + ":" + item[prop];
                }
            }
            return toret + "}";
        }
    }
    collections.makeString = makeString;
    function isFunction(func) {
        return (typeof func) === 'function';
    }
    collections.isFunction = isFunction;
    function isUndefined(obj) {
        return (typeof obj) === 'undefined';
    }
    collections.isUndefined = isUndefined;
    function isString(obj) {
        return Object.prototype.toString.call(obj) === '[object String]';
    }
    collections.isString = isString;
    function reverseCompareFunction(compareFunction) {
        if (!collections.isFunction(compareFunction)) {
            return function (a, b) {
                if (a < b) {
                    return 1;
                }
                else if (a === b) {
                    return 0;
                }
                else {
                    return -1;
                }
            };
        }
        else {
            return function (d, v) {
                return compareFunction(d, v) * -1;
            };
        }
    }
    collections.reverseCompareFunction = reverseCompareFunction;
    function compareToEquals(compareFunction) {
        return function (a, b) {
            return compareFunction(a, b) === 0;
        };
    }
    collections.compareToEquals = compareToEquals;
    var arrays;
    (function (arrays) {
        function indexOf(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.indexOf = indexOf;
        function lastIndexOf(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            for (var i = length - 1; i >= 0; i--) {
                if (equals(array[i], item)) {
                    return i;
                }
            }
            return -1;
        }
        arrays.lastIndexOf = lastIndexOf;
        function contains(array, item, equalsFunction) {
            return arrays.indexOf(array, item, equalsFunction) >= 0;
        }
        arrays.contains = contains;
        function remove(array, item, equalsFunction) {
            var index = arrays.indexOf(array, item, equalsFunction);
            if (index < 0) {
                return false;
            }
            array.splice(index, 1);
            return true;
        }
        arrays.remove = remove;
        function frequency(array, item, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            var length = array.length;
            var freq = 0;
            for (var i = 0; i < length; i++) {
                if (equals(array[i], item)) {
                    freq++;
                }
            }
            return freq;
        }
        arrays.frequency = frequency;
        function equals(array1, array2, equalsFunction) {
            var equals = equalsFunction || collections.defaultEquals;
            if (array1.length !== array2.length) {
                return false;
            }
            var length = array1.length;
            for (var i = 0; i < length; i++) {
                if (!equals(array1[i], array2[i])) {
                    return false;
                }
            }
            return true;
        }
        arrays.equals = equals;
        function copy(array) {
            return array.concat();
        }
        arrays.copy = copy;
        function swap(array, i, j) {
            if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
                return false;
            }
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
            return true;
        }
        arrays.swap = swap;
        function toString(array) {
            return '[' + array.toString() + ']';
        }
        arrays.toString = toString;
        function forEach(array, callback) {
            var lenght = array.length;
            for (var i = 0; i < lenght; i++) {
                if (callback(array[i]) === false) {
                    return;
                }
            }
        }
        arrays.forEach = forEach;
    })(arrays = collections.arrays || (collections.arrays = {}));
    var LinkedList = (function () {
        function LinkedList() {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        }
        LinkedList.prototype.add = function (item, index) {
            if (collections.isUndefined(index)) {
                index = this.nElements;
            }
            if (index < 0 || index > this.nElements || collections.isUndefined(item)) {
                return false;
            }
            var newNode = this.createNode(item);
            if (this.nElements === 0) {
                this.firstNode = newNode;
                this.lastNode = newNode;
            }
            else if (index === this.nElements) {
                this.lastNode.next = newNode;
                this.lastNode = newNode;
            }
            else if (index === 0) {
                newNode.next = this.firstNode;
                this.firstNode = newNode;
            }
            else {
                var prev = this.nodeAtIndex(index - 1);
                newNode.next = prev.next;
                prev.next = newNode;
            }
            this.nElements++;
            return true;
        };
        LinkedList.prototype.first = function () {
            if (this.firstNode !== null) {
                return this.firstNode.element;
            }
            return undefined;
        };
        LinkedList.prototype.last = function () {
            if (this.lastNode !== null) {
                return this.lastNode.element;
            }
            return undefined;
        };
        LinkedList.prototype.elementAtIndex = function (index) {
            var node = this.nodeAtIndex(index);
            if (node === null) {
                return undefined;
            }
            return node.element;
        };
        LinkedList.prototype.indexOf = function (item, equalsFunction) {
            var equalsF = equalsFunction || collections.defaultEquals;
            if (collections.isUndefined(item)) {
                return -1;
            }
            var currentNode = this.firstNode;
            var index = 0;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    return index;
                }
                index++;
                currentNode = currentNode.next;
            }
            return -1;
        };
        LinkedList.prototype.contains = function (item, equalsFunction) {
            return (this.indexOf(item, equalsFunction) >= 0);
        };
        LinkedList.prototype.remove = function (item, equalsFunction) {
            var equalsF = equalsFunction || collections.defaultEquals;
            if (this.nElements < 1 || collections.isUndefined(item)) {
                return false;
            }
            var previous = null;
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (equalsF(currentNode.element, item)) {
                    if (currentNode === this.firstNode) {
                        this.firstNode = this.firstNode.next;
                        if (currentNode === this.lastNode) {
                            this.lastNode = null;
                        }
                    }
                    else if (currentNode === this.lastNode) {
                        this.lastNode = previous;
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    else {
                        previous.next = currentNode.next;
                        currentNode.next = null;
                    }
                    this.nElements--;
                    return true;
                }
                previous = currentNode;
                currentNode = currentNode.next;
            }
            return false;
        };
        LinkedList.prototype.clear = function () {
            this.firstNode = null;
            this.lastNode = null;
            this.nElements = 0;
        };
        LinkedList.prototype.equals = function (other, equalsFunction) {
            var eqF = equalsFunction || collections.defaultEquals;
            if (!(other instanceof collections.LinkedList)) {
                return false;
            }
            if (this.size() !== other.size()) {
                return false;
            }
            return this.equalsAux(this.firstNode, other.firstNode, eqF);
        };
        LinkedList.prototype.equalsAux = function (n1, n2, eqF) {
            while (n1 !== null) {
                if (!eqF(n1.element, n2.element)) {
                    return false;
                }
                n1 = n1.next;
                n2 = n2.next;
            }
            return true;
        };
        LinkedList.prototype.removeElementAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return undefined;
            }
            var element;
            if (this.nElements === 1) {
                element = this.firstNode.element;
                this.firstNode = null;
                this.lastNode = null;
            }
            else {
                var previous = this.nodeAtIndex(index - 1);
                if (previous === null) {
                    element = this.firstNode.element;
                    this.firstNode = this.firstNode.next;
                }
                else if (previous.next === this.lastNode) {
                    element = this.lastNode.element;
                    this.lastNode = previous;
                }
                if (previous !== null) {
                    element = previous.next.element;
                    previous.next = previous.next.next;
                }
            }
            this.nElements--;
            return element;
        };
        LinkedList.prototype.forEach = function (callback) {
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                if (callback(currentNode.element) === false) {
                    break;
                }
                currentNode = currentNode.next;
            }
        };
        LinkedList.prototype.reverse = function () {
            var previous = null;
            var current = this.firstNode;
            var temp = null;
            while (current !== null) {
                temp = current.next;
                current.next = previous;
                previous = current;
                current = temp;
            }
            temp = this.firstNode;
            this.firstNode = this.lastNode;
            this.lastNode = temp;
        };
        LinkedList.prototype.toArray = function () {
            var array = [];
            var currentNode = this.firstNode;
            while (currentNode !== null) {
                array.push(currentNode.element);
                currentNode = currentNode.next;
            }
            return array;
        };
        LinkedList.prototype.size = function () {
            return this.nElements;
        };
        LinkedList.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        LinkedList.prototype.toString = function () {
            return collections.arrays.toString(this.toArray());
        };
        LinkedList.prototype.nodeAtIndex = function (index) {
            if (index < 0 || index >= this.nElements) {
                return null;
            }
            if (index === (this.nElements - 1)) {
                return this.lastNode;
            }
            var node = this.firstNode;
            for (var i = 0; i < index; i++) {
                node = node.next;
            }
            return node;
        };
        LinkedList.prototype.createNode = function (item) {
            return {
                element: item,
                next: null
            };
        };
        return LinkedList;
    }());
    collections.LinkedList = LinkedList;
    var Dictionary = (function () {
        function Dictionary(toStrFunction) {
            this.table = {};
            this.nElements = 0;
            this.toStr = toStrFunction || collections.defaultToString;
        }
        Dictionary.prototype.getValue = function (key) {
            var pair = this.table['$' + this.toStr(key)];
            if (collections.isUndefined(pair)) {
                return undefined;
            }
            return pair.value;
        };
        Dictionary.prototype.setValue = function (key, value) {
            if (collections.isUndefined(key) || collections.isUndefined(value)) {
                return undefined;
            }
            var ret;
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
            if (collections.isUndefined(previousElement)) {
                this.nElements++;
                ret = undefined;
            }
            else {
                ret = previousElement.value;
            }
            this.table[k] = {
                key: key,
                value: value
            };
            return ret;
        };
        Dictionary.prototype.remove = function (key) {
            var k = '$' + this.toStr(key);
            var previousElement = this.table[k];
            if (!collections.isUndefined(previousElement)) {
                delete this.table[k];
                this.nElements--;
                return previousElement.value;
            }
            return undefined;
        };
        Dictionary.prototype.keys = function () {
            var array = [];
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    array.push(pair.key);
                }
            }
            return array;
        };
        Dictionary.prototype.values = function () {
            var array = [];
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    array.push(pair.value);
                }
            }
            return array;
        };
        Dictionary.prototype.forEach = function (callback) {
            for (var name in this.table) {
                if (has(this.table, name)) {
                    var pair = this.table[name];
                    var ret = callback(pair.key, pair.value);
                    if (ret === false) {
                        return;
                    }
                }
            }
        };
        Dictionary.prototype.containsKey = function (key) {
            return !collections.isUndefined(this.getValue(key));
        };
        Dictionary.prototype.clear = function () {
            this.table = {};
            this.nElements = 0;
        };
        Dictionary.prototype.size = function () {
            return this.nElements;
        };
        Dictionary.prototype.isEmpty = function () {
            return this.nElements <= 0;
        };
        Dictionary.prototype.toString = function () {
            var toret = "{";
            this.forEach(function (k, v) {
                toret = toret + "\n\t" + k.toString() + " : " + v.toString();
            });
            return toret + "\n}";
        };
        return Dictionary;
    }());
    collections.Dictionary = Dictionary;
    var LinkedDictionaryPair = (function () {
        function LinkedDictionaryPair(key, value) {
            this.key = key;
            this.value = value;
        }
        LinkedDictionaryPair.prototype.unlink = function () {
            this.prev.next = this.next;
            this.next.prev = this.prev;
        };
        return LinkedDictionaryPair;
    }());
    var LinkedDictionary = (function (_super) {
        __extends(LinkedDictionary, _super);
        function LinkedDictionary(toStrFunction) {
            var _this = _super.call(this, toStrFunction) || this;
            _this.head = new LinkedDictionaryPair(null, null);
            _this.tail = new LinkedDictionaryPair(null, null);
            _this.head.next = _this.tail;
            _this.tail.prev = _this.head;
            return _this;
        }
        LinkedDictionary.prototype.appendToTail = function (entry) {
            var lastNode = this.tail.prev;
            lastNode.next = entry;
            entry.prev = lastNode;
            entry.next = this.tail;
            this.tail.prev = entry;
        };
        LinkedDictionary.prototype.getLinkedDictionaryPair = function (key) {
            if (collections.isUndefined(key)) {
                return undefined;
            }
            var k = '$' + this.toStr(key);
            var pair = (this.table[k]);
            return pair;
        };
        LinkedDictionary.prototype.getValue = function (key) {
            var pair = this.getLinkedDictionaryPair(key);
            if (!collections.isUndefined(pair)) {
                return pair.value;
            }
            return undefined;
        };
        LinkedDictionary.prototype.remove = function (key) {
            var pair = this.getLinkedDictionaryPair(key);
            if (!collections.isUndefined(pair)) {
                _super.prototype.remove.call(this, key);
                pair.unlink();
                return pair.value;
            }
            return undefined;
        };
        LinkedDictionary.prototype.clear = function () {
            _super.prototype.clear.call(this);
            this.head.next = this.tail;
            this.tail.prev = this.head;
        };
        LinkedDictionary.prototype.replace = function (oldPair, newPair) {
            var k = '$' + this.toStr(newPair.key);
            newPair.next = oldPair.next;
            newPair.prev = oldPair.prev;
            this.remove(oldPair.key);
            newPair.prev.next = newPair;
            newPair.next.prev = newPair;
            this.table[k] = newPair;
            ++this.nElements;
        };
        LinkedDictionary.prototype.setValue = function (key, value) {
            if (collections.isUndefined(key) || collections.isUndefined(value)) {
                return undefined;
            }
            var existingPair = this.getLinkedDictionaryPair(key);
            var newPair = new LinkedDictionaryPair(key, value);
            var k = '$' + this.toStr(key);
            if (!collections.isUndefined(existingPair)) {
                this.replace(existingPair, newPair);
                return existingPair.value;
            }
            else {
                this.appendToTail(newPair);
                this.table[k] = newPair;
                ++this.nElements;
                return undefined;
            }
        };
        LinkedDictionary.prototype.keys = function () {
            var array = [];
            this.forEach(function (key, value) {
                array.push(key);
            });
            return array;
        };
        LinkedDictionary.prototype.values = function () {
            var array = [];
            this.forEach(function (key, value) {
                array.push(value);
            });
            return array;
        };
        LinkedDictionary.prototype.forEach = function (callback) {
            var crawlNode = this.head.next;
            while (crawlNode.next != null) {
                var ret = callback(crawlNode.key, crawlNode.value);
                if (ret === false) {
                    return;
                }
                crawlNode = crawlNode.next;
            }
        };
        return LinkedDictionary;
    }(Dictionary));
    collections.LinkedDictionary = LinkedDictionary;
    var MultiDictionary = (function () {
        function MultiDictionary(toStrFunction, valuesEqualsFunction, allowDuplicateValues) {
            if (allowDuplicateValues === void 0) { allowDuplicateValues = false; }
            this.dict = new Dictionary(toStrFunction);
            this.equalsF = valuesEqualsFunction || collections.defaultEquals;
            this.allowDuplicate = allowDuplicateValues;
        }
        MultiDictionary.prototype.getValue = function (key) {
            var values = this.dict.getValue(key);
            if (collections.isUndefined(values)) {
                return [];
            }
            return collections.arrays.copy(values);
        };
        MultiDictionary.prototype.setValue = function (key, value) {
            if (collections.isUndefined(key) || collections.isUndefined(value)) {
                return false;
            }
            if (!this.containsKey(key)) {
                this.dict.setValue(key, [value]);
                return true;
            }
            var array = this.dict.getValue(key);
            if (!this.allowDuplicate) {
                if (collections.arrays.contains(array, value, this.equalsF)) {
                    return false;
                }
            }
            array.push(value);
            return true;
        };
        MultiDictionary.prototype.remove = function (key, value) {
            if (collections.isUndefined(value)) {
                var v = this.dict.remove(key);
                return !collections.isUndefined(v);
            }
            var array = this.dict.getValue(key);
            if (collections.arrays.remove(array, value, this.equalsF)) {
                if (array.length === 0) {
                    this.dict.remove(key);
                }
                return true;
            }
            return false;
        };
        MultiDictionary.prototype.keys = function () {
            return this.dict.keys();
        };
        MultiDictionary.prototype.values = function () {
            var values = this.dict.values();
            var array = [];
            for (var i = 0; i < values.length; i++) {
                var v = values[i];
                for (var j = 0; j < v.length; j++) {
                    array.push(v[j]);
                }
            }
            return array;
        };
        MultiDictionary.prototype.containsKey = function (key) {
            return this.dict.containsKey(key);
        };
        MultiDictionary.prototype.clear = function () {
            this.dict.clear();
        };
        MultiDictionary.prototype.size = function () {
            return this.dict.size();
        };
        MultiDictionary.prototype.isEmpty = function () {
            return this.dict.isEmpty();
        };
        return MultiDictionary;
    }());
    collections.MultiDictionary = MultiDictionary;
    var Heap = (function () {
        function Heap(compareFunction) {
            this.data = [];
            this.compare = compareFunction || collections.defaultCompare;
        }
        Heap.prototype.leftChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 1;
        };
        Heap.prototype.rightChildIndex = function (nodeIndex) {
            return (2 * nodeIndex) + 2;
        };
        Heap.prototype.parentIndex = function (nodeIndex) {
            return Math.floor((nodeIndex - 1) / 2);
        };
        Heap.prototype.minIndex = function (leftChild, rightChild) {
            if (rightChild >= this.data.length) {
                if (leftChild >= this.data.length) {
                    return -1;
                }
                else {
                    return leftChild;
                }
            }
            else {
                if (this.compare(this.data[leftChild], this.data[rightChild]) <= 0) {
                    return leftChild;
                }
                else {
                    return rightChild;
                }
            }
        };
        Heap.prototype.siftUp = function (index) {
            var parent = this.parentIndex(index);
            while (index > 0 && this.compare(this.data[parent], this.data[index]) > 0) {
                collections.arrays.swap(this.data, parent, index);
                index = parent;
                parent = this.parentIndex(index);
            }
        };
        Heap.prototype.siftDown = function (nodeIndex) {
            var min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            while (min >= 0 && this.compare(this.data[nodeIndex], this.data[min]) > 0) {
                collections.arrays.swap(this.data, min, nodeIndex);
                nodeIndex = min;
                min = this.minIndex(this.leftChildIndex(nodeIndex), this.rightChildIndex(nodeIndex));
            }
        };
        Heap.prototype.peek = function () {
            if (this.data.length > 0) {
                return this.data[0];
            }
            else {
                return undefined;
            }
        };
        Heap.prototype.add = function (element) {
            if (collections.isUndefined(element)) {
                return undefined;
            }
            this.data.push(element);
            this.siftUp(this.data.length - 1);
            return true;
        };
        Heap.prototype.removeRoot = function () {
            if (this.data.length > 0) {
                var obj = this.data[0];
                this.data[0] = this.data[this.data.length - 1];
                this.data.splice(this.data.length - 1, 1);
                if (this.data.length > 0) {
                    this.siftDown(0);
                }
                return obj;
            }
            return undefined;
        };
        Heap.prototype.contains = function (element) {
            var equF = collections.compareToEquals(this.compare);
            return collections.arrays.contains(this.data, element, equF);
        };
        Heap.prototype.size = function () {
            return this.data.length;
        };
        Heap.prototype.isEmpty = function () {
            return this.data.length <= 0;
        };
        Heap.prototype.clear = function () {
            this.data.length = 0;
        };
        Heap.prototype.forEach = function (callback) {
            collections.arrays.forEach(this.data, callback);
        };
        return Heap;
    }());
    collections.Heap = Heap;
    var Stack = (function () {
        function Stack() {
            this.list = new LinkedList();
        }
        Stack.prototype.push = function (elem) {
            return this.list.add(elem, 0);
        };
        Stack.prototype.add = function (elem) {
            return this.list.add(elem, 0);
        };
        Stack.prototype.pop = function () {
            return this.list.removeElementAtIndex(0);
        };
        Stack.prototype.peek = function () {
            return this.list.first();
        };
        Stack.prototype.size = function () {
            return this.list.size();
        };
        Stack.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        Stack.prototype.isEmpty = function () {
            return this.list.isEmpty();
        };
        Stack.prototype.clear = function () {
            this.list.clear();
        };
        Stack.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Stack;
    }());
    collections.Stack = Stack;
    var Queue = (function () {
        function Queue() {
            this.list = new LinkedList();
        }
        Queue.prototype.enqueue = function (elem) {
            return this.list.add(elem);
        };
        Queue.prototype.add = function (elem) {
            return this.list.add(elem);
        };
        Queue.prototype.dequeue = function () {
            if (this.list.size() !== 0) {
                var el = this.list.first();
                this.list.removeElementAtIndex(0);
                return el;
            }
            return undefined;
        };
        Queue.prototype.peek = function () {
            if (this.list.size() !== 0) {
                return this.list.first();
            }
            return undefined;
        };
        Queue.prototype.size = function () {
            return this.list.size();
        };
        Queue.prototype.contains = function (elem, equalsFunction) {
            return this.list.contains(elem, equalsFunction);
        };
        Queue.prototype.isEmpty = function () {
            return this.list.size() <= 0;
        };
        Queue.prototype.clear = function () {
            this.list.clear();
        };
        Queue.prototype.forEach = function (callback) {
            this.list.forEach(callback);
        };
        return Queue;
    }());
    collections.Queue = Queue;
    var PriorityQueue = (function () {
        function PriorityQueue(compareFunction) {
            this.heap = new Heap(collections.reverseCompareFunction(compareFunction));
        }
        PriorityQueue.prototype.enqueue = function (element) {
            return this.heap.add(element);
        };
        PriorityQueue.prototype.add = function (element) {
            return this.heap.add(element);
        };
        PriorityQueue.prototype.dequeue = function () {
            if (this.heap.size() !== 0) {
                var el = this.heap.peek();
                this.heap.removeRoot();
                return el;
            }
            return undefined;
        };
        PriorityQueue.prototype.peek = function () {
            return this.heap.peek();
        };
        PriorityQueue.prototype.contains = function (element) {
            return this.heap.contains(element);
        };
        PriorityQueue.prototype.isEmpty = function () {
            return this.heap.isEmpty();
        };
        PriorityQueue.prototype.size = function () {
            return this.heap.size();
        };
        PriorityQueue.prototype.clear = function () {
            this.heap.clear();
        };
        PriorityQueue.prototype.forEach = function (callback) {
            this.heap.forEach(callback);
        };
        return PriorityQueue;
    }());
    collections.PriorityQueue = PriorityQueue;
    var Set = (function () {
        function Set(toStringFunction) {
            this.dictionary = new Dictionary(toStringFunction);
        }
        Set.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        Set.prototype.add = function (element) {
            if (this.contains(element) || collections.isUndefined(element)) {
                return false;
            }
            else {
                this.dictionary.setValue(element, element);
                return true;
            }
        };
        Set.prototype.intersection = function (otherSet) {
            var set = this;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    set.remove(element);
                }
                return true;
            });
        };
        Set.prototype.union = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.add(element);
                return true;
            });
        };
        Set.prototype.difference = function (otherSet) {
            var set = this;
            otherSet.forEach(function (element) {
                set.remove(element);
                return true;
            });
        };
        Set.prototype.isSubsetOf = function (otherSet) {
            if (this.size() > otherSet.size()) {
                return false;
            }
            var isSub = true;
            this.forEach(function (element) {
                if (!otherSet.contains(element)) {
                    isSub = false;
                    return false;
                }
                return true;
            });
            return isSub;
        };
        Set.prototype.remove = function (element) {
            if (!this.contains(element)) {
                return false;
            }
            else {
                this.dictionary.remove(element);
                return true;
            }
        };
        Set.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                return callback(v);
            });
        };
        Set.prototype.toArray = function () {
            return this.dictionary.values();
        };
        Set.prototype.isEmpty = function () {
            return this.dictionary.isEmpty();
        };
        Set.prototype.size = function () {
            return this.dictionary.size();
        };
        Set.prototype.clear = function () {
            this.dictionary.clear();
        };
        Set.prototype.toString = function () {
            return collections.arrays.toString(this.toArray());
        };
        return Set;
    }());
    collections.Set = Set;
    var Bag = (function () {
        function Bag(toStrFunction) {
            this.toStrF = toStrFunction || collections.defaultToString;
            this.dictionary = new Dictionary(this.toStrF);
            this.nElements = 0;
        }
        Bag.prototype.add = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                var node = {
                    value: element,
                    copies: nCopies
                };
                this.dictionary.setValue(element, node);
            }
            else {
                this.dictionary.getValue(element).copies += nCopies;
            }
            this.nElements += nCopies;
            return true;
        };
        Bag.prototype.count = function (element) {
            if (!this.contains(element)) {
                return 0;
            }
            else {
                return this.dictionary.getValue(element).copies;
            }
        };
        Bag.prototype.contains = function (element) {
            return this.dictionary.containsKey(element);
        };
        Bag.prototype.remove = function (element, nCopies) {
            if (nCopies === void 0) { nCopies = 1; }
            if (collections.isUndefined(element) || nCopies <= 0) {
                return false;
            }
            if (!this.contains(element)) {
                return false;
            }
            else {
                var node = this.dictionary.getValue(element);
                if (nCopies > node.copies) {
                    this.nElements -= node.copies;
                }
                else {
                    this.nElements -= nCopies;
                }
                node.copies -= nCopies;
                if (node.copies <= 0) {
                    this.dictionary.remove(element);
                }
                return true;
            }
        };
        Bag.prototype.toArray = function () {
            var a = [];
            var values = this.dictionary.values();
            var vl = values.length;
            for (var i = 0; i < vl; i++) {
                var node = values[i];
                var element = node.value;
                var copies = node.copies;
                for (var j = 0; j < copies; j++) {
                    a.push(element);
                }
            }
            return a;
        };
        Bag.prototype.toSet = function () {
            var toret = new Set(this.toStrF);
            var elements = this.dictionary.values();
            var l = elements.length;
            for (var i = 0; i < l; i++) {
                var value = elements[i].value;
                toret.add(value);
            }
            return toret;
        };
        Bag.prototype.forEach = function (callback) {
            this.dictionary.forEach(function (k, v) {
                var value = v.value;
                var copies = v.copies;
                for (var i = 0; i < copies; i++) {
                    if (callback(value) === false) {
                        return false;
                    }
                }
                return true;
            });
        };
        Bag.prototype.size = function () {
            return this.nElements;
        };
        Bag.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        Bag.prototype.clear = function () {
            this.nElements = 0;
            this.dictionary.clear();
        };
        return Bag;
    }());
    collections.Bag = Bag;
    var BSTree = (function () {
        function BSTree(compareFunction) {
            this.root = null;
            this.compare = compareFunction || collections.defaultCompare;
            this.nElements = 0;
        }
        BSTree.prototype.add = function (element) {
            if (collections.isUndefined(element)) {
                return false;
            }
            if (this.insertNode(this.createNode(element)) !== null) {
                this.nElements++;
                return true;
            }
            return false;
        };
        BSTree.prototype.clear = function () {
            this.root = null;
            this.nElements = 0;
        };
        BSTree.prototype.isEmpty = function () {
            return this.nElements === 0;
        };
        BSTree.prototype.size = function () {
            return this.nElements;
        };
        BSTree.prototype.contains = function (element) {
            if (collections.isUndefined(element)) {
                return false;
            }
            return this.searchNode(this.root, element) !== null;
        };
        BSTree.prototype.remove = function (element) {
            var node = this.searchNode(this.root, element);
            if (node === null) {
                return false;
            }
            this.removeNode(node);
            this.nElements--;
            return true;
        };
        BSTree.prototype.inorderTraversal = function (callback) {
            this.inorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        BSTree.prototype.preorderTraversal = function (callback) {
            this.preorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        BSTree.prototype.postorderTraversal = function (callback) {
            this.postorderTraversalAux(this.root, callback, {
                stop: false
            });
        };
        BSTree.prototype.levelTraversal = function (callback) {
            this.levelTraversalAux(this.root, callback);
        };
        BSTree.prototype.minimum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.minimumAux(this.root).element;
        };
        BSTree.prototype.maximum = function () {
            if (this.isEmpty()) {
                return undefined;
            }
            return this.maximumAux(this.root).element;
        };
        BSTree.prototype.forEach = function (callback) {
            this.inorderTraversal(callback);
        };
        BSTree.prototype.toArray = function () {
            var array = [];
            this.inorderTraversal(function (element) {
                array.push(element);
                return true;
            });
            return array;
        };
        BSTree.prototype.height = function () {
            return this.heightAux(this.root);
        };
        BSTree.prototype.searchNode = function (node, element) {
            var cmp = null;
            while (node !== null && cmp !== 0) {
                cmp = this.compare(element, node.element);
                if (cmp < 0) {
                    node = node.leftCh;
                }
                else if (cmp > 0) {
                    node = node.rightCh;
                }
            }
            return node;
        };
        BSTree.prototype.transplant = function (n1, n2) {
            if (n1.parent === null) {
                this.root = n2;
            }
            else if (n1 === n1.parent.leftCh) {
                n1.parent.leftCh = n2;
            }
            else {
                n1.parent.rightCh = n2;
            }
            if (n2 !== null) {
                n2.parent = n1.parent;
            }
        };
        BSTree.prototype.removeNode = function (node) {
            if (node.leftCh === null) {
                this.transplant(node, node.rightCh);
            }
            else if (node.rightCh === null) {
                this.transplant(node, node.leftCh);
            }
            else {
                var y = this.minimumAux(node.rightCh);
                if (y.parent !== node) {
                    this.transplant(y, y.rightCh);
                    y.rightCh = node.rightCh;
                    y.rightCh.parent = y;
                }
                this.transplant(node, y);
                y.leftCh = node.leftCh;
                y.leftCh.parent = y;
            }
        };
        BSTree.prototype.inorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.inorderTraversalAux(node.rightCh, callback, signal);
        };
        BSTree.prototype.levelTraversalAux = function (node, callback) {
            var queue = new Queue();
            if (node !== null) {
                queue.enqueue(node);
            }
            while (!queue.isEmpty()) {
                node = queue.dequeue();
                if (callback(node.element) === false) {
                    return;
                }
                if (node.leftCh !== null) {
                    queue.enqueue(node.leftCh);
                }
                if (node.rightCh !== null) {
                    queue.enqueue(node.rightCh);
                }
            }
        };
        BSTree.prototype.preorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.preorderTraversalAux(node.rightCh, callback, signal);
        };
        BSTree.prototype.postorderTraversalAux = function (node, callback, signal) {
            if (node === null || signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.leftCh, callback, signal);
            if (signal.stop) {
                return;
            }
            this.postorderTraversalAux(node.rightCh, callback, signal);
            if (signal.stop) {
                return;
            }
            signal.stop = callback(node.element) === false;
        };
        BSTree.prototype.minimumAux = function (node) {
            while (node.leftCh !== null) {
                node = node.leftCh;
            }
            return node;
        };
        BSTree.prototype.maximumAux = function (node) {
            while (node.rightCh !== null) {
                node = node.rightCh;
            }
            return node;
        };
        BSTree.prototype.heightAux = function (node) {
            if (node === null) {
                return -1;
            }
            return Math.max(this.heightAux(node.leftCh), this.heightAux(node.rightCh)) + 1;
        };
        BSTree.prototype.insertNode = function (node) {
            var parent = null;
            var position = this.root;
            var cmp = null;
            while (position !== null) {
                cmp = this.compare(node.element, position.element);
                if (cmp === 0) {
                    return null;
                }
                else if (cmp < 0) {
                    parent = position;
                    position = position.leftCh;
                }
                else {
                    parent = position;
                    position = position.rightCh;
                }
            }
            node.parent = parent;
            if (parent === null) {
                this.root = node;
            }
            else if (this.compare(node.element, parent.element) < 0) {
                parent.leftCh = node;
            }
            else {
                parent.rightCh = node;
            }
            return node;
        };
        BSTree.prototype.createNode = function (element) {
            return {
                element: element,
                leftCh: null,
                rightCh: null,
                parent: null
            };
        };
        return BSTree;
    }());
    collections.BSTree = BSTree;
})(collections || (collections = {}));
//# sourceMappingURL=collections.js.map
//# sourceMappingURL=IAliveLocation.js.map
//# sourceMappingURL=IAliveUserActivity.js.map
//# sourceMappingURL=IAliveWeather.js.map
//# sourceMappingURL=ICalendarEvent.js.map
var BaseMenuItem = (function () {
    function BaseMenuItem() {
    }
    return BaseMenuItem;
}());
var PaintMenuItem = (function () {
    function PaintMenuItem() {
    }
    return PaintMenuItem;
}());
var PictureMenuItem = (function () {
    function PictureMenuItem() {
        this.ViewType = ViewType.Picture;
    }
    return PictureMenuItem;
}());
PictureMenuItem.UseProfilePicture = "Use Profile Picture";
PictureMenuItem.UseCoverPicture = "Use Cover Picture";
var ButtonMenuItem = (function () {
    function ButtonMenuItem() {
        this.ViewType = ViewType.Button;
    }
    return ButtonMenuItem;
}());
var CheckBoxMenuItem = (function () {
    function CheckBoxMenuItem() {
        this.ViewType = ViewType.CheckBox;
    }
    return CheckBoxMenuItem;
}());
var TextBoxMenuItem = (function () {
    function TextBoxMenuItem() {
        this.ViewType = ViewType.TextBox;
    }
    return TextBoxMenuItem;
}());
var ProgressBarMenuItem = (function () {
    function ProgressBarMenuItem() {
        this.ViewType = ViewType.ProgressBar;
    }
    return ProgressBarMenuItem;
}());
//# sourceMappingURL=BaseMenuItem.js.map
var MenuHeader = (function () {
    function MenuHeader() {
    }
    return MenuHeader;
}());
//# sourceMappingURL=MenuHeader.js.map
var ViewType = (function () {
    function ViewType() {
    }
    Object.defineProperty(ViewType, "Button", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewType, "Picture", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewType, "ProgressBar", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewType, "CheckBox", {
        get: function () { return 3; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ViewType, "TextBox", {
        get: function () { return 4; },
        enumerable: true,
        configurable: true
    });
    return ViewType;
}());
//# sourceMappingURL=ViewType.js.map
//# sourceMappingURL=IBaseMenuItem.js.map
//# sourceMappingURL=IButtonMenuItem.js.map
//# sourceMappingURL=ICheckBoxMenuItem.js.map
//# sourceMappingURL=IMenuHeader.js.map
//# sourceMappingURL=IPaintMenuItem.js.map
//# sourceMappingURL=IPictureMenuItem.js.map
//# sourceMappingURL=IProgressBarMenuItem.js.map
//# sourceMappingURL=ITextBoxMenuItem.js.map
//# sourceMappingURL=IAliveLatLng.js.map
//# sourceMappingURL=IAliveLatLngBounds.js.map
//# sourceMappingURL=IAliveLocation.js.map
//# sourceMappingURL=IAlivePlace.js.map
//# sourceMappingURL=IAlivePlaceLikelihood.js.map
var PlaceType = (function () {
    function PlaceType() {
    }
    Object.defineProperty(PlaceType, "TYPE_OTHER", {
        get: function () { return 0; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ACCOUNTING", {
        get: function () { return 1; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_AIRPORT", {
        get: function () { return 2; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_AMUSEMENT_PARK", {
        get: function () { return 3; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_AQUARIUM", {
        get: function () { return 4; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ART_GALLERY", {
        get: function () { return 5; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ATM", {
        get: function () { return 6; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BAKERY", {
        get: function () { return 7; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BANK", {
        get: function () { return 8; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BAR", {
        get: function () { return 9; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BEAUTY_SALON", {
        get: function () { return 10; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BICYCLE_STORE", {
        get: function () { return 11; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BOOK_STORE", {
        get: function () { return 12; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BOWLING_ALLEY", {
        get: function () { return 13; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_BUS_STATION", {
        get: function () { return 14; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAFE", {
        get: function () { return 15; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAMPGROUND", {
        get: function () { return 16; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAR_DEALER", {
        get: function () { return 17; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAR_RENTAL", {
        get: function () { return 18; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAR_REPAIR", {
        get: function () { return 19; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CAR_WASH", {
        get: function () { return 20; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CASINO", {
        get: function () { return 21; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CEMETERY", {
        get: function () { return 22; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CHURCH", {
        get: function () { return 23; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CITY_HALL", {
        get: function () { return 24; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CLOTHING_STORE", {
        get: function () { return 25; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_CONVENIENCE_STORE", {
        get: function () { return 26; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_COURTHOUSE", {
        get: function () { return 27; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_DENTIST", {
        get: function () { return 28; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_DEPARTMENT_STORE", {
        get: function () { return 29; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_DOCTOR", {
        get: function () { return 30; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ELECTRICIAN", {
        get: function () { return 31; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ELECTRONICS_STORE", {
        get: function () { return 32; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_EMBASSY", {
        get: function () { return 33; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ESTABLISHMENT", {
        get: function () { return 34; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FINANCE", {
        get: function () { return 35; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FIRE_STATION", {
        get: function () { return 36; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FLORIST", {
        get: function () { return 37; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FOOD", {
        get: function () { return 38; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FUNERAL_HOME", {
        get: function () { return 39; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FURNITURE_STORE", {
        get: function () { return 40; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_GAS_STATION", {
        get: function () { return 41; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_GENERAL_CONTRACTOR", {
        get: function () { return 42; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_GROCERY_OR_SUPERMARKET", {
        get: function () { return 43; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_GYM", {
        get: function () { return 44; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HAIR_CARE", {
        get: function () { return 45; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HARDWARE_STORE", {
        get: function () { return 46; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HEALTH", {
        get: function () { return 47; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HINDU_TEMPLE", {
        get: function () { return 48; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HOME_GOODS_STORE", {
        get: function () { return 49; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_HOSPITAL", {
        get: function () { return 50; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_INSURANCE_AGENCY", {
        get: function () { return 51; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_JEWELRY_STORE", {
        get: function () { return 52; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LAUNDRY", {
        get: function () { return 53; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LAWYER", {
        get: function () { return 54; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LIBRARY", {
        get: function () { return 55; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LIQUOR_STORE", {
        get: function () { return 56; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LOCAL_GOVERNMENT_OFFICE", {
        get: function () { return 57; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LOCKSMITH", {
        get: function () { return 58; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LODGING", {
        get: function () { return 59; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MEAL_DELIVERY", {
        get: function () { return 60; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MEAL_TAKEAWAY", {
        get: function () { return 61; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MOSQUE", {
        get: function () { return 62; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MOVIE_RENTAL", {
        get: function () { return 63; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MOVIE_THEATER", {
        get: function () { return 64; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MOVING_COMPANY", {
        get: function () { return 65; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_MUSEUM", {
        get: function () { return 66; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_NIGHT_CLUB", {
        get: function () { return 67; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PAINTER", {
        get: function () { return 68; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PARK", {
        get: function () { return 69; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PARKING", {
        get: function () { return 70; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PET_STORE", {
        get: function () { return 71; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PHARMACY", {
        get: function () { return 72; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PHYSIOTHERAPIST", {
        get: function () { return 73; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PLACE_OF_WORSHIP", {
        get: function () { return 74; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PLUMBER", {
        get: function () { return 75; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POLICE", {
        get: function () { return 76; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POST_OFFICE", {
        get: function () { return 77; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_REAL_ESTATE_AGENCY", {
        get: function () { return 78; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_RESTAURANT", {
        get: function () { return 79; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ROOFING_CONTRACTOR", {
        get: function () { return 80; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_RV_PARK", {
        get: function () { return 81; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SCHOOL", {
        get: function () { return 82; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SHOE_STORE", {
        get: function () { return 83; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SHOPPING_MALL", {
        get: function () { return 84; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SPA", {
        get: function () { return 85; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_STADIUM", {
        get: function () { return 86; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_STORAGE", {
        get: function () { return 87; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_STORE", {
        get: function () { return 88; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBWAY_STATION", {
        get: function () { return 89; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SYNAGOGUE", {
        get: function () { return 90; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_TAXI_STAND", {
        get: function () { return 91; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_TRAIN_STATION", {
        get: function () { return 92; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_TRAVEL_AGENCY", {
        get: function () { return 93; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_UNIVERSITY", {
        get: function () { return 94; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_VETERINARY_CARE", {
        get: function () { return 95; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ZOO", {
        get: function () { return 96; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ADMINISTRATIVE_AREA_LEVEL_1", {
        get: function () { return 1001; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ADMINISTRATIVE_AREA_LEVEL_2", {
        get: function () { return 1002; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ADMINISTRATIVE_AREA_LEVEL_3", {
        get: function () { return 1003; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_COLLOQUIAL_AREA", {
        get: function () { return 1004; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_COUNTRY", {
        get: function () { return 1005; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_FLOOR", {
        get: function () { return 1006; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_GEOCODE", {
        get: function () { return 1007; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_INTERSECTION", {
        get: function () { return 1008; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_LOCALITY", {
        get: function () { return 1009; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_NATURAL_FEATURE", {
        get: function () { return 1010; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_NEIGHBORHOOD", {
        get: function () { return 1011; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POLITICAL", {
        get: function () { return 1012; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POINT_OF_INTEREST", {
        get: function () { return 1013; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POST_BOX", {
        get: function () { return 1014; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POSTAL_CODE", {
        get: function () { return 1015; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POSTAL_CODE_PREFIX", {
        get: function () { return 1016; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_POSTAL_TOWN", {
        get: function () { return 1017; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_PREMISE", {
        get: function () { return 1018; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ROOM", {
        get: function () { return 1019; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_ROUTE", {
        get: function () { return 1020; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_STREET_ADDRESS", {
        get: function () { return 1021; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY", {
        get: function () { return 1022; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY_LEVEL_1", {
        get: function () { return 1023; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY_LEVEL_2", {
        get: function () { return 1024; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY_LEVEL_3", {
        get: function () { return 1025; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY_LEVEL_4", {
        get: function () { return 1026; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBLOCALITY_LEVEL_5", {
        get: function () { return 1027; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SUBPREMISE", {
        get: function () { return 1028; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_SYNTHETIC_GEOCODE", {
        get: function () { return 1029; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(PlaceType, "TYPE_TRANSIT_STATION", {
        get: function () { return 1030; },
        enumerable: true,
        configurable: true
    });
    return PlaceType;
}());
//# sourceMappingURL=PlaceType.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var MiniGame = (function () {
    function MiniGame() {
    }
    return MiniGame;
}());
var HideAndSeekMiniGame = (function (_super) {
    __extends(HideAndSeekMiniGame, _super);
    function HideAndSeekMiniGame(handler, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.finishCallback = finishCallback;
        return _this;
    }
    HideAndSeekMiniGame.prototype.onStart = function (currentTime) {
        this.catches = 0;
        this.goalCatches = Math.floor(Math.random() * 20) + 1;
        this.gameTime = Math.floor(this.goalCatches * Math.random() * 10) + 5;
        this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);
        this.actionManager.showMessage("This is a hide and seek game! i will hide, and your job is to catch me "
            + this.goalCatches + " times in "
            + this.gameTime
            + " seconds! :D \nThe phone will vibrate everytime you catch me", "#6599FF", "#ffffff", 10000);
        this.menuManager.setProperty("progress", "maxprogress", this.gameTime.toString());
        this.menuManager.setProperty("progress", "progress", this.gameTime.toString());
        this.startTime = currentTime;
        this.gameStartTime = this.startTime + 10000;
    };
    HideAndSeekMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.actionManager.animateAlpha(0, 50);
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
        }
        else {
            this.catches = 0;
        }
        if (currentTime - this.startTime > this.gameTime * 1000) {
            this.finishCallback(false);
        }
    };
    HideAndSeekMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.gameStartTime;
        var remainingTime = this.gameTime - ongoingTime / 1000;
        if (remainingTime < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (remainingTime < 40)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");
        this.menuManager.setProperty("progress", "Progress", remainingTime.toString());
    };
    HideAndSeekMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomX = Math.floor(Math.random() * this.configurationManager.getScreenWidth());
        var randomY = Math.floor(Math.random() * this.configurationManager.getScreenHeight());
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var currentY = this.characterManager.getCurrentCharacterYPosition();
        var disX = Math.abs(currentX - randomX);
        var disY = Math.abs(currentY - randomY);
        var moveX = currentX > randomX ? -disX : disX;
        var moveY = currentY > randomY ? -disY : disY;
        this.actionManager.move(moveX, moveY, 20);
    };
    HideAndSeekMiniGame.prototype.onEventOccured = function (eventName) {
        switch (eventName) {
            case "touch":
                this.catches++;
                this.actionManager.showSystemMessage("catches: " + this.catches.toString());
                this.actionManager.vibrate(250);
                if (this.catches >= this.goalCatches) {
                    this.finishCallback(true);
                    return;
                }
                break;
            case "stop":
                if (this.configurationManager.getCurrentTime().currentTimeMillis - this.gameStartTime > 0)
                    this.finishCallback(false);
                break;
        }
    };
    return HideAndSeekMiniGame;
}(MiniGame));
var ReflexMiniGame = (function (_super) {
    __extends(ReflexMiniGame, _super);
    function ReflexMiniGame(handler, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.finishCallback = finishCallback;
        return _this;
    }
    ReflexMiniGame.prototype.onStart = function (currentTime) {
        this.lastDecreaseTime = currentTime;
        this.touches = 1;
        this.progress = 50;
        this.dancingTime = 0;
        this.currentDrawable = "breathing.png";
        this.difficulty = Math.random() * 100;
        var difficultyTrimmed = this.difficulty.toString().substring(0, 4);
        this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);
        this.actionManager.showMessage("This is a reflex game! i will walk around the screen, and you will need to touch me ,but ONLY while i DANCE! :D "
            + "\nOnce the progress bar in the menu will reach 100%, you will win! but if it reaches 0%... i will win! :D"
            + "\nThe phone will vibrate everytime you do it incorrectly"
            + "\nDifficulty: " + difficultyTrimmed, "#6599FF", "#ffffff", 10000);
        this.menuManager.setProperty("progress", "maxprogress", "100");
        this.menuManager.setProperty("progress", "progress", this.progress.toString());
        this.startTime = currentTime;
        this.gameStartTime = this.startTime + 10000;
    };
    ReflexMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
            this.maybeDance(currentTime);
            this.drawCurrentState();
        }
        else {
            this.lastDecreaseTime = currentTime;
            this.touches = 1;
        }
    };
    ReflexMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.lastDecreaseTime;
        if (ongoingTime > 1000) {
            this.progress = this.progress - 1 - this.difficulty / 100;
            this.lastDecreaseTime = currentTime;
        }
        if (this.progress <= 0) {
            this.finishCallback(false);
        }
        if (this.progress < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (this.progress < 60)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");
        this.menuManager.setProperty("progress", "Progress", this.progress.toString());
    };
    ReflexMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomMove = Math.floor(Math.random() * this.difficulty * 30) - Math.floor(Math.random() * this.difficulty * 30);
        this.actionManager.move(randomMove, randomMove, 250);
    };
    ReflexMiniGame.prototype.maybeDance = function (currentTime) {
        if (currentTime > this.dancingTime) {
            this.currentDrawable = "breathing.png";
        }
        var danceChance = (100 - this.progress) / 100;
        if (danceChance < 0.15)
            danceChance = 0.15;
        if (Math.random() < danceChance) {
            this.dancingTime = currentTime + danceChance * 2000;
            this.currentDrawable = "pirate-dancing.png";
        }
    };
    ReflexMiniGame.prototype.drawCurrentState = function () {
        this.actionManager.draw(this.currentDrawable, this.configurationManager.getMaximalResizeRatio(), false);
    };
    ReflexMiniGame.prototype.onEventOccured = function (eventName) {
        var now = this.configurationManager.getCurrentTime().currentTimeMillis;
        switch (eventName) {
            case "touch":
                this.handleTouch(now);
                break;
            case "stop":
                if (now - this.gameStartTime > 0)
                    this.finishCallback(false);
                break;
        }
    };
    ReflexMiniGame.prototype.handleTouch = function (currentTime) {
        if (currentTime > this.dancingTime) {
            this.progress -= this.touches;
            this.actionManager.vibrate(250);
            this.touches--;
        }
        else {
            this.touches++;
            this.progress += this.touches;
        }
        if (this.progress <= 0)
            this.finishCallback(false);
        else if (this.progress >= 100)
            this.finishCallback(true);
        this.currentDrawable = "breathing.png";
    };
    return ReflexMiniGame;
}(MiniGame));
var CatchMiniGame = (function (_super) {
    __extends(CatchMiniGame, _super);
    function CatchMiniGame(handler, resourceHelper, finishCallback) {
        var _this = _super.call(this) || this;
        _this.menuManager = handler.getMenuManager();
        _this.actionManager = handler.getActionManager();
        _this.characterManager = handler.getCharacterManager();
        _this.configurationManager = handler.getConfigurationManager();
        _this.resourceHelper = resourceHelper;
        _this.finishCallback = finishCallback;
        return _this;
    }
    CatchMiniGame.prototype.onStart = function (currentTime) {
        this.lastDecreaseTime = currentTime;
        this.touches = 1;
        this.progress = 50;
        this.difficulty = Math.random() * 100;
        var difficultyTrimmed = this.difficulty.toString().substring(0, 4);
        this.actionManager.draw("laughing-ha.png", this.configurationManager.getMaximalResizeRatio(), false);
        this.actionManager.showMessage("This is a catch game! i will walk around the screen, and you will need to catch me :D "
            + "\nOnce the progress bar in the menu will reach 100%, you will win! but if it reaches 0%... i will win! :D"
            + "\nThe phone will vibrate everytime you do it incorrectly"
            + "\nDifficulty: " + difficultyTrimmed, "#6599FF", "#ffffff", 10000);
        this.menuManager.setProperty("progress", "maxprogress", "100");
        this.menuManager.setProperty("progress", "progress", this.progress.toString());
        this.startTime = currentTime;
        this.gameStartTime = this.startTime + 10000;
    };
    CatchMiniGame.prototype.onTick = function (currentTime) {
        if (currentTime > this.gameStartTime) {
            this.updateProgress(currentTime);
            this.moveToRandomLocation(currentTime);
            this.drawRandomImage(currentTime);
        }
        else {
            this.lastDecreaseTime = currentTime;
            this.touches = 1;
        }
    };
    CatchMiniGame.prototype.updateProgress = function (currentTime) {
        var ongoingTime = currentTime - this.lastDecreaseTime;
        if (ongoingTime > 1000) {
            this.progress = this.progress - 1 - this.difficulty / 100;
            this.lastDecreaseTime = currentTime;
        }
        if (this.progress <= 0) {
            this.finishCallback(false);
        }
        if (this.progress < 20)
            this.menuManager.setProperty("progress", "frontcolor", "#EC2027");
        else if (this.progress < 60)
            this.menuManager.setProperty("progress", "frontcolor", "#E59400");
        this.menuManager.setProperty("progress", "Progress", this.progress.toString());
    };
    CatchMiniGame.prototype.moveToRandomLocation = function (currentTime) {
        var randomMove = Math.floor(Math.random() * this.difficulty * 60) - Math.floor(Math.random() * this.difficulty * 60);
        this.actionManager.move(randomMove, randomMove, 250);
    };
    CatchMiniGame.prototype.drawRandomImage = function (currentTime) {
        if (currentTime - this.lastDrawTime < 5000)
            return;
        this.lastDrawTime = currentTime;
        var randomImage = this.resourceHelper.chooseRandomImage("fun");
        if (randomImage != null)
            this.actionManager.draw(randomImage, this.configurationManager.getMaximalResizeRatio(), false);
    };
    CatchMiniGame.prototype.onEventOccured = function (eventName) {
        var now = this.configurationManager.getCurrentTime().currentTimeMillis;
        switch (eventName) {
            case "touch":
                this.handleTouch(now);
                break;
            case "stop":
                if (now - this.gameStartTime > 0)
                    this.finishCallback(false);
                break;
        }
    };
    CatchMiniGame.prototype.handleTouch = function (currentTime) {
        this.touches++;
        this.progress += this.touches;
        if (this.progress <= 0)
            this.finishCallback(false);
        else if (this.progress >= 100)
            this.finishCallback(true);
    };
    return CatchMiniGame;
}(MiniGame));
//# sourceMappingURL=MiniGame.js.map
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var PirateState = (function () {
    function PirateState(switchContext) {
        this.switchContext = switchContext;
        this.wordsEvaluator = new WordsEvaluator();
    }
    Object.defineProperty(PirateState, "WALK_TIME", {
        get: function () { return 1000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "SLEEPING", {
        get: function () { return "sleeping"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "PASSIVE", {
        get: function () { return "passive"; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PirateState, "ACTIVE", {
        get: function () { return "active"; },
        enumerable: true,
        configurable: true
    });
    ;
    PirateState.prototype.onStart = function (handler) {
        var _this = this;
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
        this.timerTrigger = new TimerTriggerSystem(function () { return _this.configurationManager.getCurrentTime().currentTimeMillis; });
    };
    PirateState.prototype.walkRandomally = function () {
        var screenWidth = this.configurationManager.getScreenWidth();
        var currentX = this.characterManager.getCurrentCharacterXPosition();
        var distanceToMove = Math.abs(currentX - screenWidth);
        var category = AgentConstants.ON_FALLING_RIGHT;
        this.walking = true;
        if (this.shouldEventHappen(0.5) && distanceToMove > screenWidth / 4) {
            this.actionManager.move(distanceToMove / 3, 0, PirateState.WALK_TIME);
        }
        else {
            this.actionManager.move(-distanceToMove / 3, 0, PirateState.WALK_TIME);
            category = AgentConstants.ON_FALLING_LEFT;
        }
        this.drawAndPlayRandomResourceByCategory(category);
    };
    PirateState.prototype.shouldEventHappen = function (chance) {
        return Math.random() < chance;
    };
    PirateState.prototype.drawAndPlayRandomResourceByCategory = function (category) {
        if (this.playingMiniGame)
            return;
        if (category != this.categoryOnScreen) {
            var resToDraw = this.resourceManagerHelper.chooseRandomImage(category);
            this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
            this.categoryOnScreen = category;
        }
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound(category);
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    return PirateState;
}());
var PassiveSubstate;
(function (PassiveSubstate) {
    PassiveSubstate[PassiveSubstate["LookingAround"] = 0] = "LookingAround";
    PassiveSubstate[PassiveSubstate["Eating"] = 1] = "Eating";
    PassiveSubstate[PassiveSubstate["Drinking"] = 2] = "Drinking";
    PassiveSubstate[PassiveSubstate["Reading"] = 3] = "Reading";
    PassiveSubstate[PassiveSubstate["DoingSomethingStupid"] = 4] = "DoingSomethingStupid";
    PassiveSubstate[PassiveSubstate["RespondsToEvents"] = 5] = "RespondsToEvents";
    PassiveSubstate[PassiveSubstate["AskingForInteraction"] = 6] = "AskingForInteraction";
    PassiveSubstate[PassiveSubstate["WalkingAround"] = 7] = "WalkingAround";
})(PassiveSubstate || (PassiveSubstate = {}));
var PassiveState = (function (_super) {
    __extends(PassiveState, _super);
    function PassiveState(switchContext) {
        var _this = _super.call(this, switchContext) || this;
        _this.playingMiniGame = false;
        return _this;
    }
    Object.defineProperty(PassiveState, "LOOKING_AROUND_CHANGE", {
        get: function () { return 0.1; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "CHANCE_SWITCH_TO_FUN", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "CHANGE_PASSIVE_STATE", {
        get: function () { return 0.2; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "EATING_TIME", {
        get: function () { return 10000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "READING_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "HAVING_FUN_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "ASKING_FOR_INTERACTION_TIME", {
        get: function () { return 15000; },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(PassiveState, "DOING_SOMETHING_STUPID_TIME", {
        get: function () { return 20000; },
        enumerable: true,
        configurable: true
    });
    ;
    PassiveState.prototype.initializeState = function () {
    };
    PassiveState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
        this.lastPlayGameClick = 0;
        this.currentState = PassiveSubstate.LookingAround;
        this.playerWinMessages = ["Very well done! but i'll win next time! for sure :D", "Argh! this is the last time that you win!",
            "What?!? how did you win?! you CHEATER!", "Nice job! you are really good at this :D", "Wooooot, you won this one!, nice! "];
        this.playerLoseMessages = ["Ahahaha, i won!", "You really thought you could win? ehehehe", "Phew, it was close! keep on training!",
            "That was fun! because i won :D", "You really expected a different outcome??"];
        this.cryingMessages = ["Why are you calling me by names? :(", "Why are you so mean? :'(", "Please stop saying that :(",
            "Stop it! please!", ":'("];
    };
    PassiveState.prototype.onTick = function (time) {
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
    };
    PassiveState.prototype.lookingAroundTick = function (time) {
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
    };
    PassiveState.prototype.lookingAroundEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("lookingAround");
    };
    PassiveState.prototype.eatingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("eating")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.eatingEmote(time);
    };
    PassiveState.prototype.eatingEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("eating");
    };
    PassiveState.prototype.drinkingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("drinking")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.drinkingEmote(time);
    };
    PassiveState.prototype.drinkingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("drinking");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("drinking");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    PassiveState.prototype.readingTick = function (time) {
        if (!this.timerTrigger.isOnGoing("reading")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.readingEmote(time);
    };
    PassiveState.prototype.readingEmote = function (time) {
        var resToDraw = this.resourceManagerHelper.chooseRandomImage("reading");
        this.actionManager.draw(resToDraw, this.configurationManager.getMaximalResizeRatio(), false);
        var soundToPlay = this.resourceManagerHelper.chooseRandomSound("reading");
        if (!this.configurationManager.isSoundPlaying())
            this.actionManager.playSound(soundToPlay, false);
    };
    PassiveState.prototype.askingForInteractionTick = function (time) {
        if (!this.timerTrigger.isOnGoing("askingForInteraction")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.askingForInteractionEmote(time);
    };
    PassiveState.prototype.askingForInteractionEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("askingForInteraction");
    };
    PassiveState.prototype.doingSomethingStupidTick = function (time) {
        if (!this.timerTrigger.isOnGoing("doingSomethingStupid")) {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
        this.doingSomethingStupidEmote(time);
    };
    PassiveState.prototype.doingSomethingStupidEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("doingSomethingStupid");
    };
    PassiveState.prototype.respondsToEventsTick = function (time) {
    };
    PassiveState.prototype.walkingAroundTick = function (time) {
        if (!this.timerTrigger.isOnGoing("walkingAround")) {
            this.actionManager.stopSound();
            this.walking = false;
            this.currentState = PassiveSubstate.LookingAround;
            return;
        }
    };
    PassiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    PassiveState.prototype.onPhoneEventOccurred = function (eventName) {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.switchToFunState();
        }
    };
    PassiveState.prototype.switchToFunState = function () {
        this.timerTrigger.set("fun", PassiveState.HAVING_FUN_TIME);
        this.actionManager.stopSound();
        this.switchContext.switchTo(PirateState.ACTIVE);
    };
    PassiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    PassiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    PassiveState.prototype.onPick = function (currentX, currentY) {
        if (this.playingMiniGame) {
            this.miniGame.onEventOccured("touch");
        }
        else {
            this.actionManager.stopSound();
            this.currentState = PassiveSubstate.LookingAround;
        }
    };
    PassiveState.prototype.onMenuItemSelected = function (itemName) {
        switch (itemName) {
            case "speakButton":
                if (!this.speechToTextManager.isSpeechRecognitionAvailable() || this.playingMiniGame)
                    return;
                this.speechToTextManager.stopSpeechRecognition();
                this.speechToTextManager.startSpeechRecognition();
                break;
            case "playButton":
                if (this.playingMiniGame) {
                    this.miniGame.onEventOccured("stop");
                }
                else {
                    var now = this.configurationManager.getCurrentTime().currentTimeMillis;
                    if (now - this.lastPlayGameClick < 2000)
                        return;
                    this.lastPlayGameClick = now;
                    this.playRandomMiniGame(now);
                }
                break;
        }
    };
    PassiveState.prototype.onResponseReceived = function (response) {
    };
    PassiveState.prototype.onLocationReceived = function (location) {
    };
    PassiveState.prototype.onUserActivityStateReceived = function (state) {
    };
    PassiveState.prototype.onHeadphoneStateReceived = function (state) {
    };
    PassiveState.prototype.onWeatherReceived = function (weather) {
    };
    PassiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    PassiveState.prototype.onSpeechRecognitionResults = function (results) {
        if (this.playingMiniGame)
            return;
        results = results.toLocaleLowerCase();
        var speechResults = "speech results";
        var realResults = results.substring(results.indexOf(speechResults) + speechResults.length);
        if (this.wordsEvaluator.containsBadWord(results)) {
            this.actionManager.stopSound();
            this.actionManager.showMessage(this.cryingMessages[Math.floor(Math.random() * 4)], "#000000", "#aaaaaa", 2000);
            this.currentState = PassiveSubstate.AskingForInteraction;
            this.timerTrigger.set("askingForInteraction", PassiveState.ASKING_FOR_INTERACTION_TIME);
        }
    };
    PassiveState.prototype.onPlacesReceived = function (places) { };
    PassiveState.prototype.playRandomMiniGame = function (currentTime) {
        var _this = this;
        if (this.playingMiniGame)
            return;
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
        var randomNumber = Math.random() * 100;
        if (randomNumber <= 30) {
            this.miniGame = new HideAndSeekMiniGame(this.managersHandler, function (playerWon) {
                _this.actionManager.animateAlpha(1, 200);
                _this.miniGameOver(playerWon);
            });
        }
        else if (randomNumber <= 60) {
            this.miniGame = new CatchMiniGame(this.managersHandler, this.resourceManagerHelper, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        else {
            this.miniGame = new ReflexMiniGame(this.managersHandler, function (playerWon) {
                _this.miniGameOver(playerWon);
            });
        }
        this.miniGame.onStart(this.configurationManager.getCurrentTime().currentTimeMillis);
    };
    PassiveState.prototype.miniGameOver = function (playerWon) {
        this.actionManager.move(-this.configurationManager.getScreenWidth(), this.configurationManager.getScreenHeight(), 20);
        this.playingMiniGame = false;
        var messageIndex = Math.floor(Math.random() * 4);
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
    };
    PassiveState.prototype.onUserEventOccurred = function (eventName, jsonedData) {
    };
    return PassiveState;
}(PirateState));
var SleepingSubstate;
(function (SleepingSubstate) {
    SleepingSubstate[SleepingSubstate["Normal"] = 0] = "Normal";
    SleepingSubstate[SleepingSubstate["Nap"] = 1] = "Nap";
    SleepingSubstate[SleepingSubstate["Angry"] = 2] = "Angry";
})(SleepingSubstate || (SleepingSubstate = {}));
var SleepingState = (function (_super) {
    __extends(SleepingState, _super);
    function SleepingState(switchContext) {
        return _super.call(this, switchContext) || this;
    }
    Object.defineProperty(SleepingState, "ANNOYED_TO_NORMAL_TIME", {
        get: function () { return 5000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "SNORE_TO_NORMAL_TIME", {
        get: function () { return 5000; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "ANNOYED_EMOTE_CHANCE", {
        get: function () { return 0.25; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "NORMAL_TO_SNORE_CHANCE", {
        get: function () { return 0.0027; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SleepingState, "SNORE_TO_SLEEP_WALK_CHANCE", {
        get: function () { return 0.001; },
        enumerable: true,
        configurable: true
    });
    SleepingState.prototype.initializeState = function () {
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onTick = function (time) {
        var now = this.configurationManager.getCurrentTime();
        if (now.Hour < 22 && now.Hour > 8) {
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
    };
    SleepingState.prototype.normalTick = function (time) {
        if (!this.configurationManager.isSoundPlaying()) {
            this.normalEmote(time);
        }
        if (this.shouldEventHappen(0.25)) {
            this.actionManager.stopSound();
            this.timerTrigger.set("sleep_nap", SleepingState.SNORE_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Nap;
        }
    };
    SleepingState.prototype.normalEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("sleeping-normal");
    };
    SleepingState.prototype.napTick = function (time) {
        if (!this.timerTrigger.isOnGoing("sleep_nap")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.napEmote(time);
    };
    SleepingState.prototype.napEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("sleeping-nap");
    };
    SleepingState.prototype.angryTick = function (time) {
        if (!this.timerTrigger.isOnGoing("angry")) {
            this.actionManager.stopSound();
            this.currentState = SleepingSubstate.Normal;
            return;
        }
        this.angryEmote(time);
    };
    SleepingState.prototype.angryEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("angry");
    };
    SleepingState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    SleepingState.prototype.onPhoneEventOccurred = function (eventName) {
        if (eventName == AgentConstants.NEW_OUTGOING_CALL ||
            eventName == AgentConstants.INCOMING_CALL ||
            eventName == AgentConstants.SMS_RECEIVED) {
            this.actionManager.stopSound();
            this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
            this.currentState = SleepingSubstate.Angry;
        }
    };
    SleepingState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    SleepingState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    SleepingState.prototype.onPick = function (currentX, currentY) {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Normal;
    };
    SleepingState.prototype.onMenuItemSelected = function (itemName) {
        this.actionManager.showMessage("Zzz Zzz Zzzzzzz", "#000000", "#ffffff", 2000);
    };
    SleepingState.prototype.onResponseReceived = function (response) {
    };
    SleepingState.prototype.onLocationReceived = function (location) {
    };
    SleepingState.prototype.onUserActivityStateReceived = function (state) {
    };
    SleepingState.prototype.onHeadphoneStateReceived = function (state) {
    };
    SleepingState.prototype.onWeatherReceived = function (weather) {
    };
    SleepingState.prototype.onConfigureMenuItems = function (menuBuilder) {
    };
    SleepingState.prototype.onSpeechRecognitionResults = function (results) {
        this.actionManager.stopSound();
        this.currentState = SleepingSubstate.Angry;
        this.timerTrigger.set("angry", SleepingState.ANNOYED_TO_NORMAL_TIME);
    };
    SleepingState.prototype.onPlacesReceived = function (places) { };
    SleepingState.prototype.onUserEventOccurred = function (eventName, jsonedData) {
    };
    return SleepingState;
}(PirateState));
var ActiveSubstate;
(function (ActiveSubstate) {
    ActiveSubstate[ActiveSubstate["Fun"] = 0] = "Fun";
})(ActiveSubstate || (ActiveSubstate = {}));
var ActiveState = (function (_super) {
    __extends(ActiveState, _super);
    function ActiveState(switchContext) {
        return _super.call(this, switchContext) || this;
    }
    ActiveState.prototype.initializeState = function () {
        this.currentState = ActiveSubstate.Fun;
    };
    ActiveState.prototype.onTick = function (time) {
        switch (this.currentState) {
            case ActiveSubstate.Fun:
                this.onFunTick(time);
                break;
        }
    };
    ActiveState.prototype.onFunTick = function (time) {
        if (!this.timerTrigger.isOnGoing("fun")) {
            this.switchContext.switchTo(PirateState.PASSIVE);
            this.actionManager.stopSound();
            return;
        }
        this.funEmote(time);
    };
    ActiveState.prototype.funEmote = function (time) {
        this.drawAndPlayRandomResourceByCategory("fun");
    };
    ActiveState.prototype.onBackgroundTick = function (time) {
        this.onTick(time);
    };
    ActiveState.prototype.onStart = function (handler) {
        _super.prototype.onStart.call(this, handler);
    };
    ActiveState.prototype.onPhoneEventOccurred = function (eventName) {
    };
    ActiveState.prototype.onMove = function (oldX, oldY, newX, newY) {
    };
    ActiveState.prototype.onRelease = function (currentX, currentY) {
        var screenHeight = this.configurationManager.getScreenHeight();
        if (currentY < screenHeight - 50)
            this.actionManager.move(0, screenHeight, 0);
    };
    ActiveState.prototype.onPick = function (currentX, currentY) {
    };
    ActiveState.prototype.onMenuItemSelected = function (itemName) {
    };
    ActiveState.prototype.onResponseReceived = function (response) {
    };
    ActiveState.prototype.onLocationReceived = function (location) {
    };
    ActiveState.prototype.onUserActivityStateReceived = function (state) {
    };
    ActiveState.prototype.onHeadphoneStateReceived = function (state) {
    };
    ActiveState.prototype.onWeatherReceived = function (weather) {
    };
    ActiveState.prototype.onConfigureMenuItems = function (menuBuilder) { };
    ActiveState.prototype.onSpeechRecognitionResults = function (results) { };
    ActiveState.prototype.onPlacesReceived = function (places) { };
    ActiveState.prototype.onUserEventOccurred = function (eventName, jsonedData) {
    };
    return ActiveState;
}(PirateState));
//# sourceMappingURL=PirateState.js.map