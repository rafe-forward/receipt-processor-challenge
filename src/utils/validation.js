

function validateReceipt(receipt){
    const {retailer, purchaseDate, purchaseTime,total, items} = receipt;
    const retailerValid = typeof retailer === "string" && /^[\w\s\-&]+$/.test(retailer);
    const dateValid = !isNaN(Date.parse(purchaseDate));
    const [hour, minute] = purchaseTime?.split(":") || [];
    const timeValid = !isNaN(hour) && !isNaN(minute);
    const totalValid = typeof total === "string" && /^\d+\.\d{2}$/.test(total);

    //Check if the items array is an array and > 0
    const itemsValid = Array.isArray(items) && items.length > 0;

    //If one isn't valid, throw error
    if (!retailerValid || !dateValid || !timeValid || !totalValid || !itemsValid) {
        throw new Error("Receipt is invalid")
    }

    //Check items and make sure they conform
    for (const item of items) {
        if (
            typeof item.shortDescription !== "string" ||
            !/^[\w\s\-]+$/.test(item.shortDescription) ||
            typeof item.price !== "string" ||
            !/^\d+\.\d{2}$/.test(item.price)
        ) {
            throw new Error("Receipt is invalid")
        }
    }
}
function validatePartialReceipt(updates){
        //validate every field of the updates
        if ('retailer' in updates) {
            const valid = typeof updates.retailer === "string" && /^[\w\s\-&]+$/.test(updates.retailer);
            if (!valid) throw new Error("Retailer Format is invalid")
        }
    
        if ('purchaseDate' in updates) {
        const valid = !isNaN(Date.parse(updates.purchaseDate));
        if (!valid) throw new Error("Purchase Date is invalid")
        }
    
        if ('purchaseTime' in updates) {
        const [hour, minute] = updates.purchaseTime.split(":").map(Number);
        const valid = !isNaN(hour) && !isNaN(minute) && hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
        if (!valid) throw new Error("Purchase Time is invalid")
        }
    
        if ('total' in updates) {
        const valid = typeof updates.total === "string" && /^\d+\.\d{2}$/.test(updates.total);
        if (!valid) throw new Error("total is invalid")
        }
    
        if ('items' in updates) {
        const items = updates.items
        for (const item of items) {
            if (
                typeof item.shortDescription !== "string" ||
                !/^[\w\s\-]+$/.test(item.shortDescription) ||
                typeof item.price !== "string" ||
                !/^\d+\.\d{2}$/.test(item.price)
            ) {
                throw new Error("Items are invalid");
            }
        }
        }
}

module.exports = {
    validateReceipt,
    validatePartialReceipt
}