const { v4: uuidv4 } = require("uuid");

const express = require("express");
const router = express.Router();
const users = [{name: "Rafe Forward", points: 1000, age: 23, id: "1"}];
const transactions = [];
router.post("/addUser", (req,res) => {
    try {
        const {name, points, age} = req.body;
        const id = uuidv4();
        users.push({name: name, points: points, age: age, id: id});

        res.json({id});

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server error"})
    }
});

router.delete("/:id", (req,res) => {
    try {
        const {id} = req.params;
        const newer = parseInt(id);
        console.log(id);
        console.log(users);
        const index = users.findIndex(obj => obj.id === id);
        if (index === -1) {
            return res.status(404).json({error:"User not found"});
        }
        users.splice(index,1);

        res.json(`User with id: ${id} deleted`);

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})

router.patch("/add-points", (req,res) => {
    try {
        const {points, id} = req.body;
        const index = users.findIndex(r => r.id === id);
        if (index === -1) {
            return res.status(404).json({error:"User not found"});
        }

        users[index].points += points;

        transactions.push({id: id, 
            type:"ADD", 
            points: points, 
            timestamp: new Date().toISOString 
        })

        res.json(`Add ${points} to ${users[index].name}'s account, total is now ${users[index].points}`)
    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})
router.patch("/Spend-Points", (req,res) => {
    try{
        const {id, points} = req.body;
        const user = users.find((user) => user.id === id);
        if (Math.abs(points) > user.points){
            res.status(400).json("User does not have enough points")
        }
        user.points -= points;
        transactions.push({
            id: id,
            type: "SPEND",
            timestamp: new Date().toISOString
        })

        res.json(`User ${user.id} spent ${points} and now has  ${user.points} remaining`)
    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
    }
})
router.patch("/Change-Name/:id", (req,res) => {
    try{
    const {id} = req.params;
    const {name} = req.body;
    
    result = users.find((user) => user.id === id);
    if (!result){
        res.status(404).json({error: "User not found"});
    }
    result.name = name;
    console.log(result)
    res.json("Username Changed!");

    } catch(error){
        console.error(error);
        res.status(500).json({error: "Internal Server Error"})
    }
});
module.exports = router;