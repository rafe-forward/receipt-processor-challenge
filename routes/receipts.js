const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const { validateReceipt, validatePartialReceipt } = require("../utils/validation");
const {calculatePoints} = require("../utils/pointCalcuation");
const processedReceipts = [];
router.post("/process", (req, res) => {
    try {
        //retrive items from req
        const { retailer, purchaseDate, purchaseTime, total, items } = req.body;

        // validation based on yml

        validateReceipt(req.body);
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
        if (error.message.includes("invalid")){
            return res.status(400).json({error: error.message})
        }
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

        //validate data retrived
        validateReceipt(result);

        //Caculate total points
        let points = calculatePoints(result);
        
        // Return sum of points
        res.json({points});

    } catch (error){
        console.error("The receipt is invalid.", error.message);
        res.status(500).json({error: error.message});
    }
})

//This route gets the receipts that match the date or retailer or both
router.get("/", (req, res) => {
    try {
      const { retailer, date } = req.query;
      let results = processedReceipts;

      if (retailer) {
        const retailerValid = typeof retailer === "string" && /^[\w\s\-&]+$/.test(retailer);
        if (!retailerValid) return res.status(400).json({ error: "Invalid retailer format." });
  
        results = results.filter(r =>
          r.retailer.toLowerCase().includes(retailer.toLowerCase())
        );
      }
  
      if (date) {
        const dateValid = !isNaN(Date.parse(date));
        if (!dateValid) return res.status(400).json({ error: "Invalid date format." });
  
        results = results.filter(r => r.purchaseDate === date);
      }
  
      res.json({ count: results.length, data: results });
    } catch (error) {
      console.error("Failed to fetch receipts.", error.message);
      res.status(500).json({ error: "Internal error." });
    }
  });

// This route deletes the receipt based on its id
router.delete("/:id", (req,res) => {
    try{
        const {id} = req.params;

        const index = processedReceipts.findIndex(r => r.id === id);
        if (index === -1) {
            return res.status(404).json({error:"Receipt not found"});
        }
        processedReceipts.splice(index,1);

        res.json(`Receipt Deleted!`);

    }
    catch{
        console.error("Internal Error", error.message);
        res.status(500).json({error: "Internal Error"});

    }
});

//This route updates a receipt given its items and the updates in the body
router.patch("/:id", (req,res) => {
    try{
        //get the index of the id in processReceipts
        const {id} = req.params;
        const index = processedReceipts.findIndex(r => r.id === id);
        if (index === -1){
            return res.status(404).json({error:"Receipt Not found"
            });
        }

        const original = processedReceipts[index];
        const updates = req.body;

        validatePartialReceipt(updates);
        
        //set the receipt updated with new values
        processedReceipts[index] = {
            ...original,
            ...updates
        };
        
        //success
        return res.json({message: "Receipt Updated successfully", data: processedReceipts[index]
        });
    } catch(error){
        console.error("Error updaing receipt: ",error.message);
        if (error.message.includes("invalid")){
            return res.status(400).json({error: error.message})
        }
        res.status(500).json({error: "Internal server error"});
    }
});


module.exports = router;