# Kubernetes

## Overview
Kubernetes is used in this project to orchestrate my containerized application across distributed infrastructure and keep the software running. Specifically, k3d is used to deploy a local Kubernetes cluster inside Docker.

## Setup
```bash
# Install (macOS)
brew install k3d kubectl

# Create a cluster (expose HTTP so Ingress can work).
k3d cluster create plp  -p "80:80@loadbalancer" --k3s-arg "--disable=traefik@server:0"

# Install NGINX ingress controller.
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/main/deploy/static/provider/cloud/deploy.yaml

# Build and import backend and frontend images.
docker build -t pl-predictor-backend:dev -f backend/Dockerfile .
k3d image import pl-predictor-backend:dev -c plp

docker build -t pl-predictor-frontend:dev ./frontend
k3d image import pl-predictor-frontend:dev -c plp

# Apply Kubernetes manifests.
kubectl apply -k k8s/base
```

After that, you can access the website by visiting `localhost` in your browser.
