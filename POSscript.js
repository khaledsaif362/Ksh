/* =========================================================
   POSITION FILES - COMPLETE POSscript.js
   ========================================================= */

"use strict";


/* =========================================================
   FILE NAMES
   ========================================================= */

const fileNames = {

    FO: [
        "Position_ICCL_FO_0_CM_6538_2026",
        "Position_ICCL_FO_0_TM_6538_2026",
        "Position_NCL_FO_0_CM_6538_2026",
        "Position_NCL_FO_0_TM_6538_2026"
    ],

    MCX: [
        "Position_MCXCCL_CO_0_TM_6538_2026"
    ],

    CD: [
        "Position_NCL_CD_0_TM_6538_2026"
    ],

    NCDEX: [
        "Position_NCCL_CO_0_TM_6538_2026"
    ],

    NSECOM: [
        "Position_NCL_CO_0_TM_6538_2026"
    ]

};


/* =========================================================
   STRIKE STEPS
   ========================================================= */

const strikeSteps = {

    NIFTY: 50,
    SENSEX: 100,
    BANKEX: 100,
    TCS: 20,

    CRUDEOIL: 100,
    NATURALGAS: 5,
    COPPER: 10,
    SILVERM: 500,
    GOLD: 1000,
    GOLDM: 100,
    SILVER: 500

};


/* =========================================================
   INSTRUMENT TYPES
   ========================================================= */

const instrumentTypes = {

    FO: [
        ["STF", "Stock Future"],
        ["IDF", "Index Future"],
        ["STO", "Stock Option"],
        ["IDO", "Index Option"]
    ],

    MCX: [
        ["COF", "Commodity Future"],
        ["FUO", "Commodity Option"]
    ],

    NSECOM: [
        ["COF", "Commodity Future"],
        ["FUO", "Commodity Option"]
    ],

    NCDEX: [
        ["COF", "Commodity Future"],
        ["FUO", "Commodity Option"]
    ],

    CD: [
        ["CDF", "Currency Future"],
        ["CDO", "Currency Option"]
    ]

};


let manualRowSeq = 0;

let currentMode = "sample";


/* =========================================================
   SHORT FILE LABEL
   ========================================================= */

function shortFileLabel(name) {

    const match =
        name.match(
            /^Position_([A-Z]+)_FO_0_(CM|TM)_/
        );

    if (match) {

        return match[1] + " " + match[2];

    }

    return name;

}


/* =========================================================
   HELPER
   ========================================================= */

function el(id) {

    return document.getElementById(id);

}


/* =========================================================
   CREATE MODE RADIO BUTTONS
   =========================================================

   This is important.

   Even if old HTML contains:
       .mode-toggle
       .mode-btn

   we replace it with proper radio buttons.

   ========================================================= */

function createModeControls() {

    let existing =
        document.getElementById("modeToggle");

    if (!existing) {

        return;

    }


    existing.innerHTML = `

        <div class="position-mode-title">
            Position Mode
        </div>

        <label class="position-radio">

            <input
                type="radio"
                name="positionMode"
                id="modeSample"
                value="sample"
                checked>

            <span>Sample Positions</span>

        </label>

        <label class="position-radio">

            <input
                type="radio"
                name="positionMode"
                id="modeManual"
                value="manual">

            <span>Manual Entry</span>

        </label>

    `;


    existing.style.display = "flex";

    existing.style.alignItems = "center";

    existing.style.gap = "14px";

    existing.style.margin = "8px 0 12px";


    const styleId =
        "positionModeRuntimeStyle";


    if (!document.getElementById(styleId)) {

        const style =
            document.createElement("style");

        style.id = styleId;

        style.textContent = `

            #modeToggle {
                padding: 7px 10px;
                border: 1px solid #d5dce5;
                border-radius: 8px;
                background: #f8fafc;
                flex-wrap: wrap;
            }

            .position-mode-title {
                font-size: 12px;
                font-weight: 700;
                color: #183b63;
                margin-right: 4px;
            }

            .position-radio {
                display: inline-flex;
                align-items: center;
                gap: 5px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 600;
                color: #333;
                white-space: nowrap;
            }

            .position-radio input {
                width: 16px !important;
                height: 16px !important;
                margin: 0 !important;
                padding: 0 !important;
                cursor: pointer;
            }

            #manualSection {
                display: none;
            }

            #manualDrawer {
                display: none;
            }

            #manualDrawer.open {
                display: flex;
            }

            .expiry-disabled {
                opacity: 0.5 !important;
            }

            .expiry-disabled input,
            .expiry-disabled select {
                background: #eeeeee !important;
                color: #888 !important;
                cursor: not-allowed !important;
            }

            .manual-row {
                border: 1px solid #d6dce4;
                border-radius: 8px;
                padding: 10px;
                margin-bottom: 10px;
                background: #fafcff;
            }

            .manual-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
            }

            .manual-field {
                display: flex;
                flex-direction: column;
                flex: 1 1 100px;
                min-width: 90px;
            }

            .manual-field label {
                font-size: 10px;
                color: #555;
                margin-bottom: 3px;
                font-weight: 600;
            }

            .manual-field input,
            .manual-field select {
                width: 100% !important;
                height: 30px !important;
                font-size: 12px !important;
                padding: 3px 6px !important;
                margin: 0 !important;
                box-sizing: border-box !important;
            }

            .manual-foot {
                display: flex;
                justify-content: flex-end;
                gap: 7px;
                margin-top: 8px;
            }

            .manual-foot button {
                width: auto !important;
                height: auto !important;
                padding: 5px 10px !important;
                font-size: 11px !important;
            }

            .manual-drawer {
                position: absolute;
                inset: 0;
                z-index: 100;
                background: white;
                border-radius: 14px;
                box-shadow: 0 8px 30px rgba(0,0,0,.28);
                flex-direction: column;
                overflow: hidden;
            }

            .manual-drawer-head {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 12px;
                border-bottom: 1px solid #ddd;
            }

            .manual-drawer-head strong {
                flex: 1;
                font-size: 14px;
            }

            .manual-drawer-body {
                flex: 1;
                overflow-y: auto;
                padding: 10px 12px;
            }

            .manual-notice {
                font-size: 11px;
                color: #805000;
                background: #fff5df;
                border: 1px solid #efd29b;
                border-radius: 5px;
                padding: 6px 8px;
                margin-bottom: 10px;
            }

            .manual-section {
                display: none;
            }

        `;

        document.head.appendChild(style);

    }


    document
        .querySelectorAll(
            'input[name="positionMode"]'
        )
        .forEach(radio => {

            radio.addEventListener(
                "change",
                function () {

                    setMode(this.value);

                }
            );

        });

}


/* =========================================================
   SET MODE
   ========================================================= */

function setMode(mode) {

    currentMode = mode;


    const sample =
        el("modeSample");

    const manual =
        el("modeManual");


    if (sample) {

        sample.checked =
            mode === "sample";

    }


    if (manual) {

        manual.checked =
            mode === "manual";

    }


    const manualSection =
        el("manualSection");


    if (manualSection) {

        manualSection.style.display =
            mode === "manual"
                ? "block"
                : "none";

    }


    if (mode === "manual") {

        clearManualRows();

        setSegmentVisibility(
            el("positionType").value
        );

        openManualPanel();

    }

    else {

        clearManualRows();

        closeManualDrawer();

        setSegmentVisibility(
            el("positionType").value
        );

    }

}


/* =========================================================
   OPEN MANUAL PANEL
   ========================================================= */

function openManualPanel() {

    if (currentMode !== "manual") {

        return;

    }


    if (
        document.querySelectorAll(
            ".manual-row"
        ).length === 0
    ) {

        addManualRow();

    }

    else {

        openManualDrawer();

    }

}


/* =========================================================
   OPEN DRAWER
   ========================================================= */

function openManualDrawer() {

    const drawer =
        el("manualDrawer");

    if (!drawer) {

        return;

    }


    drawer.classList.add("open");

}


/* =========================================================
   CLOSE DRAWER
   ========================================================= */

function closeManualDrawer() {

    const drawer =
        el("manualDrawer");

    if (!drawer) {

        return;

    }


    drawer.classList.remove("open");

}


/* =========================================================
   DONE MANUAL
   ========================================================= */

function doneManualEntry() {

    const entries =
        getManualEntries();


    if (!entries.length) {

        alert(
            "Please add at least one manual scrip."
        );

        return;

    }


    closeManualDrawer();

}


/* =========================================================
   ADD MANUAL ROW
   ========================================================= */

function addManualRow() {

    const type =
        el("positionType").value;


    const container =
        el("manualContainer");


    if (!container) {

        return;

    }


    const id =
        ++manualRowSeq;


    const options =
        (instrumentTypes[type] || [])
            .map(
                item => {

                    return `
                        <option value="${item[0]}">
                            ${item[0]} — ${item[1]}
                        </option>
                    `;

                }
            )
            .join("");


    const row =
        document.createElement("div");


    row.className =
        "manual-row";


    row.id =
        "manualRow_" + id;


    row.innerHTML = `

        <div class="manual-grid">

            <div class="manual-field">

                <label>Symbol</label>

                <input
                    type="text"
                    class="m-symbol"
                    placeholder="e.g. RELIANCE">

            </div>


            <div class="manual-field">

                <label>Instrument</label>

                <select class="m-inst">

                    ${options}

                </select>

            </div>


            <div class="manual-field">

                <label>Expiry</label>

                <input
                    type="date"
                    class="m-expiry">

            </div>


            <div class="manual-field">

                <label>CE / PE</label>

                <select
                    class="m-opt"
                    disabled>

                    <option value="CE">
                        CE
                    </option>

                    <option value="PE">
                        PE
                    </option>

                </select>

            </div>


            <div class="manual-field">

                <label>Strike</label>

                <input
                    type="number"
                    class="m-strike"
                    step="any"
                    disabled>

            </div>


            <div class="manual-field">

                <label>Qty / Lot Size</label>

                <input
                    type="number"
                    class="m-lot"
                    min="1"
                    step="any"
                    value="1">

            </div>


            <div class="manual-field">

                <label>Price</label>

                <input
                    type="number"
                    class="m-price"
                    step="any"
                    value="0">

            </div>

        </div>


        <div class="manual-foot">

            <button
                type="button"
                onclick="addManualRow()">

                + Add Symbol

            </button>


            <button
                type="button"
                onclick="removeManualRow(${id})">

                Remove

            </button>

        </div>

    `;


    container.appendChild(row);


    const symbol =
        row.querySelector(".m-symbol");


    symbol.addEventListener(
        "input",
        function () {

            this.value =
                this.value.toUpperCase();

        }
    );


    row
        .querySelector(".m-inst")
        .addEventListener(
            "change",
            function () {

                syncManualRow(id);

            }
        );


    syncManualRow(id);

    openManualDrawer();

}


/* =========================================================
   SYNC MANUAL ROW
   ========================================================= */

function syncManualRow(id) {

    const row =
        el("manualRow_" + id);


    if (!row) {

        return;

    }


    const inst =
        row.querySelector(
            ".m-inst"
        ).value;


    const isOption =
        inst.endsWith("O");


    const option =
        row.querySelector(
            ".m-opt"
        );


    const strike =
        row.querySelector(
            ".m-strike"
        );


    option.disabled =
        !isOption;


    strike.disabled =
        !isOption;


    if (!isOption) {

        option.value = "CE";

        strike.value = "";

    }

}


/* =========================================================
   REMOVE MANUAL ROW
   ========================================================= */

function removeManualRow(id) {

    const row =
        el("manualRow_" + id);


    if (row) {

        row.remove();

    }

}


/* =========================================================
   CLEAR MANUAL ROWS
   ========================================================= */

function clearManualRows() {

    const container =
        el("manualContainer");


    if (container) {

        container.innerHTML = "";

    }

}


/* =========================================================
   GET MANUAL ENTRIES
   ========================================================= */

function getManualEntries() {

    const rows =
        [
            ...document.querySelectorAll(
                ".manual-row"
            )
        ];


    const entries = [];


    rows.forEach(row => {

        const symbol =
            row.querySelector(
                ".m-symbol"
            )
                .value
                .trim()
                .toUpperCase();


        if (!symbol) {

            return;

        }


        const inst =
            row.querySelector(
                ".m-inst"
            ).value;


        const isOption =
            inst.endsWith("O");


        entries.push({

            symbol: symbol,

            inst: inst,

            isOption: isOption,

            expiry:
                row.querySelector(
                    ".m-expiry"
                ).value,

            optType:
                row.querySelector(
                    ".m-opt"
                ).value,

            strike:
                row.querySelector(
                    ".m-strike"
                ).value.trim(),

            step:
                strikeSteps[symbol] || 0,

            lot:
                parseFloat(
                    row.querySelector(
                        ".m-lot"
                    ).value
                ) || 0,

            price:
                parseFloat(
                    row.querySelector(
                        ".m-price"
                    ).value
                ) || 0

        });

    });


    return entries;

}


/* =========================================================
   SEGMENT VISIBILITY
   ========================================================= */

function setSegmentVisibility(type) {

    const manual =
        currentMode === "manual";


    const commonExpiry =
        el("commonExpiryRow");


    const bseExpiry =
        el("sensexBankexExpiryRow");


    const additional =
        el("additionalStrikeRow");


    const symbolExpiry =
        el("symbolExpiryContainer");


    const nseInput =
        el("expiry");