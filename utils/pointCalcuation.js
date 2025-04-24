
function calculatePoints(receipt){
    let points = 0;

    const {retailer, purchaseDate, purchaseTime, total,items} = receipt;
    // One point for every alpha numeric char in retailer name
    for (let i = 0; i < retailer.length; i++) {
        if (/[a-zA-Z0-9]/.test(retailer[i])) {
            points += 1;
        }
    }
    
    // Add 50 points if the total is a round dollar amount with no cents
    //Add 25 is the total is a multiple of 0.25 (inclusive of .00)
    const totalNum = parseFloat(total);
    const cents = Number(totalNum.toFixed(2).split(".")[1]);
    if (cents === 0) points += 50;
    if (cents % 25 === 0) points += 25;

    // Calculate trimmed length of each price description and if it is divisible by 3 then multiply
    //it by .2 and add it to the total
    items.forEach(item => {
        if (!item.shortDescription || isNaN(parseFloat(item.price))) return;

        const trimmedLength = item.shortDescription.trim().length;
        if (trimmedLength % 3 === 0) {
            points += Math.ceil(parseFloat(item.price) * 0.2);
        }
    });

    // If the day is odd then add 6 points
    let day = purchaseDate.split("-")[2];
    if(day % 2 !== 0){
        points += 6;
    }

    // If the time is between 2:01 and 3:59
    const [hour, minute] = purchaseTime.split(":").map(Number);
    const timeInMinutes = hour * 60 + minute;
    if (timeInMinutes > 14 * 60 && timeInMinutes < 16 * 60) {
        points += 10;
    }

    // Calculate the amount of pairs then add 5 for each pair
    if(items.length % 2 === 0){
        let pairs = items.length / 2;
        points += pairs * 5
    }
    else if(items.length > 2){
        let pairs = (items.length -1) /2
        points += pairs * 5
    }

    return points
}

module.exports = {
    calculatePoints
}