

const currencies = {
    "USD": {sym:"$" ,val:1},
    "Euro": {sym:"€" ,val: 0.84},
    "Yen": {sym:"¥" ,val: 103.87},
    "Pound": {sym:"£" ,val: 0.75},
}

function CC(){
    priceElm = document.getElementById("lb-price");
    currency = currencies[document.getElementById("currency").value];
    priceElm.innerHTML = currency.sym + (priceElm.unitPrice * currency.val);
}