class LanguageSelector {
    constructor({$el}) {
        this.$el = $el;
    }

    onChange(cb) {
        this.$el.on('change', (...args) => cb(this.value, ...args));
        return this;
    }

    get value() {
        return this.$el.val();
    }
}

export default (...args) => new LanguageSelector(...args);
