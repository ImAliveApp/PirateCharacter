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