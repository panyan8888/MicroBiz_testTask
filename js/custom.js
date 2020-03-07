
document.addEventListener('DOMContentLoaded', function(){
    let displayCurrentDate = function(split){
        const currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth()+1;
        let year = currentDate.getFullYear();

        if (day<10) day = '0' + day;
        if (month<10) month= '0' + month;
        return (day + split + month + split + year);
    };
    document.getElementById('currentDate').innerHTML= displayCurrentDate('-');
});
// RAnge for inputs
function rangeForMarkup(input) {
    if (input.value < 10) input.value = 10;
    if (input.value > 200) input.value = 200;
}
function rangeForCost(input) {
    if (input.value < 0) input.value = 1;
}
//Rules object
const RULES = {
    '95': { roundPoint: 45, priceEnding: 95 },
    '99': { roundPoint: 50, priceEnding: 99 },
    '00': { roundPoint: 40, priceEnding: 0 }
};
// check inputs and calculate results
function calc(){
    const markup = document.getElementById('markupId').value;
    const cost = document.getElementById('costId').value;
    //check empty fields
    if (markup === '' || cost === '') {
        document.getElementById('errorDiv').style.display = 'block';
        document.getElementById('error').innerHTML= 'Please fill all fields!';
        return
    }
    //display error fields
    document.getElementById('errorDiv').style.display = 'none';
    //input values
    const taxRate = document.getElementById('taxRateId').value;
    const roundingRuleName = document.getElementById('roundingRuleId').value;
    //input object
    const inputs = {
        cost,
        markup,
        taxRate,
        roundingRuleName
    };
    let results;
    const pricingModeValue = document.getElementById('pricingModeId').value;
    if (pricingModeValue === 'Tax_Inclusive') {
        results = calcTaxInclusiveMode(inputs) //cost, markup, taxRate);
    } else if (pricingModeValue === 'Tax_Exclusive') {
        results = calcTaxExclusiveMode(cost, markup, taxRate);
    }
    // display results
    if(results) {
        display(results)
    }
}
// calculate results in Tax Inclusive Mode
function calcTaxInclusiveMode(inputs) {
    // calc price
    const price = inputs.cost / (1 - (inputs.markup / 100));
    // calc and round taxInclusivePrice
    let taxInclusivePrice = price * (1 + (inputs.taxRate / 100));
    taxInclusivePrice = round(inputs.roundingRuleName, taxInclusivePrice);
    // calc taxExclusivePrice
    const taxExclusivePrice = taxInclusivePrice / (1 + (inputs.taxRate / 100));
    // calc grossProfit
    const grossProfit = taxExclusivePrice - inputs.cost;
    // calc grossProfitPercent
    const grossProfitPercent = (grossProfit / taxExclusivePrice) * 100;
    // return results
    return {
        taxExclusivePrice,
        taxInclusivePrice,
        grossProfit,
        grossProfitPercent
    }
}
// calculate results in Tax Inclusive Mode
function calcTaxExclusiveMode(cost, markup, taxRate){
    const roundingRuleName = document.getElementById('roundingRuleId').value;
    const price = cost / (1 - (markup / 100));
    const taxExclusivePrice = round(roundingRuleName, price);
    const taxInclusivePrice = price * (1 + (taxRate / 100));
    const grossProfit = taxExclusivePrice - cost;
    const grossProfitPercent = (grossProfit / taxExclusivePrice) * 100;
    return {
        taxExclusivePrice,
        taxInclusivePrice,
        grossProfit,
        grossProfitPercent
    }
}
//round function
function round(ruleName, sum) {
    // get rule
    if(RULES[ruleName] == undefined){
        ruleName = '95'
    }
    const rule = {
        roundPoint: RULES[ruleName].roundPoint / 100,
        priceEnding: RULES[ruleName].priceEnding / 100
    };
    // calc rounded sum
    const sumIntPart = parseInt(sum);
    const sumDecPart = sum - sumIntPart;
    let roundedSum = sumIntPart + rule.priceEnding;
    if(sumDecPart > rule.roundPoint){
        if(sumDecPart > rule.priceEnding){
            roundedSum++;
        }
    }else{
        if(sumDecPart < rule.priceEnding){
            roundedSum--;
        }
    }
    return roundedSum;
}
//display final results function
function display(results) {
    document.getElementById('taxInclusivePrice').innerHTML = results.taxInclusivePrice.toFixed(2);
    document.getElementById('taxExclusivePrice').innerHTML = results.taxExclusivePrice.toFixed(2);
    document.getElementById('grossProfitPercent').innerHTML = results.grossProfitPercent.toFixed(2);
    document.getElementById('grossProfitDollar').innerHTML = results.grossProfit.toFixed(2);
}
//click calculate button
document.querySelector('#calculateButton').addEventListener('click', calc);
