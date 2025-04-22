### Hello! 
### My name is **Raphael Forward** and this is my submission for the **receipt processor challenge**

## Overview
    This service implements the routes found in api.yml

### `POST /receipts/process`
    -Accepts a JSON formatted receipt
    -Validates the input
    -Returns a receipt ID
### `GET /receipts/{id}/points`
    --Accepts a JSON formatted id
    --Returns the total points of the receipt

    Keep in mind all data is stored in memory,
    therefore when you restart the service it will be lost

## Steps to run
### Step 1:
    In the challenge's root directory run:

    ```bash
    docker build -t receipt-processor-challenge .
    ```


### Step 2:
    Start the service by running:

    ```bash
    docker run -p 3000:3000 receipt-processor-challenge
    ``` 

    Now you can access the api through localhost:3000


### Step 3:
    Test the API

    Submit a receipt:

    ```bash
    curl -X POST http://localhost:3000/receipts/process \
    -H "Content-Type: application/json" \
    --data-raw "{
        \"retailer\": \"Target\",
        \"purchaseDate\": \"2022-01-01\",
        \"purchaseTime\": \"13:01\",
        \"items\": [
        { \"shortDescription\": \"Mountain Dew 12PK\", \"price\": \"6.49\" },
        { \"shortDescription\": \"Emils Cheese Pizza\", \"price\": \"12.25\" },
        { \"shortDescription\": \"Knorr Creamy Chicken\", \"price\": \"1.26\" },
        { \"shortDescription\": \"Doritos Nacho Cheese\", \"price\": \"3.35\" },
        { \"shortDescription\": \"   Klarbrunn 12-PK 12 FL OZ  \", \"price\": \"12.00\" }
        ],
        \"total\": \"35.35\"
    }"
    ```


### Step 4
    Now use the ID from the previous request

    ```bash
    curl http://localhost:3000/receipts/{id}/points
    ``` 