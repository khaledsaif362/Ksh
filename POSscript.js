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
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,STO,,PNB,31-07-2025,31-07-2025,24000,CE,8000,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,STO,,PNB,31-07-2025,31-07-2025,24100,CE,8000,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,STO,,PNB,31-07-2025,31-07-2025,24200,CE,8000,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,IDO,,NIFTY,31-07-2025,31-07-2025,24300,CE,75,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,STF,,PNB,31-07-2025,31-07-2025,24200,CE,8000,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,004,IDF,,NIFTY,31-07-2025,31-07-2025,24300,CE,75,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,STO,,PNB,31-07-2025,31-07-2025,24000,CE,8000,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,STO,,PNB,31-07-2025,31-07-2025,24100,CE,8000,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,STO,,PNB,31-07-2025,31-07-2025,24200,CE,8000,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,IDO,,NIFTY,31-07-2025,31-07-2025,24300,CE,75,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,STF,,PNB,31-07-2025,31-07-2025,24200,CE,8000,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
FO,NCL,21-03-2025,21-03-2025,1,6538,6538,C,003,IDF,,NIFTY,31-07-2025,31-07-2025,24300,CE,75,0,0,0,0,0,0,8000,80000,0,0,0,0,0,0,0,0,0,0,10,,0,0,0,0,,,,,
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

