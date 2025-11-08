// Azure Bicep template for Employee Management System

@description('The location for all resources')
param location string = resourceGroup().location

@description('The name of the application')
param appName string = 'ems-app'

@description('Environment name')
param environment string = 'dev'

@description('PostgreSQL administrator username')
@secure()
param postgresAdminUsername string

@description('PostgreSQL administrator password')
@secure()
param postgresAdminPassword string

@description('JWT secret key')
@secure()
param jwtSecret string

// Variables
var postgresServerName = '${appName}-postgres-${environment}'
var appServicePlanName = '${appName}-plan-${environment}'
var backendAppName = '${appName}-backend-${environment}'
var frontendAppName = '${appName}-frontend-${environment}'
var databaseName = 'emsdb'

// App Service Plan
resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: appServicePlanName
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
    capacity: 1
  }
  kind: 'linux'
  properties: {
    reserved: true
  }
}

// PostgreSQL Flexible Server
resource postgresServer 'Microsoft.DBforPostgreSQL/flexibleServers@2022-12-01' = {
  name: postgresServerName
  location: location
  sku: {
    name: 'Standard_B1ms'
    tier: 'Burstable'
  }
  properties: {
    administratorLogin: postgresAdminUsername
    administratorLoginPassword: postgresAdminPassword
    version: '16'
    storage: {
      storageSizeGB: 32
    }
    backup: {
      backupRetentionDays: 7
      geoRedundantBackup: 'Disabled'
    }
    highAvailability: {
      mode: 'Disabled'
    }
  }
}

// PostgreSQL Database
resource postgresDatabase 'Microsoft.DBforPostgreSQL/flexibleServers/databases@2022-12-01' = {
  parent: postgresServer
  name: databaseName
  properties: {
    charset: 'UTF8'
    collation: 'en_US.utf8'
  }
}

// PostgreSQL Firewall Rule - Allow Azure Services
resource postgresFirewallRule 'Microsoft.DBforPostgreSQL/flexibleServers/firewallRules@2022-12-01' = {
  parent: postgresServer
  name: 'AllowAzureServices'
  properties: {
    startIpAddress: '0.0.0.0'
    endIpAddress: '0.0.0.0'
  }
}

// Backend App Service
resource backendApp 'Microsoft.Web/sites@2022-03-01' = {
  name: backendAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|your-registry/ems-backend:latest'
      appSettings: [
        {
          name: 'DATABASE_URL'
          value: 'jdbc:postgresql://${postgresServer.properties.fullyQualifiedDomainName}:5432/${databaseName}'
        }
        {
          name: 'DATABASE_USER'
          value: postgresAdminUsername
        }
        {
          name: 'DATABASE_PASSWORD'
          value: postgresAdminPassword
        }
        {
          name: 'JWT_SECRET'
          value: jwtSecret
        }
        {
          name: 'WEBSITES_PORT'
          value: '8080'
        }
      ]
    }
    httpsOnly: true
  }
}

// Frontend App Service
resource frontendApp 'Microsoft.Web/sites@2022-03-01' = {
  name: frontendAppName
  location: location
  kind: 'app,linux,container'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'DOCKER|your-registry/ems-frontend:latest'
      appSettings: [
        {
          name: 'BACKEND_URL'
          value: 'https://${backendApp.properties.defaultHostName}'
        }
        {
          name: 'WEBSITES_PORT'
          value: '80'
        }
      ]
    }
    httpsOnly: true
  }
}

// Outputs
output backendUrl string = 'https://${backendApp.properties.defaultHostName}'
output frontendUrl string = 'https://${frontendApp.properties.defaultHostName}'
output postgresServerFqdn string = postgresServer.properties.fullyQualifiedDomainName

