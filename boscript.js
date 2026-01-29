let cachedData = { content: "", filename: "" };

// ---------------------------
// HARD-CODED BASE PAN (10 chars)
const BASE_PAN = "ABCDE1234Q";

function getPanFromBase(basePan, offset) {
  if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(basePan)) basePan = "ABCDE0000A";
  const prefix = basePan.substring(0, 5);
  const startNum = parseInt(basePan.substring(5, 9), 10);
  const startSuffix = basePan.charCodeAt(9) - 65;
  const total = startNum + offset;
  const carry = Math.floor(total / 10000);
  const newNum = total % 10000;
  const newSuffix = String.fromCharCode(65 + (startSuffix + carry) % 26);
  return prefix + String(newNum).padStart(4, '0') + newSuffix;
}

// ---------------------------
// Generate unique client names like TEST + random alphabets
function generateUniqueClientNames(count) {
    const names = new Set();

    while (names.size < count) {
        // Random 5-letter alphabet string
        let randomStr = '';
        for (let i = 0; i < 5; i++) {
            randomStr += String.fromCharCode(65 + Math.floor(Math.random() * 26));
        }
        names.add("TEST " + randomStr);
    }

    return Array.from(names);
}

// ---------------------------
// Generate file content for a given type
function generateContent(type, baseCode, count) {
  const date = new Date().toISOString().split("T")[0].replace(/-/g, "");
  if (!baseCode || isNaN(count) || count < 1) return null;

  const prefix = baseCode.replace(/[0-9]/g, '');
  const startNum = parseInt(baseCode.replace(/\D/g, ''), 10);
  let header = '', filename = '', rows = [];

  // Generate unique names for clients
  let clientNames = [];
  if (type === 'client') {
    clientNames = generateUniqueClientNames(count);
  }

  for (let i = 0; i < count; i++) {
    const num = startNum + i;
    const code = `${prefix }${num}`;
    const pan = getPanFromBase(BASE_PAN, i);

    switch(type) {
      case 'client':
        header = `RUPEE|CLT|${date}`;
        filename = 'client.txt';
        const clientName = clientNames[i];
        rows.push(`${code}|${clientName}|${code}|HO|123456||iuy@gm.com|Borivali||||1234567890||||2|${pan}|NI|1234567890|560016|AXISBANK LTD.|Mumbai|A||N|||Y|E|||Y|07/07/1985|||R16|||||7|||`);
        break;

      case 'bank':
        header = `RUPEE|CBM|${date}`;
        filename = 'Bank_Update.txt';
        rows.push(`01|${code}|HDFC|1234567890|DEFAULT|HDFC0001234|`);
        break;

      case 'product':
        header = `RUPEE|PROD_ALW|${date}`;
        filename = 'Product_Allowed.txt';
        rows.push(`${code}|${code}|MIS|NRML|CNC|CO|BO`);
        break;

      case 'exchange':
        header = `RUPEE|EXCH_ALW|${date}`;
        filename = 'Segment_Allowed.txt';
        [["NSE","111111111111"],["BSEEQ","1111111111111"],["CDS","111111111111"],
         ["NSEFO","111111111111"],["BCR","1111111111111"],["BSEFO","1111111111111"],
         ["MCX","111111111111"],["NSEMF","111111111111"],["BSEMF","1111111111111"],
         ["NCDX","111111111111"],["BSECOM","1111111111111"]]
        .forEach(([ex,loc])=>rows.push(`${code}||${ex}|||${loc}`));
        break;

      case 'limit':
        header = `RUPEE|CAP_LMT|${date}`;
        filename = 'CAP_Limit.txt';
        rows.push(`${code}|2000000|||||||||||||||||||||||||||||||||||||||||||`);
        break;

      case 'incr_limit':
        header = `RUPEE|INCR_CAP_LMT|${date}`;
        filename = 'Incr_CAP_Limit.txt';
        rows.push(`${code}|3000|||||||||||||||||||||||||||||||||||||||||||`);
        break;

      case 'comlimit':
        header = `RUPEE|COM_LMT|${date}`;
        filename = 'COM_Limit.txt';
        rows.push(`${code}|4000000|||||||||||||||||||||||||||||||||||||||||||`);
        break;

      case 'incr_comlimit':
        header = `RUPEE|INCR_COM_LMT|${date}`;
        filename = 'Incr_COM_Limit.txt';
        rows.push(`${code}|4000|||||||||||||||||||||||||||||||||||||||||||`);
        break;

      case 'DP': case 'ben': case 'obb': case 'mtf': case 'mtf_T1':
        header = `RUPEE|${type.toUpperCase()}_HLD|${date}`;
        filename = `${type}_Holding.txt`;
        rows.push(`${code}|INE001A01036|59|0|1|59|10|500.00`);
        break;

      case 'indp': case 'inben': case 'inobb': case 'inmtf': case 'inmtf_T1':
        header = `RUPEE|${type.toUpperCase()}_HLD|${date}`;
        filename = `${type}_Holding.txt`;
        rows.push(`${code}|INE488V01015|59|0|1|59|13|513.35|`);
        break;

      case 'mtfps03':
        header = `RUPEE|${type.toUpperCase()}|${date}`;
        filename = `${type}_Position.txt`;
        rows.push(`${code}|nse_cm|SBIN|EQ|10|8000|0|0|MTF||5|4000`);
        break;

      case 'bsemtfps03':
        header = `RUPEE|${type.toUpperCase()}|${date}`;
        filename = `${type}_Position.txt`;
        rows.push(`${code}|bse_cm|500209|EQ|10|20000|0|0|MTF||5|10000`);
        break;

      case 'dealer':
        header = `RUPEE|DEALER_CREATION|${date}`;
        filename = 'Dealer_Creation.txt';
        rows.push(`D|${code}|Branch|PUNE|E|Dealer|12-05-2019|BSEEQ,NSEFNO,BSEFNO,NSECR,BSECR,NSECOM|abcde1234f|111|111|1101|101|111|111|111|1111|111|111|111|111|111|111|1111|111|111|111|111|111|111|111|AS01|AS01|AS01|AS01|AS01|AS01|AS01|AS01|AS01|AS01|AS01|11-Oct-19|11-May-20|11-May-20|11-May-20|11-May-20|11-May-20|11-May-20|11-May-20|11May-20|11-May-20|11-May-20|a|a|416606|4654584|2244256522|maharastra|abc@a.com|${code}`);
        break;

      case 'client_dealer':
        header = `RUPEE|CLIENT_DEALER|${date}`;
        filename = 'client_dealer.txt';
        rows.push(`${code}|DEALER01`);
        break;

      case 'profile':
        header = `RUPEE|CLIENT_PROFILE|${date}`;
        filename = 'Client_Profile.txt';
        rows.push(`${code}|R16|`);
        break;

      case 'restrict':
        header = `RUPEE|CLIENT_LEVEL_RESTRICT|${date}`;
        filename = 'ClientRestriction.txt';
        rows.push(`${code}|SQ_OFF|Y`);
        break;

      case 'physical':
        header = `RUPEE|PHY_BAN|${date}`;
        filename = 'Physical_expiry_block.txt';
        rows.push(`TCS,I`);
        rows.push(`SBIN,M`);
        rows.push(`RELIANCE`);
        break;
    }
  }

  return { content: `${header}\n${rows.join("\n")}`, filename };
}

// ---------------------------
// UI Handlers
function previewFile() {
  const type = document.getElementById("fileType").value;
  const base = document.getElementById("baseCode").value.trim();
  const count = parseInt(document.getElementById("recordCount").value);
  const data = generateContent(type, base, count);
  if(data){ 
    cachedData = data; 
    document.getElementById("preview").textContent = data.content; 
  }
}

function downloadFile() {
  if(!cachedData.content){ alert("Preview first."); return; }
  const blob = new Blob([cachedData.content], {type:"text/plain"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = cachedData.filename;
  document.body.appendChild(link); 
  link.click(); 
  document.body.removeChild(link);
}

function clearAll() {
  document.getElementById("baseCode").value = '';
  document.getElementById("recordCount").value = '';
  document.getElementById("preview").textContent = '';
  cachedData = { content:'', filename:'' };
}

// ---------------------------
// Download all files reliably without JSZip
async function downloadAllFiles() {
  const base = document.getElementById("baseCode").value.trim();
  const count = parseInt(document.getElementById("recordCount").value);
  if (!base || isNaN(count)) { alert("Enter valid base code and record count."); return; }

  const types = [
    "client","bank","product","exchange","limit","incr_limit","comlimit","incr_comlimit",
    "DP","ben","obb","mtf","mtf_T1","indp","inben","inobb","inmtf","inmtf_T1",
    "mtfps03","bsemtfps03","dealer","client_dealer","profile","restrict","physical"
  ];

  for (const type of types) {
    const file = generateContent(type, base, count);
    if (file) {
      const blob = new Blob([file.content], { type: "text/plain" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = file.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await new Promise(resolve => setTimeout(resolve, 200)); // prevent browser blocking
    }
  }

  alert("All files downloaded successfully!");
}
