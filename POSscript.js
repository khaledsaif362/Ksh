const names = [
      "Position_ICCL_FO_0_CM_6538_2025",
      "Position_ICCL_FO_0_TM_6538_2025",
      "Position_NCL_FO_0_CM_6538_2025",
      "Position_NCL_FO_0_TM_6538_2025"
    ];

    const container = document.getElementById("checkboxContainer");

names.forEach(name => {
  container.innerHTML += `
    <div class="checkbox-item">
      <input type="checkbox" class="f" id="${name}" value="${name}">
      <label for="${name}">${name}</label>
    </div>
  `;
});


    function toggleAll() {
      const isChecked = document.getElementById("all").checked;
      document.querySelectorAll(".f").forEach(cb => cb.checked = isChecked);
    }

    const rawCSV = `Sgmt,Src,RptgDt,BizDt,TradRegnOrgn,ClrMmbId,BrkrOrCtdnPtcptId,ClntTp,ClntId,FinInstrmTp,ISIN,TckrSymb,XpryDt,FininstrmActlXpryDt,StrkPric,OptnTp,NewBrdLotQty,OpngLngQty,OpngLngVal,OpngShrtQty,OpngShrtVal,OpnBuyTradgQty,OpnBuyTradgVal,OpnSellTradgQty,OpnSellTradgVal,PreExrcAssgndLngQty,PreExrcAssgndLngVal,PreExrcAssgndShrtQty,PreExrcAssgndShrtVal,ExrcdQty,AssgndQty,PstExrcAssgndLngQty,PstExrcAssgndLngVal,PstExrcAssgndShrtQty,PstExrcAssgndShrtVal,SttlmPric,RefRate,PrmAmt,DalyMrkToMktSettlmVal,FutrsFnlSttlmVal,ExrcAssgndVal,Rmks,Rsvd1,Rsvd2,Rsvd3,Rsvd4
FO,NCL,20260406,20260406,1,6538,6538,C,TEST1,STF,,SBIN,20260428,20260428,,,750,0,0,0,0,750,75000,0,0,0,0,0,0,0,0,750,75000,0,0,1000,,0,-3420,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST1,IDF,,BANKNIFTY,20260428,20260428,,,30,0,0,0,0,30,7500,0,0,0,0,0,0,0,0,30,7500,0,0,60000,,0,41880,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST1,IDO,,NIFTY,20260428,20260428,25000,CE,65,0,0,0,0,65,7500,0,0,0,0,0,0,0,0,65,7500,0,0,25000,,0,0,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST1,STO,,TCS,20260428,20260428,3000,CE,175,0,0,0,0,175,63000,0,0,0,0,0,0,0,0,175,63000,0,0,3000,,0,0,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST3,STF,,SBIN,20260428,20260428,,,750,0,0,0,0,0,0,750,75000,0,0,0,0,0,0,0,0,750,75000,1000,,0,-3420,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST3,IDF,,BANKNIFTY,20260428,20260428,,,30,0,0,0,0,0,0,30,7500,0,0,0,0,0,0,0,0,30,7500,60000,,0,41880,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST3,IDO,,NIFTY,20260428,20260428,25000,CE,65,0,0,0,0,0,0,65,7500,0,0,0,0,0,0,0,0,65,7500,25000,,0,0,0,0,,,,,
FO,NCL,20260406,20260406,1,6538,6538,C,TEST3,STO,,TCS,20260428,20260428,3000,CE,175,0,0,0,0,0,0,175,63000,0,0,0,0,0,0,0,0,175,63000,3000,,0,0,0,0,,,,,
`;



    function generate() {
      const client1 = document.getElementById("client1").value.trim();
      const client2 = document.getElementById("client2").value.trim();
      const expiryInput = document.getElementById("expiry").value;

      if (!client1 || !expiryInput) {
        alert("Please provide Client 1 and Expiry Date.");
        return;
      }

      const expiry = expiryInput.replaceAll("-", "");
      const lines = rawCSV.trim().split("\n");
const header = lines[0];
const data = lines.slice(1);
const headerFields = header.split(",");

const clntIdIdx = headerFields.indexOf("ClntId");
const xpryIdx = headerFields.indexOf("XpryDt");
const fxpryIdx = headerFields.indexOf("FininstrmActlXpryDt");
const rptgIdx = headerFields.indexOf("RptgDt");
const bizIdx = headerFields.indexOf("BizDt");
const qtyIdx = headerFields.indexOf("OpnBuyTradgQty");

const getCurrentDateFormatted = () => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}${mm}${dd}`;
};

const currentDate = getCurrentDateFormatted();


      const processedRows = [header];

      for (const row of data) {
        const cols = row.split(",");
        const qty = parseFloat(cols[qtyIdx]);
        if (qty > 0) {
          cols[clntIdIdx] = client1;
        } else if (client2) {
          cols[clntIdIdx] = client2;
        } else {
          continue;
        }

       cols[xpryIdx] = expiry;
cols[fxpryIdx] = expiry;
cols[rptgIdx] = currentDate;
cols[bizIdx] = currentDate;

        processedRows.push(cols.join(","));
      }

      const selected = [...document.querySelectorAll(".f:checked")];
      if (!selected.length) return alert("Select at least one file name.");

      selected.forEach(cb => {
        const blob = new Blob([processedRows.join("\n")], { type: "text/csv" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = cb.value + ".csv";
        a.click();
        URL.revokeObjectURL(a.href);
      });
    }

