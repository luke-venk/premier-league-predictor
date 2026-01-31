# Docker

## Overview
Docker is used in this project to containerize the application's services. Two configurations are provided:  
- **Development Mode**: Optimized for rapid development and debugging
- **Production Mode**: Fully containerized deployment

## Development Mode
Development mode is intended for local development and debugging. In this mode, some services are run locally to enable faster iteration and hot reloading.

### Services
| Dockerized | Locally Ran |
|-|-|
| PostgreSQL Database | FastAPI Backend |
| Redis Queue | Vite Frontend |
| Worker | |

### Usage
To spin up the application in *dev* mode, run the following command:  
`make dev-up` or `make` (default Makefile command)  

To bring down the application in *dev* mode, stop the application (^C), and run the following command:  
`make dev-down`  

To bring down the application in *dev* mode and clear the database, stop the application (^C), and run the following command:  
`make dev-reset`  

## Production Mode
Production mode runs all services inside Docker containers, providing a self-contained deployment environment which closely mirrors a real production setup.

### Services
All of the following services are containerized:
* FastAPI Backend
* Vite Frontend
* PostgreSQL Database
* Redis Queue
* Worker

### Usage
To spin up the application in *prod* mode, run the following command:  
`make prod-up`  

To bring down the application in *prod* mode, stop the application (^C), and run the following command:  
`make prod-down`  

To bring down the application in *prod* mode and clear the database, stop the application (^C), and run the following command:  
`make prod-reset`  