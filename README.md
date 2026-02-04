# Premier League Predictor

## Overview
Premier League Predictor is a production-style full-stack web application that uses a voting ensemble machine learning model to predict match outcomes and league standings for the current 2025-2026 English Premier League season. This project was built to explore how modern machine learning systems can be deployed using production-grade infrastructure.

Football is the world's sport, and the English Premier League is the most watched sports league in the world. In recent years, the abundance of football data and advancements in machine learning have revolutionized the use of predictive models for football outcomes. As a huge Liverpool FC fan myself, I spent several months engineering a machine learning model and building this web application to simulate the season. Spoiler alert, looks like this year will unfortunately be the year of the Gunners.

The system is designed as a distributed architecture featuring asynchronous workers, a Redis-backed job queue, and container orchestration via Kubernetes.

### Demo Video
A 3 minute demonstration video for this project can be found [here](https://www.youtube.com/watch?v=schW2kduaRI).

### Features
Here is the summary of the features found in this project:  
* Voting ensemble machine learning model
* Asynchronous simulation jobs using a Redis-backed queue and scalable worker processes
* Persistent PostgreSQL storage
* Fully containerized dev and prod services with Docker
* Production-style deployment using Kubernetes

The following table summarizes the technologies used for each component of this project:  
| Component | Key Technology |
|-|-|
| Frontend | React (TypeScript + CSS) |
| Backend | FastAPI (Python) |
| Database | PostgreSQL |
| Queue | Redis |
| Worker | Python |
| Containerization | Docker |
| Container Orchestration | Kubernetes (k3d) |

Here is a visualization of the system's architecture:
```
Browser
   ↓
Ingress
   ↓
Frontend (React)
   ↓
Backend (FastAPI)
   ↓
Redis Queue → Worker
   ↓
PostgreSQL
```

### Machine Learning Model
While this project is a solo personal project, this work builds on a previous project I worked on with 2 colleagues for university. The previous project focused on engineering the model used in this project, and more information about the model can be found at the [pl-predictor-model repository](https://github.com/luke-venk/pl-predictor-model). Our model was a voting ensemble model combining logistic regression, random forest, and XGBoost, and had a peak testing accuracy of 59% for the ternary classification (home win, draw, or away win), on par with the state-of-the-art models found in literature.

## Deployment Options
This project supports three deployment configurations. For more information about each configuration, please refer to the [Docker README](docker/README.md) and the [Kubernetes README](k8s/README.md).

### Quick Start (Recommended)
To run the program as quickly as possible, you can use the production mode of my application, in which every component is containerized. All the user needs is to have Docker on their machine:  
```bash
# Run the application in production mode.
make prod
```

You can then visit `localhost` in your browser to use the application.

### Run in Development Mode
To run the program in development mode, please follow the instructions below to set up dependencies in the [Docker README](docker/README.md#usage) and run the application:  
```bash
# Run the application in development mode.
make dev
```

You can then visit `http://localhost:5173/` in your browser to use the application.

### Run on Kubernetes
This project supports deployment to a local Kubernetes cluster using k3d, which runs k3s inside Docker. The instructions to run the application using k3d can be found in the [Kubernetes README (setup)](k8s/README.md#setup).

You can then visit `localhost` in your browser to use the application.
