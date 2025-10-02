# CI/CD Setup Guide

This guide will help you set up the complete CI/CD pipeline for the Malta Business Indexer application.

## 🌟 Deployment Options

This open source project supports two deployment approaches:

### Option A: Use Existing Azure Resources (Current Production Setup)
- Uses existing Azure Container Registry: `iacstudioregistry`
- Uses existing Container App: `iac-infraengine-backend`
- Minimal setup required, just configure GitHub secrets
- Perfect for contributing to the main project

### Option B: Deploy Your Own Infrastructure (For Contributors)
- Create new Azure resources using provided Bicep templates
- Full control over your deployment environment
- Ideal for testing, development, or creating your own instance

## Prerequisites

1. **Azure Subscription**: You need an active Azure subscription
2. **GitHub Repository**: The code should be in a GitHub repository
3. **Azure CLI**: Install Azure CLI for initial setup

## Step 1: Choose Your Deployment Approach

### 🚀 Option A: Quick Setup (Use Existing Resources)

If you're contributing to the main project or want a quick setup:

1. **Fork the repository** to your GitHub account
2. **Configure GitHub Secrets** (see section below)
3. **Push to master branch** to trigger deployment

The workflows are already configured to use:
- Container Registry: `iacstudioregistry`
- Container App: `iac-infraengine-backend`
- Resource Group: `iac-infraengine-rg`

### 🏗️ Option B: Full Infrastructure Deployment

If you want to deploy your own complete infrastructure:

#### B.1 Update Workflow Configuration

Edit `.github/workflows/backend-deploy.yml` and change:

```yaml
env:
  AZURE_RESOURCE_GROUP: 'your-resource-group-name'
  CONTAINER_REGISTRY_NAME: 'yourregistryname'
  CONTAINER_APP_NAME: 'your-container-app-name'
```

#### B.2 Azure Infrastructure Setup

### 1.1 Create Service Principal for GitHub Actions

```bash
# Login to Azure
az login

# Set subscription (replace with your subscription ID)
az account set --subscription "your-subscription-id"

# Create service principal for GitHub Actions
az ad sp create-for-rbac \
  --name "your-project-name-sp" \
  --role contributor \
  --scopes /subscriptions/your-subscription-id \
  --sdk-auth
```

Save the output JSON - you'll need it for GitHub secrets.

### 1.2 Create Resource Group (Option B only)

```bash
# Create resource group (update the name to match your configuration)
az group create --name your-resource-group-name --location "East US"
```

### 1.3 Create Azure Container Registry (Option B only)

```bash
# Create Container Registry (update the name to match your configuration)
az acr create \
  --resource-group your-resource-group-name \
  --name yourregistryname \
  --sku Basic \
  --admin-enabled true

# Get registry credentials
az acr credential show --name yourregistryname
```

## Step 2: GitHub Repository Setup

### 2.1 Enable GitHub Pages

1. Go to your repository settings
2. Scroll down to "Pages" section
3. Source: Deploy from a branch
4. Branch: Select `gh-pages` (will be created by the workflow)
5. Folder: `/ (root)`

### 2.2 Configure GitHub Secrets

Go to Repository Settings > Secrets and variables > Actions, and add these secrets:

#### Required Secrets:

1. **AZURE_CREDENTIALS**
   ```json
   {
     "clientId": "your-client-id",
     "clientSecret": "your-client-secret",
     "subscriptionId": "your-subscription-id",
     "tenantId": "your-tenant-id"
   }
   ```
   (Use the output from service principal creation)

2. **REGISTRY_USERNAME**
   - For Option A: `iacstudioregistry`
   - For Option B: `yourregistryname`

3. **REGISTRY_PASSWORD**
   - For Option A: Contact project maintainer for credentials
   - For Option B: Get from `az acr credential show --name yourregistryname`

## Step 3: Initial Infrastructure Deployment (Option B Only)

If you chose Option B, deploy the infrastructure manually once before the CI/CD pipeline can work:

```bash
# Update the parameters in infra/main.bicepparam first
# Deploy infrastructure
az deployment group create \
  --resource-group your-resource-group-name \
  --template-file infra/main.bicep \
  --parameters infra/main.bicepparam
```

## Step 4: Workflow Configuration

The repository includes three GitHub Actions workflows:

### 4.1 Backend Deployment (`backend-deploy.yml`)
- Triggers on changes to `backend/` or `infra/` directories
- Builds and pushes Docker image to ACR
- Deploys to Azure Container Apps
- Runs health checks

### 4.2 Frontend Deployment (`frontend-deploy.yml`)
- Triggers on changes to `frontend/` directory
- Builds React app with production settings
- Deploys to GitHub Pages
- Configures backend API URL

### 4.3 Full Stack Deployment (`full-stack-deploy.yml`)
- Orchestrates both backend and frontend deployments
- Runs integration tests
- Can be triggered manually with custom options

## Step 5: Environment Variables

### Backend Environment Variables (set automatically in workflows)
- `PORT=5000`
- `ENVIRONMENT=production`

### Frontend Environment Variables (set in workflows)
- `REACT_APP_ENVIRONMENT=github-pages`
- `REACT_APP_BACKEND_URL=https://malta-biz-dev-backend.azurecontainerapps.io`
- `REACT_APP_MAPS_SERVICE=openstreetmap`

## Step 6: Testing the Pipeline

### 6.1 Trigger Deployment

1. **Automatic**: Push changes to the `master` branch
2. **Manual**: Go to Actions tab > Run workflow

### 6.2 Monitor Deployment

1. Check GitHub Actions for build status
2. Monitor Azure Container Apps deployment
3. Verify GitHub Pages deployment

### 6.3 Access Your Application

- **Frontend**: https://imohweb.github.io/Malta-Business-Indexer
- **Backend**: https://malta-biz-dev-backend.azurecontainerapps.io
- **API Health**: https://malta-biz-dev-backend.azurecontainerapps.io/health

## Troubleshooting

### Common Issues

1. **Service Principal Permissions**
   - Ensure the service principal has Contributor role on the subscription
   - Check Azure credentials in GitHub secrets

2. **Container Registry Access**
   - Verify ACR credentials are correct
   - Ensure admin user is enabled on ACR

3. **GitHub Pages Not Working**
   - Check if Pages is enabled in repository settings
   - Verify the `gh-pages` branch is created
   - Check build artifacts are uploaded correctly

4. **Backend Health Check Fails**
   - Check Container App logs in Azure Portal
   - Verify environment variables are set
   - Check network connectivity

### Useful Commands

```bash
# Check Container App status
az containerapp show --name malta-biz-dev-backend --resource-group malta-business-indexer-rg

# View Container App logs
az containerapp logs show --name malta-biz-dev-backend --resource-group malta-business-indexer-rg

# Check ACR repositories
az acr repository list --name maltabizdevacr

# Test backend health
curl https://malta-biz-dev-backend.azurecontainerapps.io/health
```

## Security Considerations

1. **Secrets Management**: Never commit secrets to the repository
2. **Resource Access**: Use least privilege principles for service principal
3. **Container Security**: Regularly update base images and dependencies
4. **Network Security**: Consider using private endpoints in production

## Cost Optimization

1. **Auto-scaling**: Container Apps scale to zero when not in use
2. **Resource Limits**: Set appropriate CPU and memory limits
3. **Registry Cleanup**: Implement retention policies for container images
4. **Monitoring**: Set up cost alerts in Azure

## Next Steps

1. **Custom Domain**: Configure custom domain for GitHub Pages
2. **SSL Certificate**: Set up custom SSL certificates
3. **Monitoring**: Implement Application Insights
4. **Backup**: Set up backup strategies for data
5. **Testing**: Add more comprehensive integration tests