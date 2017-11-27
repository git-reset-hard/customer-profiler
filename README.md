# Yelp-alitics Customer Profiler

Generates customer profile/restaurant preferences based on user check-ins, and reviews. This is a microservice intended to integrate with the entire [Yelp-alitics system](https://github.com/git-reset-hard).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Architecture Information](#architecture-information)
    1. [Roadmap](#roadmap)

## Usage

#### Setup
Create a MongoDB database to hold customer profiler data with the following collections: users; restaurants; reviews; check-ins; clicks; queries.

#### Data Generation
To run this in isolation from other microservices, simulated data needs to be generated. Create a set of simulated historical data using the following steps:

1. Generate simulated restaurants, users, and user clicks, reviews, check-ins, and queries by running the scripts that end in Generator.js in the dataGeneration folder. This will add a JSON file for each collection in a MongoDB-friendly format to the data folder.

1. Import each generated file into MongoDB using the following command:

```mongoimport --db YOUR_DB_NAME --collection YOUR_COLLECTION --drop --file YOUR_FILE_PATH/data/FILENAME --jsonArray```

#### Streaming Simulated Data
To simulate the flow of data into the system, run dataGeneration/streamData.js

#### Streaming Data
This service accepts data via Amazon Web Services SQS. The `sqs` folder contains the scripts that need to be running in order to receive messages from other services. 

## Requirements

- Node 6.11.1
- MongoDB 3.4

## Installing Dependencies
Install dependencies with ```npm install```

## Architecture Information

[Architecture diagram](https://drive.google.com/file/d/0B9cmTzZi_cK_VGNyejlVay1UQ0E/view?usp=sharing)

[Schema](https://drive.google.com/file/d/0B9cmTzZi_cK_WVVEOVhSaHRqZWM/view?usp=sharing)

## Roadmap

View the project roadmap [here](https://docs.google.com/spreadsheets/d/1KmNzdBwZN6pfllJ3b-JZxu4imRT7uQpOzQDzl5VosUI/edit?usp=sharing)
