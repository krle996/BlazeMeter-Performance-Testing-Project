# BlazeMeter-Performance-Testing-Project

## Overview
Performance test project simulating concurrent users completing the flight 
purchase flow on [BlazeDemo](https://blazedemo.com) — a public demo site 
provided by BlazeMeter for practicing test automation and performance testing. 
The test covers the full user journey: searching for a flight, selecting a 
flight, and completing the purchase with passenger and payment details.

## Tools Used
- Apache JMeter
- BlazeMeter Chrome Extension (script recording)

## Test Scenario
1. Navigate to BlazeDemo homepage
2. Search for available flights
3. Select a flight
4. Complete purchase (enter passenger/payment details)
5. Confirm purchase

## Load Configuration
- Number of users (threads): 300
- Ramp-up period: 5 minutes
- Loop count: 1

## Results Summary
- Total requests: 8400
- Error rate: 0.00%
- Average response time: 532.88 ms
- 90th percentile response time: 1028.90 ms

Full HTML report available [here](https://github.com/krle996/BlazeMeter-Performance-Testing-Project/blob/main/reports/index.html).

## Files
- `test-plans/blaze_demo_project.jmx` – JMeter test plan
- `results/blaze_demo_results` – raw test results
- `reports/` – generated JMeter HTML dashboard report

## Key Takeaways
The system handled 8,400 requests with a 0% error rate under a load of 
400 concurrent users. The "Open Website" step had the highest response 
times, likely due to the larger amount of data loaded on that page. Among 
the core purchase flow steps, "Choose Flight" was the slowest, making it 
the top candidate for further performance investigation.
