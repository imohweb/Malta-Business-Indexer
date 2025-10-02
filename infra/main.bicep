// Main infrastructure deployment for Malta Business Indexer
// Deploys Azure Container Registry and Container Apps for the FastAPI backend

@description('The location for all resources')
param location string = resourceGroup().location

@description('The name prefix for all resources')
param namePrefix string = 'malta-biz'

@description('Environment name (dev, staging, prod)')
param environment string = 'dev'

@description('Container image tag')
param imageTag string = 'latest'

// Variables for consistent naming
var resourceNamePrefix = '${namePrefix}-${environment}'
var containerRegistryName = replace('${resourceNamePrefix}-acr', '-', '')
var containerAppName = '${resourceNamePrefix}-backend'
var managedEnvironmentName = '${resourceNamePrefix}-env'
var logAnalyticsWorkspaceName = '${resourceNamePrefix}-logs'

// Log Analytics Workspace for Container Apps monitoring
resource logAnalyticsWorkspace 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: logAnalyticsWorkspaceName
  location: location
  properties: {
    sku: {
      name: 'PerGB2018'
    }
    retentionInDays: 30
    features: {
      enableLogAccessUsingOnlyResourcePermissions: true
    }
  }
}

// Azure Container Registry for storing container images
resource containerRegistry 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: containerRegistryName
  location: location
  sku: {
    name: 'Basic'
  }
  properties: {
    adminUserEnabled: true
    policies: {
      quarantinePolicy: {
        status: 'disabled'
      }
      trustPolicy: {
        type: 'Notary'
        status: 'disabled'
      }
      retentionPolicy: {
        days: 7
        status: 'enabled'
      }
    }
    encryption: {
      status: 'disabled'
    }
    dataEndpointEnabled: false
    publicNetworkAccess: 'Enabled'
    networkRuleBypassOptions: 'AzureServices'
    zoneRedundancy: 'Disabled'
  }
}

// Container Apps Managed Environment
resource managedEnvironment 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: managedEnvironmentName
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logAnalyticsWorkspace.properties.customerId
        sharedKey: logAnalyticsWorkspace.listKeys().primarySharedKey
      }
    }
    zoneRedundant: false
  }
}

// FastAPI Backend Container App
resource backendContainerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  properties: {
    environmentId: managedEnvironment.id
    configuration: {
      secrets: [
        {
          name: 'registry-password'
          value: containerRegistry.listCredentials().passwords[0].value
        }
      ]
      registries: [
        {
          server: containerRegistry.properties.loginServer
          username: containerRegistry.name
          passwordSecretRef: 'registry-password'
        }
      ]
      ingress: {
        external: true
        targetPort: 5000
        allowInsecure: false
        traffic: [
          {
            weight: 100
            latestRevision: true
          }
        ]
      }
    }
    template: {
      containers: [
        {
          name: 'backend'
          image: '${containerRegistry.properties.loginServer}/malta-business-indexer-backend:${imageTag}'
          resources: {
            cpu: json('0.5')
            memory: '1Gi'
          }
          env: [
            {
              name: 'PORT'
              value: '5000'
            }
            {
              name: 'ENVIRONMENT'
              value: environment
            }
          ]
        }
      ]
      scale: {
        minReplicas: 1
        maxReplicas: 3
        rules: [
          {
            name: 'http-rule'
            http: {
              metadata: {
                concurrentRequests: '10'
              }
            }
          }
        ]
      }
    }
  }
}

// Outputs for use in CI/CD pipeline
@description('The login server of the Azure Container Registry')
output containerRegistryLoginServer string = containerRegistry.properties.loginServer

@description('The name of the Azure Container Registry')
output containerRegistryName string = containerRegistry.name

@description('The name of the Container App')
output containerAppName string = backendContainerApp.name

@description('The FQDN of the Container App')
output containerAppFqdn string = backendContainerApp.properties.configuration.ingress.fqdn

@description('The URL of the backend API')
output backendUrl string = 'https://${backendContainerApp.properties.configuration.ingress.fqdn}'

@description('The resource group name')
output resourceGroupName string = resourceGroup().name
