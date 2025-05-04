document.addEventListener("DOMContentLoaded", (function() {
    // ## START MODIFICA: Aggiunte costanti e variabili per font ##
    const MIN_FONT_SIZE = 10;
    const MAX_FONT_SIZE = 20;
    const DEFAULT_FONT_SIZE = 14;
    const FONT_SIZE_STEP = 1;
    const HISTORY_FONT_SIZE_KEY = 'calculatorHistoryFontSize';
    // ## END MODIFICA ##

    const t = {
        HISTORY_ITEM: "history-item",
        HISTORY_ITEM_CURRENT: "history-item-current",
        HISTORY_EDIT_ITEM: "history-item-edit",
        HISTORY_ITEM_CONTENT: "history-item-content",
        HISTORY_VALUE_CONTAINER: "history-value-container",
        HISTORY_OPERATOR_CONTAINER: "history-operator-container",
        HISTORY_ITEM_ACTIONS: "history-item-actions",
        HISTORY_ACTION_BTN: "history-action-btn",
        HISTORY_DELETE_BTN: "history-delete-btn",
        HISTORY_INSERT_BTN: "history-insert-btn",
        HISTORY_BUTTONS_CONTAINER: "history-buttons-container",
        HISTORY_ITEM_VALUE: "history-item-value",
        HISTORY_ITEM_OPERATOR: "history-item-operator",
        HISTORY_EDIT_INPUT: "history-edit-input",
        HISTORY_EDIT_OPERATOR: "history-edit-operator",
        HISTORY_EDIT_CONFIRM: "history-edit-confirm",
        HISTORY_EDIT_CANCEL: "history-edit-cancel",
        RESULT_ITEM: "result-item",
        RESULT_VALUE: "result-value"
    }, e = ["+", "-", "*", "/"], i = document.getElementById("calculator-body"), s = document.getElementById("history"), a = document.getElementById("history-display"), r = document.getElementById("current-calculation"), n = document.getElementById("result"), l = document.getElementById("decimal-places"), o = document.querySelectorAll(".number"), c = {
        add: document.getElementById("add"),
        subtract: document.getElementById("subtract"),
        multiply: document.getElementById("multiply"),
        divide: document.getElementById("divide")
    }, h = document.getElementById("percent"), u = document.getElementById("equals"), d = document.getElementById("decimal"), p = document.getElementById("clear"), y = document.getElementById("backspace"), E = document.getElementById("theme-toggle"),
    // ## START MODIFICA: Riferimenti nuovi bottoni, rimossi m e I ##
    fontDecreaseButton = document.getElementById("font-decrease"), // Nuovo riferimento
    fontIncreaseButton = document.getElementById("font-increase"); // Nuovo riferimento
    // m = document.getElementById("deg"), // Rimosso
    // I = document.getElementById("rad"); // Rimosso
    // ## END MODIFICA ##

    if (!r || !n || !l) return; // Controllo elementi essenziali

    // ## START MODIFICA: Controllo aggiuntivo per nuovi bottoni ##
    if (!fontDecreaseButton || !fontIncreaseButton) {
      console.error("Font size buttons not found!");
      // Potresti voler bloccare l'esecuzione o continuare senza questa funzionalità
      // return; // Scommenta se vuoi bloccare se i bottoni mancano
    }
    // ## END MODIFICA ##

    const N = new class {
        constructor(e, i, s, a, r) {
            this.historyElDesktop = e, this.historyElMobile = i, this.currentCalcEl = s, this.resultEl = a, this.decimalPlacesInputEl = r, this.classNames = t, this.currentInput = "0", this.calculationHistory = [], this.isResultDisplayed = !1, this.lastResultValue = null, this.waitingForOperand = !1, this.editingHistoryIndex = -1, this.decimalPlaces = 2,
            // ## START MODIFICA: Aggiunta proprietà font size ##
            this.historyFontSize = DEFAULT_FONT_SIZE,
            // ## END MODIFICA ##
            this._init()
        }
        _init() {
            const t = parseInt(this.decimalPlacesInputEl.value) || 2;
            this.decimalPlaces = Math.max(0, Math.min(10, t)), this.decimalPlacesInputEl.value = this.decimalPlaces, this.decimalPlacesInputEl.addEventListener("change", (t => {
                const e = parseInt(t.target.value);
                !isNaN(e) && e >= 0 && e <= 10 ? (this.decimalPlaces = e, this.calculationHistory.length > 0 && this._updateStateAfterHistoryChange(), this.updateDisplay()) : t.target.value = this.decimalPlaces
            })),
            // ## START MODIFICA: Inizializzazione font size ##
            (() => { // Blocco IIFE per isolare
                const savedFontSize = localStorage.getItem(HISTORY_FONT_SIZE_KEY);
                if (savedFontSize) {
                    const parsedSize = parseInt(savedFontSize);
                    if (!isNaN(parsedSize) && parsedSize >= MIN_FONT_SIZE && parsedSize <= MAX_FONT_SIZE) {
                        this.historyFontSize = parsedSize;
                    }
                }
                this._applyHistoryFontSize(); // Applica all'avvio
                this._updateFontSizeButtonsState(); // Imposta stato bottoni
            })(),
            // ## END MODIFICA ##
            this.updateDisplay()
        }
        // ## START MODIFICA: Nuove funzioni per font size ##
        _applyHistoryFontSize() {
             document.documentElement.style.setProperty('--history-font-size', `${this.historyFontSize}px`);
             localStorage.setItem(HISTORY_FONT_SIZE_KEY, this.historyFontSize);
        }
        _updateFontSizeButtonsState() {
            if (fontDecreaseButton) { // Controlla esistenza bottone
                 fontDecreaseButton.disabled = this.historyFontSize <= MIN_FONT_SIZE;
            }
            if (fontIncreaseButton) { // Controlla esistenza bottone
                 fontIncreaseButton.disabled = this.historyFontSize >= MAX_FONT_SIZE;
            }
        }
        // ## END MODIFICA ##

        formatNumber(t, e = !1) {
            const i = parseFloat(t);
            if (isNaN(i)) return "string" != typeof t || "nan" !== t.toLowerCase() && "error" !== t.toLowerCase() ? "0" === t || "" === t ? (0).toFixed(this.decimalPlaces) : "string" == typeof t && t.endsWith(".") ? t : "-" === t ? "-" : String(t) : t;
            if (Object.is(i, -0)) return (0).toFixed(this.decimalPlaces);
            const s = e ? 12 : this.decimalPlaces,
                a = Math.pow(10, s),
                r = Math.round(i * a + 1e-9) / a;
            return e ? String(r) : r.toFixed(this.decimalPlaces)
        }
        formatDisplayNumber(t) {
            return "string" != typeof t || "nan" !== t.toLowerCase() && "error" !== t.toLowerCase() ? "-" === t ? "-" : "string" == typeof t && t.includes(".") && t.endsWith(".") ? t : this.formatNumber(t, !1) : t
        }
        _createElement(t, e = "", i = "") {
            const s = document.createElement(t);
            return e && e.split(" ").forEach((t => {
                t && s.classList.add(t)
            })), i && (s.textContent = i), s
        }
        _renderHistory() {
            [this.historyElDesktop, this.historyElMobile].filter((t => t)).forEach((t => {
                if (!t) return;
                t.innerHTML = "";
                let i = !1;
                if (this.calculationHistory.forEach(((s, a) => {
                        if (i) return void(i = !1);
                        let r;
                        if (this.editingHistoryIndex === a) r = this._createHistoryEditElement(s, a), t.appendChild(r);
                        else if (r = this._createHistoryViewElement(s, a), t.appendChild(r), "=" === s.operator) {
                            const s = this._calculateHistoryUpToIndex(a);
                            if (isNaN(s)) t.appendChild(this._createResultElement("Error"));
                            else {
                                const r = this.calculationHistory[a + 1];
                                let n = null;
                                const l = this.formatNumber(s, !0);
                                r && "Error" !== r.value && "Error" !== l && Math.abs(parseFloat(r.value) - parseFloat(l)) < 1e-9 && e.includes(r.operator) && (n = r.operator, i = !0);
                                const o = this._createResultElement(s, n);
                                t.appendChild(o)
                            }
                        }
                    })), !(-1 !== this.editingHistoryIndex || this.waitingForOperand || this.isResultDisplayed || "0" === this.currentInput && 0 !== this.calculationHistory.length)) {
                    const i = this.calculationHistory[this.calculationHistory.length - 1];
                    if ("0" !== this.currentInput || !i || !e.includes(i.operator)) {
                        const e = this._createCurrentInputElement(this.currentInput);
                        t.appendChild(e)
                    }
                }
                null !== t.offsetParent && (t.scrollTop = t.scrollHeight)
            }))
        }
        _createHistoryViewElement(t, e) {
            const i = this._createElement("div", this.classNames.HISTORY_ITEM);
            i.dataset.index = e;
            const s = this._createElement("div", this.classNames.HISTORY_ITEM_ACTIONS),
                a = this._createElement("button", `${this.classNames.HISTORY_ACTION_BTN} ${this.classNames.HISTORY_INSERT_BTN}`, "+");
            a.title = "Inserisci Riga Sotto", a.addEventListener("click", (t => {
                t.stopPropagation(), this.insertHistoryItemBelow(e)
            })), s.appendChild(a);
            const r = this._createElement("button", `${this.classNames.HISTORY_ACTION_BTN} ${this.classNames.HISTORY_DELETE_BTN}`, "✕");
            r.title = "Elimina Riga", r.addEventListener("click", (t => {
                t.stopPropagation(), this.deleteHistoryItem(e)
            })), s.appendChild(r), i.appendChild(s);
            const n = this._createElement("div", this.classNames.HISTORY_ITEM_CONTENT),
                l = this._createElement("div", this.classNames.HISTORY_VALUE_CONTAINER),
                o = this._createElement("span", this.classNames.HISTORY_ITEM_VALUE, this.formatDisplayNumber(t.value));
            l.appendChild(o), n.appendChild(l);
            const c = this._createElement("div", this.classNames.HISTORY_OPERATOR_CONTAINER);
            if (t.operator) {
                const e = this._createElement("span", this.classNames.HISTORY_ITEM_OPERATOR, t.operator);
                c.appendChild(e)
            }
            return n.appendChild(c), i.appendChild(n), -1 === this.editingHistoryIndex ? i.addEventListener("click", (() => this.startHistoryEdit(e))) : i.style.cursor = "default", i
        }
        _createCurrentInputElement(t) {
            const e = this._createElement("div", `${this.classNames.HISTORY_ITEM} ${this.classNames.HISTORY_ITEM_CURRENT}`);
            e.style.cursor = "default";
            const i = this._createElement("div", this.classNames.HISTORY_VALUE_CONTAINER),
                s = this._createElement("span", this.classNames.HISTORY_ITEM_VALUE);
            s.textContent = this.formatDisplayNumber(t), i.appendChild(s), e.appendChild(i);
            const a = this._createElement("div", this.classNames.HISTORY_OPERATOR_CONTAINER);
            return e.appendChild(a), e
        }
        _createHistoryEditElement(t, i) {
            const s = this._createElement("div", `${this.classNames.HISTORY_ITEM} ${this.classNames.HISTORY_EDIT_ITEM}`);
            s.dataset.index = i;
            const a = this._createElement("div", "history-edit-container"),
                r = this._createElement("div", this.classNames.HISTORY_VALUE_CONTAINER),
                n = this._createElement("input", this.classNames.HISTORY_EDIT_INPUT);
            n.type = "text", n.value = t.value, n.id = `history-value-${i}`, r.appendChild(n), a.appendChild(r);
            const l = this._createElement("div", this.classNames.HISTORY_OPERATOR_CONTAINER),
                o = this._createElement("select", this.classNames.HISTORY_EDIT_OPERATOR);
            o.id = `history-operator-${i}`;
            [null, ...e, "="].forEach((e => {
                const i = this._createElement("option", "", null === e ? "" : e);
                i.value = null === e ? "" : e, e === t.operator && (i.selected = !0), o.appendChild(i)
            })), l.appendChild(o), a.appendChild(l);
            const c = this._createElement("div", this.classNames.HISTORY_BUTTONS_CONTAINER),
                h = this._createElement("button", this.classNames.HISTORY_EDIT_CONFIRM, "✓"),
                u = this._createElement("button", this.classNames.HISTORY_EDIT_CANCEL, "✕");
            h.addEventListener("click", (() => {
                this.saveHistoryEdit(i, n.value, "" === o.value ? null : o.value)
            })), u.addEventListener("click", (() => {
                this.cancelHistoryEdit()
            })), c.appendChild(h), c.appendChild(u), a.appendChild(c), s.appendChild(a), setTimeout((() => n.focus()), 0);
            const d = t => {
                "Enter" === t.key ? (t.preventDefault(), this.saveHistoryEdit(i, n.value, "" === o.value ? null : o.value)) : "Escape" === t.key && this.cancelHistoryEdit()
            };
            return n.addEventListener("keydown", d), o.addEventListener("keydown", d), s
        }
        _createResultElement(t, e = null) {
            const i = this._createElement("div", `${this.classNames.RESULT_ITEM}`);
            i.style.cursor = "default";
            const s = this._createElement("div", this.classNames.HISTORY_VALUE_CONTAINER),
                a = this._createElement("span", `${this.classNames.HISTORY_ITEM_VALUE} ${this.classNames.RESULT_VALUE}`);
            a.textContent = "string" == typeof t && "error" === t.toLowerCase() ? t : this.formatNumber(t), s.appendChild(a), i.appendChild(s);
            const r = this._createElement("div", this.classNames.HISTORY_OPERATOR_CONTAINER);
            if (e) {
                const t = this._createElement("span", this.classNames.HISTORY_ITEM_OPERATOR, e);
                r.appendChild(t)
            }
            return i.appendChild(r), i
        }
        startHistoryEdit(t) {
            -1 === this.editingHistoryIndex && t >= 0 && t < this.calculationHistory.length && (this.editingHistoryIndex = t, this.updateDisplay())
        }
        saveHistoryEdit(t, i, s) {
            let a, r = i.trim(),
                n = !1;
            if (r.endsWith("%")) {
                n = !0;
                const e = r.slice(0, -1).trim(),
                    i = parseFloat(e);
                if (isNaN(i)) return void this.cancelHistoryEdit();
                if (a = this._calculatePercentValue(String(i), t), isNaN(a)) return void this.cancelHistoryEdit()
            } else a = parseFloat(r);
            const l = null === s || "=" === s || e.includes(s);
            if (isNaN(a) || !l) return void this.cancelHistoryEdit();
            if (t < 0 || t >= this.calculationHistory.length) return void this.cancelHistoryEdit();
            const o = this.calculationHistory[t].operator,
                c = this.formatNumber(a, !0);
            this.calculationHistory[t] = {
                value: c,
                operator: s
            };
            if (s !== o && ("=" === s || null === s)) this.calculationHistory = this.calculationHistory.slice(0, t + 1);
            else
                for (let e = t + 1; e < this.calculationHistory.length; e++) {
                    const t = this.calculationHistory[e - 1];
                    if (t && "=" === t.operator) {
                        const t = this._calculateHistoryUpToIndex(e - 1);
                        isNaN(t) ? this.calculationHistory[e].value = "Error" : this.calculationHistory[e].value = this.formatNumber(t, !0)
                    }
                }
            this.editingHistoryIndex = -1, this._updateStateAfterHistoryChange(), this.updateDisplay()
        }
        cancelHistoryEdit() {
            -1 !== this.editingHistoryIndex && (this.editingHistoryIndex = -1, this.updateDisplay())
        }
        deleteHistoryItem(t) {
            -1 === this.editingHistoryIndex && t >= 0 && t < this.calculationHistory.length && (this.calculationHistory.splice(t, 1), this.isResultDisplayed && t === this.calculationHistory.length && (this.isResultDisplayed = !1, this.lastResultValue = null, this.currentInput = "0"), this._updateStateAfterHistoryChange(), this.updateDisplay())
        }
        insertHistoryItemBelow(t) {
            if (-1 !== this.editingHistoryIndex) return;
            const e = {
                    value: "0",
                    operator: "+"
                },
                i = t + 1;
            i >= 0 && i <= this.calculationHistory.length && (this.calculationHistory.splice(i, 0, e), this.startHistoryEdit(i))
        }
        _calculateHistoryUpToIndex(t) {
            let e = 0,
                i = null;
            for (let s = 0; s <= t && !(s >= this.calculationHistory.length); s++) {
                const t = this.calculationHistory[s],
                    a = parseFloat(t.value);
                if (isNaN(a)) return NaN;
                if (0 === s) e = a;
                else if (i) {
                    const t = this._performCalculation(e, a, i);
                    if (isNaN(t)) return NaN;
                    e = parseFloat(this.formatNumber(t, !0))
                } else e = a;
                i = t.operator && "=" !== t.operator ? t.operator : null
            }
            return e
        }
        _updateStateAfterHistoryChange() {
            const t = this.calculationHistory[this.calculationHistory.length - 1];
            if (!t) return this.currentInput = "0", this.isResultDisplayed = !1, this.lastResultValue = null, void(this.waitingForOperand = !1);
            const i = this._calculateHistoryUpToIndex(this.calculationHistory.length - 1);
            this.lastResultValue = isNaN(i) ? null : i, "=" === t.operator ? (this.currentInput = isNaN(i) ? "Error" : String(i), this.isResultDisplayed = !0, this.waitingForOperand = !1) : e.includes(t.operator) ? (this.currentInput = isNaN(i) ? "Error" : String(i), this.isResultDisplayed = !1, this.waitingForOperand = !0) : (this.currentInput = t.value, this.isResultDisplayed = !1, this.waitingForOperand = !1)
        }
        _performCalculation(t, e, i) {
            const s = parseFloat(t),
                a = parseFloat(e);
            if (isNaN(s) || isNaN(a)) return NaN;
            switch (i) {
                case "+":
                    return s + a;
                case "-":
                    return s - a;
                case "*":
                    return s * a;
                case "/":
                    return 0 === a ? NaN : s / a;
                default:
                    return NaN
            }
        }
        handleOperator(t) {
            if (-1 !== this.editingHistoryIndex) return;
            if ("error" === this.currentInput.toLowerCase()) return;
            if (this.isResultDisplayed) {
                if (null === this.lastResultValue || isNaN(this.lastResultValue)) return;
                const e = this.formatNumber(this.lastResultValue, !0);
                return this.calculationHistory.push({
                    value: e,
                    operator: t
                }), this.isResultDisplayed = !1, this.waitingForOperand = !0, this.currentInput = e, void this.updateDisplay()
            }
            if (this.waitingForOperand && this.calculationHistory.length > 0) {
                const e = this.calculationHistory[this.calculationHistory.length - 1];
                if (e && e.operator && "=" !== e.operator) return this.calculationHistory[this.calculationHistory.length - 1].operator = t, this._updateStateAfterHistoryChange(), void this.updateDisplay()
            }
            const e = this.currentInput;
            if (isNaN(parseFloat(e))) return;
            const i = this.calculationHistory.length - 1;
            i >= 0 && null === this.calculationHistory[i].operator ? this.calculationHistory[i].operator = t : this.calculationHistory.push({
                value: this.formatNumber(e, !0),
                operator: t
            }), this._updateStateAfterHistoryChange(), this.updateDisplay()
        }
        inputDigit(t) {
            if (-1 === this.editingHistoryIndex) {
                if (this.isResultDisplayed) return this.currentInput = t, this.isResultDisplayed = !1, this.waitingForOperand = !1, void this.updateDisplay();
                this.waitingForOperand ? (this.currentInput = t, this.waitingForOperand = !1) : "0" === this.currentInput ? this.currentInput = t : "-0" === this.currentInput ? this.currentInput = "-" + t : this.currentInput += t, this.updateDisplay()
            }
        }
        inputDecimal() {
            if (-1 === this.editingHistoryIndex) {
                if (this.isResultDisplayed) return this.currentInput = "0.", this.isResultDisplayed = !1, this.waitingForOperand = !1, void this.updateDisplay();
                this.waitingForOperand ? (this.currentInput = "0.", this.waitingForOperand = !1) : this.currentInput.includes(".") || ("-" === this.currentInput ? this.currentInput += "0." : this.currentInput += "."), this.updateDisplay()
            }
        }
        handleEquals() {
            if (-1 !== this.editingHistoryIndex) {
                const t = document.getElementById(`history-value-${this.editingHistoryIndex}`),
                    e = document.getElementById(`history-operator-${this.editingHistoryIndex}`);
                return void(t && e ? this.saveHistoryEdit(this.editingHistoryIndex, t.value, "" === e.value ? null : e.value) : this.cancelHistoryEdit())
            }
            if ("error" === this.currentInput.toLowerCase() || this.waitingForOperand || this.isResultDisplayed) return;
            const t = this.currentInput;
            if (isNaN(parseFloat(t))) return;
            const i = this.formatNumber(t, !0);
            if (0 === this.calculationHistory.length) this.calculationHistory.push({
                value: i,
                operator: "="
            });
            else {
                const t = this.calculationHistory[this.calculationHistory.length - 1];
                null === t.operator ? (t.operator = "=", t.value = i) : this.calculationHistory.push({
                    value: i,
                    operator: "="
                })
            }
            this._updateStateAfterHistoryChange(), this.updateDisplay()
        }
        handlePercent() {
            if (-1 !== this.editingHistoryIndex || this.isResultDisplayed || this.waitingForOperand) return;
            if ("-" === this.currentInput) return;
            const t = this._calculatePercentValue(this.currentInput);
            isNaN(t) ? (this.currentInput = "Error", this.waitingForOperand = !1, this.isResultDisplayed = !1) : (this.currentInput = this.formatNumber(t, !0), this.waitingForOperand = !1, this.isResultDisplayed = !1), this.updateDisplay()
        }
        clearAll() {
            -1 !== this.editingHistoryIndex && this.cancelHistoryEdit(), this.currentInput = "0", this.calculationHistory = [], this.isResultDisplayed = !1, this.lastResultValue = null, this.waitingForOperand = !1, this.editingHistoryIndex = -1, this.updateDisplay()
        }
        clearLastChar() {
            this.isResultDisplayed || this.waitingForOperand || -1 === this.editingHistoryIndex && (this.currentInput.length > 1 && "Error" !== this.currentInput && "NaN" !== this.currentInput ? (this.currentInput = this.currentInput.slice(0, -1), "-" === this.currentInput && (this.currentInput = "0")) : this.currentInput = "0", this.updateDisplay())
        }
        updateDisplay() {
            this.currentCalcEl.textContent = this.formatDisplayNumber(this.currentInput);
            const t = this.isResultDisplayed && null !== this.lastResultValue && !isNaN(this.lastResultValue) ? `=${this.formatDisplayNumber(String(this.lastResultValue))}` : "=0";
            this.resultEl.textContent = t, this._renderHistory()
        }
        attachEventListeners() {
            o.forEach((t => {
                t.addEventListener("click", (() => this.inputDigit(t.textContent)))
            })), Object.keys(c).forEach((t => {
                const e = c[t];
                let i = "";
                switch (t) {
                    case "add":
                        i = "+";
                        break;
                    case "subtract":
                        i = "-";
                        break;
                    case "multiply":
                        i = "*";
                        break;
                    case "divide":
                        i = "/";
                        break
                }
                e && i && e.addEventListener("click", (() => this.handleOperator(i)))
            })), h && h.addEventListener("click", (() => this.handlePercent())), u && u.addEventListener("click", (() => this.handleEquals())), d && d.addEventListener("click", (() => this.inputDecimal())), p && p.addEventListener("click", (() => this.clearAll())), y && y.addEventListener("click", (() => this.clearLastChar())),
            // ## START MODIFICA: Rimozione listeners m e I, aggiunta listeners nuovi bottoni ##
            /* m && I && (m.addEventListener("click", (() => { // Rimosso blocco deg/rad
                m.classList.add("active"), I.classList.remove("active")
            })), I.addEventListener("click", (() => {
                I.classList.add("active"), m.classList.remove("active")
            }))), */ // Fine blocco rimosso

            // Aggiunta listener per diminuzione font
            fontDecreaseButton && fontDecreaseButton.addEventListener("click", () => {
                const newSize = this.historyFontSize - FONT_SIZE_STEP;
                if (newSize >= MIN_FONT_SIZE) {
                    this.historyFontSize = newSize;
                    this._applyHistoryFontSize();
                    this._updateFontSizeButtonsState();
                }
            }),
            // Aggiunta listener per aumento font
            fontIncreaseButton && fontIncreaseButton.addEventListener("click", () => {
                 const newSize = this.historyFontSize + FONT_SIZE_STEP;
                 if (newSize <= MAX_FONT_SIZE) {
                     this.historyFontSize = newSize;
                     this._applyHistoryFontSize();
                     this._updateFontSizeButtonsState();
                 }
            }),
            // ## END MODIFICA ##
            document.addEventListener("keydown", (t => this.handleKeyPress(t)))
        }
        handleKeyPress(t) {
            const i = document.activeElement;
            if (i && i.matches(`.${this.classNames.HISTORY_EDIT_INPUT}`)) {
                const e = t.key;
                if ("Escape" === e) this.cancelHistoryEdit();
                else if ("Enter" === e) {
                    t.preventDefault();
                    const e = this.editingHistoryIndex,
                        s = document.getElementById(`history-operator-${e}`);
                    i && s ? this.saveHistoryEdit(e, i.value, "" === s.value ? null : s.value) : this.cancelHistoryEdit()
                } else if ("%" === e) {
                    t.preventDefault();
                    const e = i.value.trim(),
                        s = parseFloat(e);
                    if (!isNaN(s)) {
                        const t = this._calculatePercentValue(String(s), this.editingHistoryIndex);
                        isNaN(t) ? i.value = "Error" : i.value = this.formatNumber(t, !0)
                    }
                }
                return
            }
            if (i && ("INPUT" === i.tagName || "SELECT" === i.tagName)) return;
            const s = t.key;
            isNaN(parseInt(s)) ? "." === s || "," === s ? this.inputDecimal() : e.includes(s) || "-" === s ? this.handleOperator(s) : "*" === s ? this.handleOperator("*") : "/" === s ? (t.preventDefault(), this.handleOperator("/")) : "%" === s ? this.handlePercent() : "Enter" === s || "=" === s ? (t.preventDefault(), this.handleEquals()) : "Backspace" === s ? this.clearLastChar() : "Escape" === s || "Delete" === s ? this.clearAll() : "c" === s.toLowerCase() && (t.preventDefault(), this.clearAll()) : this.inputDigit(s)
        }
        _calculatePercentValue(t, i = -1) {
            const s = parseFloat(t);
            if (isNaN(s)) return NaN;
            let a = NaN;
            const r = this.calculationHistory,
                n = i >= 0 ? i - 1 : r.length - 1;
            if (n >= 0 && n < r.length) {
                const t = r[n];
                if (t && e.includes(t.operator)) {
                    const e = this._calculateHistoryUpToIndex(n),
                        i = t.operator;
                    isNaN(e) || (a = "+" === i || "-" === i ? e * (s / 100) : s / 100)
                } else a = s / 100
            } else a = s / 100;
            return a
        }
    }(s, a, r, n, l); // Passaggio degli elementi al costruttore

    function H(t) { // Funzione Theme
        "dark" === t ? (i.classList.add("dark-theme"), localStorage.setItem("calculatorTheme", "dark")) : (i.classList.remove("dark-theme"), localStorage.setItem("calculatorTheme", "light"))
    }
    N.attachEventListeners(); // Attacca gli event listeners (inclusi i nuovi)
    H(localStorage.getItem("calculatorTheme") || "light"), E && E.addEventListener("click", (() => { // Listener per il tema
        H("dark" === (i.classList.contains("dark-theme") ? "dark" : "light") ? "light" : "dark")
    }))
}));