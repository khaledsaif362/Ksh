const BASE_PAN = "ABCDE1234Q";

let generatedFiles = {};

function generatePAN(index){

    const prefix = BASE_PAN.substring(0,5);

    const num = 1000 + index;

    const suffix = String.fromCharCode(65 + (index % 26));

    return prefix + String(num).padStart(4,'0') + suffix;
}

function getClientCodes(){

    const input = document.getElementById("clientCodes").value;

    return input
        .split("\n")
        .map(x => x.trim())
        .filter(x => x !== "");
}

function buildFiles(){

    const clientCodes = getClientCodes();

    if(clientCodes.length === 0){

        alert("Enter Client Codes");

        return null;
    }

    const date = new Date().toISOString().split("T")[0].replace(/-/g,'');

    let clientRows = [];

    let productRows = [];

    let exchangeRows = [];

    clientCodes.forEach((code,index)=>{

        const pan = generatePAN(index);

        // CLIENT FILE
        clientRows.push(
`${code}|TEST CLIENT ${index+1}|${code}|HO|123456||test@gmail.com|Mumbai|||9999999999|||||2|${pan}|NI|9999999999|400001|AXIS BANK|Mumbai|A||N|||Y|E|||Y`
        );

        // PRODUCT FILE
        productRows.push(
`${code}|${code}|MIS|NRML|CNC|CO|BO`
        );

        // EXCHANGE FILE
        const exchanges = [
            "NSE",
            "BSEEQ",
            "NSEFO",
            "CDS",
            "MCX"
        ];

        exchanges.forEach(ex => {

            exchangeRows.push(
`${code}||${ex}|||111111111111`
            );

        });

    });

    generatedFiles = {

        "Client.txt":
`RUPEE|CLT|${date}
${clientRows.join("\n")}`,

        "Product_Allowed.txt":
`RUPEE|PROD_ALW|${date}
${productRows.join("\n")}`,

        "Exchange_Allowed.txt":
`RUPEE|EXCH_ALW|${date}
${exchangeRows.join("\n")}`
    };

    return generatedFiles;
}

function previewFiles(){

    const files = buildFiles();

    if(!files) return;

    let previewText = "";

    Object.keys(files).forEach(fileName => {

        previewText += `========== ${fileName} ==========\n\n`;

        previewText += files[fileName];

        previewText += "\n\n\n";

    });

    document.getElementById("preview").textContent = previewText;
}

async function generateAllFiles(){

    const files = buildFiles();

    if(!files) return;

    for(const fileName in files){

        const blob = new Blob(
            [files[fileName]],
            {type:"text/plain"}
        );

        const link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = fileName;

        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);

        await new Promise(resolve => setTimeout(resolve,200));
    }

    alert("All Files Generated Successfully");
}

function clearAll(){

    document.getElementById("clientCodes").value = "";

    document.getElementById("preview").textContent = "";

    generatedFiles = {};
}
