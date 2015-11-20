class Editor {
    constructor({domID, theme = 'monokai'}) {
        this.domEl = $('#domEl');
        this.editor = ace.edit(domID);
        this.editor.setTheme(`ace/theme/${theme}`);
    }

    get value() {
        return this.editor.getValue();
    }

    set languageMode(mode) {
        this.editor.getSession().setMode(`ace/mode/${mode}`);
    }
}

export default (...args) => new Editor(...args);
