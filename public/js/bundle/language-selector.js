class LanguageSelector {
    constructor({$el}) {
        this.$el = $el;
    }

    onChange(cb) {
        this.$el.on('change', (...args) => {
            this._val = this.$el.val();
            cb(this._val, ...args);
        });
        return this;
    }

    get value() {
        return this._val;
    }
}

export default (...args) => new LanguageSelector(...args);
