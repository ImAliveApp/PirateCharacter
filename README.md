## Pirate Character:

### Main concept:
This is an actual code of a Pirate character in the app, this character responds to phone actions (events), displaying and using [character menu](https://github.com/hay12396/ImAliveGuide/wiki/The-Character-Menu) for the best user interaction and it has an implementation of a mood-state machine (the character will behave differently depending on various of variables)

### How to use:
In order to use this template, do the following steps:

1. Download and build it this project (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Build-and-upload-a-character-code) guide)

2. Upload resources to the actions that you wish to register (i.e upload image and sound resources to the POWER_CONNECTED category to attach them to this event)

3. Publish your character and see the results! (following [this](https://github.com/hay12396/ImAliveGuide/wiki/How-to:-Publish-your-character) guide)

### The code:
Most of the action responds work is done in the "onActionReceived" method:
```javascript
    onActionReceived(actionName: string, jsonedData: string): void {
        this.handler.getActionManager().showMessage(actionName);
        this.states.getValue(this.currentState).onActionReceived(actionName);
    }
```
The character menu work is done in the "onMenuItemSelected" method:
```javascript
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
```
The mood-state machine is implemented at the [Pirate state](https://github.com/hay12396/PirateProject/blob/master/PirateProject/Pirate/PirateState.ts) file.

Once an action occures, this method gets called with the actionName being the name of the action that occured, i.e in case
of the device being plugged to a power supply, this method will be called with the actionName being "POWER_CONNECTED".

If you have upload resources to the website under the "POWER_CONNECTED" category, a random image and a random sound will be picked and used
by the "drawAndPlayRandomResourceByCategory" method.

**Note**: you must [register](http://linkToActionRegisterGuide.com) to a phone action in order to be notified when it occures.
