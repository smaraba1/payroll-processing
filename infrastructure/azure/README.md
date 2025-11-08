# Azure Deployment

## Prerequisites

- Azure CLI installed and logged in
- Azure subscription
- Docker installed

## Deployment Steps

### 1. Create Resource Group

```bash
az group create --name ems-rg --location eastus
```

### 2. Deploy Infrastructure

```bash
az deployment group create \
  --resource-group ems-rg \
  --template-file main.bicep \
  --parameters \
    appName=ems-app \
    environment=dev \
    postgresAdminUsername=pgadmin \
    postgresAdminPassword='YourSecurePassword123!' \
    jwtSecret='your-256-bit-secret-key'
```

### 3. Create Container Registry

```bash
az acr create --resource-group ems-rg --name emsregistry --sku Basic
az acr login --name emsregistry
```

### 4. Build and Push Docker Images

```bash
# Build and push backend
cd backend
az acr build --registry emsregistry --image ems-backend:latest .

# Build and push frontend
cd ../frontend
az acr build --registry emsregistry --image ems-frontend:latest .
```

### 5. Configure App Services

Update the App Services to use the container registry images:

```bash
az webapp config container set \
  --name ems-app-backend-dev \
  --resource-group ems-rg \
  --docker-custom-image-name emsregistry.azurecr.io/ems-backend:latest \
  --docker-registry-server-url https://emsregistry.azurecr.io

az webapp config container set \
  --name ems-app-frontend-dev \
  --resource-group ems-rg \
  --docker-custom-image-name emsregistry.azurecr.io/ems-frontend:latest \
  --docker-registry-server-url https://emsregistry.azurecr.io
```

## Clean Up

```bash
az group delete --name ems-rg --yes
```

