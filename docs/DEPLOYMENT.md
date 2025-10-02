# CI/CD Setup Guide

This guide will help you set up the complete CI/CD pipeline for the Malta Business Indexer application.

## 🌟 Deployment Options

This open source project supports two deployment approaches:

## 🔧 Workflow Configuration

The GitHub Actions workflows are **fully configurable** to support different Azure resources and deployment targets. See [WORKFLOW_CONFIGURATION.md](WORKFLOW_CONFIGURATION.md) for detailed customization options.

**Key configurable parameters:**
- Azure Resource Group name
- Container Registry name  
- Container App name
- Frontend and Backend URLs
- Docker image names

You can customize these through:
- Manual workflow triggers with custom inputs
- Editing default values in workflow files
- Using different resource names in your fork

### Quick Configuration for Your Own Resources

1. **Manual Deployment**: Use GitHub Actions tab with custom parameters
2. **Fork Customization**: Edit default values in `.github/workflows/` files
3. **Environment Variables**: Set repository secrets for authentication

## Option A: Deploy to Existing Infrastructure
- Uses existing Azure Container Registry: `<your-registry-name>`
- Uses existing Container App: `<your-container-app-name>`
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
- Container Registry: `<existing-registry-name>`
- Container App: `<existing-container-app-name>`
- Resource Group: `<existing-resource-group-name>`

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
  --name "malta-indexer-github-sp" \
  --role contributor \
  --scopes /subscriptions/your-subscription-id \
  --sdk-auth
```

Save the output JSON - you'll need it for GitHub secrets.

### 1.2 Create Resource Group (Option B only)

```bash
# Create resource group (update the name to match your configuration)
az group create --name malta-indexer-rg --location "East US"
```

### 1.3 Create Azure Container Registry (Option B only)

```bash
# Create Container Registry (update the name to match your configuration)
az acr create \
  --resource-group malta-indexer-rg \
  --name maltaindexeracr \
  --sku Basic \
  --admin-enabled true

# Get registry credentials
az acr credential show --name maltaindexeracr
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
   - For Option A: `<existing-registry-name>`
   - For Option B: `maltaindexeracr`

3. **REGISTRY_PASSWORD**
   - For Option A: Contact project maintainer for credentials
   - For Option B: Get from `az acr credential show --name maltaindexeracr`

## Step 3: Initial Infrastructure Deployment (Option B Only)

If you chose Option B, deploy the infrastructure manually once before the CI/CD pipeline can work:

```bash
# Update the parameters in infra/main.bicepparam first
# Deploy infrastructure
az deployment group create \
  --resource-group malta-indexer-rg \
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
- `MAPS_SERVICE=openstreetmap`
- `DEBUG=False`

### Frontend Environment Variables (set in workflows)
- `REACT_APP_ENVIRONMENT=github-pages`
- `REACT_APP_BACKEND_URL=https://<your-backend-url>.azurecontainerapps.io`
- `REACT_APP_MAPS_SERVICE=openstreetmap`

> **Note**: No API keys are required as the application uses OpenStreetMap for all mapping and store discovery functionality.

## Step 6: Manual Deployment

All deployments are manual to ensure control and verification before going live.

### 6.1 Trigger Deployment

**Manual Only**: Go to GitHub Actions tab and click "Run workflow"

Available workflows:
- **Full Stack Deployment**: Deploys both backend and frontend together
- **Deploy Backend to Azure Container Apps**: Backend only
- **Deploy Frontend to GitHub Pages**: Frontend only

### 6.2 Monitor Deployment

1. Check GitHub Actions for build status
2. Monitor Azure Container Apps deployment
3. Verify GitHub Pages deployment

### 6.3 Access Your Application

- **Frontend**: https://yourusername.github.io/Malta-Business-Indexer
- **Backend**: https://your-backend-app.azurecontainerapps.io
- **API Health**: https://your-backend-app.azurecontainerapps.io/health

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
az containerapp show --name your-backend-app --resource-group malta-indexer-rg

# View Container App logs
az containerapp logs show --name your-backend-app --resource-group malta-indexer-rg

# Check ACR repositories
az acr repository list --name maltaindexeracr

# Test backend health
curl https://your-backend-app.azurecontainerapps.io/health
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