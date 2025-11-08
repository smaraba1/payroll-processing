# AWS Deployment

## Prerequisites

- AWS CLI configured with appropriate credentials
- Docker installed
- AWS account with necessary permissions

## Deployment Steps

### 1. Create the CloudFormation Stack

```bash
aws cloudformation create-stack \
  --stack-name ems-infrastructure \
  --template-body file://cloudformation.yaml \
  --parameters \
    ParameterKey=EnvironmentName,ParameterValue=dev \
    ParameterKey=DBUsername,ParameterValue=postgres \
    ParameterKey=DBPassword,ParameterValue=YourSecurePassword123! \
    ParameterKey=JWTSecret,ParameterValue=your-256-bit-secret \
  --capabilities CAPABILITY_IAM
```

### 2. Build and Push Docker Images

```bash
# Get ECR login
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Build and push backend
cd backend
docker build -t dev-ems-backend .
docker tag dev-ems-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/dev-ems-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/dev-ems-backend:latest

# Build and push frontend
cd ../frontend
docker build -t dev-ems-frontend .
docker tag dev-ems-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/dev-ems-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/dev-ems-frontend:latest
```

### 3. Create ECS Task Definitions and Services

Create ECS task definitions for backend and frontend using the pushed images, then create services attached to the load balancer target groups.

## Clean Up

```bash
aws cloudformation delete-stack --stack-name ems-infrastructure
```

