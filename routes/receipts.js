const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const processedReceipts = [];
router.post("/process", (req, res) => {
    try {
        //retrive items from req
        const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

        // validate that the retailer is a string and conforms to /^[\w\s\-&]+$/
        const retailerValid = typeof retailer === "string" && /^[\w\s\-&]+$/.test(retailer);
        //Validate the date
        const dateValid = !isNaN(Date.parse(purchaseDate));
        
        //Split the minutes and hours, and validate
        const [hour, minute] = purchaseTime?.split(":") || [];
        const timeValid = !isNaN(hour) && !isNaN(minute);

        //Check if the total is valid
        const totalValid = typeof total === "string" && /^\d+\.\d{2}$/.test(total);

        //Check if the items array is an array and > 0
        const itemsValid = Array.isArray(items) && items.length > 0;

        //If one isnt valid, throw error
        if (!retailerValid || !dateValid || !timeValid || !totalValid || !itemsValid) {
            return res.status(400).json({ error: "The receipt is invalid." });
        }

        //Check items and make sure they conform
        for (const item of items) {
            if (
                typeof item.shortDescription !== "string" ||
                !/^[\w\s\-]+$/.test(item.shortDescription) ||
                typeof item.price !== "string" ||
                !/^\d+\.\d{2}$/.test(item.price)
            ) {
                return res.status(400).json({ error: "The receipt is invalid." });
            }
        }

        //Everything is validated so add the receipt to processed and return id

        const id = uuidv4();
        processedReceipts.push({
            id,
            retailer,
            purchaseDate,
            purchaseTime,
            total,
            items
        });

        res.json({ id });

    } catch (error) {
        console.error("The receipt is invalid.", error.message);
        res.status(500).json({ error: "Internal Error" });
    }
});


// Route takes in a receipt id then returns the points for that receipt
// If receipt not found throw 404
router.get("/:id/points", (req,res) => {
    try {
        const {id} = req.params;
        const result = processedReceipts.find(obj => obj.id === id);
        if (!result) {
            return res.status(404).json({ error: "No receipt found for that ID." });
        }

        const {retailer, purchaseDate, purchaseTime, total,items} = result;

        //validate data retrived
        const dateValid = !isNaN(Date.parse(purchaseDate));
        const timeParts = purchaseTime.split(":");
        const timeValid = timeParts.length === 2 && !isNaN(timeParts[0]) && !isNaN(timeParts[1]);
        
        if (
            !retailer ||
            !dateValid ||
            !timeValid ||
            !total || isNaN(parseFloat(total)) ||
            !Array.isArray(items) || items.length === 0
        ) {
            return res.status(400).json({ error: "No receipt found for that ID." });
        }


        let points = 0;


        // One point for every alpha numeric char in retailer name
        for (let i = 0; i < retailer.length; i++) {
            if (/[a-zA-Z0-9]/.test(retailer[i])) {
                points += 1;
            }
        }

        // Add 50 points if the total is a round dollar amount with no cents
        //Add 25 is the total is a multiple of 0.25 (inclusive of .00)
        let totalPrice = 0
        items.forEach(item => {
            totalPrice += parseFloat(item.price);
        });
        const cents = Number(totalPrice.toFixed(2).split(".")[1]);
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
        
        // Return sum of points
        res.json({points});

    } catch (error){
        console.error("No receipt found for that ID.", error.message);
        res.status(500).json({error: error.message});
    }
})

module.exports = router;

