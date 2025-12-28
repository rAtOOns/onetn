# One TN Portal - Google Cloud Deployment Guide

## Quick Deploy (TL;DR)

For subsequent deployments after initial setup:

```bash
# Set variables
export PROJECT_ID="project-71b057f9-ab3b-4800-a7b"
export REGION="asia-south1"

# Build and deploy in one command
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/onetn-repo/onetn-app:latest && \
gcloud run deploy onetn-portal \
  --image=$REGION-docker.pkg.dev/$PROJECT_ID/onetn-repo/onetn-app:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --set-secrets="TURSO_DATABASE_URL=TURSO_DATABASE_URL:latest,TURSO_AUTH_TOKEN=TURSO_AUTH_TOKEN:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest" \
  --memory=512Mi \
  --cpu=1 \
  --port=8080
```

**Live URL**: https://onetn-portal-734553869592.asia-south1.run.app

---

## Prerequisites

1. **Google Cloud Account** with billing enabled
2. **Google Cloud CLI (gcloud)** installed and authenticated
3. **Docker** installed locally (for testing)
4. **Turso Database** account (for production database)

## Infrastructure Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                     │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │  Cloud Run      │    │  Secret Manager                 │ │
│  │  (Next.js App)  │───▶│  - TURSO_DATABASE_URL           │ │
│  │  Port: 8080     │    │  - TURSO_AUTH_TOKEN             │ │
│  └────────┬────────┘    │  - NEXTAUTH_SECRET              │ │
│           │             │  - NEXTAUTH_URL                 │ │
│           ▼             └─────────────────────────────────┘ │
│  ┌─────────────────┐                                        │
│  │ Artifact        │                                        │
│  │ Registry        │                                        │
│  │ (Docker Images) │                                        │
│  └─────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Turso          │
                    │  (LibSQL DB)    │
                    │  Edge Database  │
                    └─────────────────┘
```

## Step 1: Set Up Turso Database

### Install Turso CLI
```bash
# macOS
brew install tursodatabase/tap/turso

# Or using curl
curl -sSfL https://get.tur.so/install.sh | bash
```

### Create Database
```bash
# Login to Turso
turso auth login

# Create a new database
turso db create onetn-portal

# Get the database URL
turso db show onetn-portal --url
# Output: libsql://onetn-portal-<your-username>.turso.io

# Create an auth token
turso db tokens create onetn-portal
# Save this token securely!
```

### Push Schema to Turso
```bash
# Set environment variables locally
export TURSO_DATABASE_URL="libsql://onetn-portal-<your-username>.turso.io"
export TURSO_AUTH_TOKEN="your-auth-token"

# Push schema
npx prisma db push
```

## Step 2: Set Up Google Cloud Project

### Create Project and Enable APIs
```bash
# Set your project ID
export PROJECT_ID="onetn-portal"
export REGION="us-central1"

# Create project (or use existing)
gcloud projects create $PROJECT_ID --name="One TN Portal"

# Set as active project
gcloud config set project $PROJECT_ID

# Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com
```

### Create Artifact Registry Repository
```bash
# Create Docker repository
gcloud artifacts repositories create onetn-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="One TN Portal Docker images"

# Configure Docker to use Artifact Registry
gcloud auth configure-docker $REGION-docker.pkg.dev
```

## Step 3: Set Up Secrets

### Create Secrets in Secret Manager
```bash
# Create TURSO_DATABASE_URL secret
echo -n "libsql://onetn-portal-<your-username>.turso.io" | \
  gcloud secrets create TURSO_DATABASE_URL --data-file=-

# Create TURSO_AUTH_TOKEN secret
echo -n "your-turso-auth-token" | \
  gcloud secrets create TURSO_AUTH_TOKEN --data-file=-

# Create NEXTAUTH_SECRET (generate a random string)
openssl rand -base64 32 | \
  gcloud secrets create NEXTAUTH_SECRET --data-file=-

# Create NEXTAUTH_URL (will be updated after first deployment)
echo -n "https://your-cloud-run-url.run.app" | \
  gcloud secrets create NEXTAUTH_URL --data-file=-
```

### Grant Cloud Run Access to Secrets
```bash
# Get the compute service account
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
export SERVICE_ACCOUNT="$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

# Grant access to each secret
for SECRET in TURSO_DATABASE_URL TURSO_AUTH_TOKEN NEXTAUTH_SECRET NEXTAUTH_URL; do
  gcloud secrets add-iam-policy-binding $SECRET \
    --member="serviceAccount:$SERVICE_ACCOUNT" \
    --role="roles/secretmanager.secretAccessor"
done
```

## Step 4: Build and Push Docker Image

### Build Locally and Push
```bash
# Set image name
export IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/onetn-repo/onetn-app"

# Build the image
docker build -t $IMAGE_NAME:latest .

# Push to Artifact Registry
docker push $IMAGE_NAME:latest
```

### Or Use Cloud Build (Recommended)
```bash
# Submit build to Cloud Build
gcloud builds submit --tag $IMAGE_NAME:latest
```

## Step 5: Deploy to Cloud Run

### Deploy the Service
```bash
gcloud run deploy onetn-portal \
  --image=$IMAGE_NAME:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-secrets="TURSO_DATABASE_URL=TURSO_DATABASE_URL:latest" \
  --set-secrets="TURSO_AUTH_TOKEN=TURSO_AUTH_TOKEN:latest" \
  --set-secrets="NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest" \
  --set-secrets="NEXTAUTH_URL=NEXTAUTH_URL:latest"
```

### Get the Service URL
```bash
gcloud run services describe onetn-portal --region=$REGION --format='value(status.url)'
```

### Update NEXTAUTH_URL with Actual URL
```bash
# Get the Cloud Run URL
export CLOUD_RUN_URL=$(gcloud run services describe onetn-portal --region=$REGION --format='value(status.url)')

# Update the secret
echo -n "$CLOUD_RUN_URL" | \
  gcloud secrets versions add NEXTAUTH_URL --data-file=-

# Redeploy to pick up new secret
gcloud run services update onetn-portal --region=$REGION
```

## Step 6: Seed the Database (Optional)

```bash
# Run seed script locally with production database
export TURSO_DATABASE_URL="libsql://onetn-portal-<your-username>.turso.io"
export TURSO_AUTH_TOKEN="your-auth-token"

npm run db:seed
```

## Custom Domain (Optional)

### Map Custom Domain
```bash
# Verify domain ownership first in Google Cloud Console
# Then map the domain
gcloud run domain-mappings create \
  --service=onetn-portal \
  --domain=your-domain.com \
  --region=$REGION
```

## CI/CD with Cloud Build (Optional)

Create `cloudbuild.yaml` in project root:

```yaml
steps:
  # Build the container image
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '${_REGION}-docker.pkg.dev/${PROJECT_ID}/onetn-repo/onetn-app:${COMMIT_SHA}', '.']

  # Push the container image to Artifact Registry
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '${_REGION}-docker.pkg.dev/${PROJECT_ID}/onetn-repo/onetn-app:${COMMIT_SHA}']

  # Deploy to Cloud Run
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    entrypoint: gcloud
    args:
      - 'run'
      - 'deploy'
      - 'onetn-portal'
      - '--image=${_REGION}-docker.pkg.dev/${PROJECT_ID}/onetn-repo/onetn-app:${COMMIT_SHA}'
      - '--region=${_REGION}'

substitutions:
  _REGION: us-central1

images:
  - '${_REGION}-docker.pkg.dev/${PROJECT_ID}/onetn-repo/onetn-app:${COMMIT_SHA}'
```

### Set Up Cloud Build Trigger
```bash
# Connect your GitHub repository in Cloud Console
# Then create a trigger
gcloud builds triggers create github \
  --repo-name=onetn \
  --repo-owner=<your-github-username> \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `TURSO_DATABASE_URL` | Turso database connection URL | Yes |
| `TURSO_AUTH_TOKEN` | Turso authentication token | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | Full URL of the application | Yes |
| `NODE_ENV` | Set to `production` | Auto-set |
| `PORT` | Port number (8080 for Cloud Run) | Auto-set |

## Monitoring & Logs

### View Logs
```bash
gcloud run services logs read onetn-portal --region=$REGION --limit=100
```

### Stream Logs
```bash
gcloud run services logs tail onetn-portal --region=$REGION
```

### View in Console
Visit: https://console.cloud.google.com/run/detail/$REGION/onetn-portal/logs

## Troubleshooting

### Container fails to start
- Check logs: `gcloud run services logs read onetn-portal --region=$REGION`
- Verify all secrets are properly mounted
- Ensure DATABASE_URL is correctly set

### Database connection issues
- Verify Turso credentials are correct
- Check if database exists: `turso db list`
- Test connection locally first

### Build failures
- Check if all dependencies are in package.json
- Verify Prisma schema is valid
- Run `npm run build` locally to test

### libsql/Prisma "fcntl64 symbol not found" Error
**Problem**: Container crashes with error like:
```
Error relocating .../libsql/linux-x64-musl/index.node: fcntl64: symbol not found
```

**Cause**: Alpine Linux uses musl libc, but libsql native bindings require glibc.

**Solution**: Use Debian-slim instead of Alpine in Dockerfile:
```dockerfile
# WRONG - Don't use Alpine with libsql
FROM node:18-alpine

# CORRECT - Use Debian-slim
FROM node:18-slim
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
```

### Secret "not found" Error During Deploy
**Problem**:
```
Secret projects/.../secrets/SECRET_NAME/versions/latest was not found
```

**Cause**: Secret exists but has no versions (empty).

**Solution**: Add a version to the secret:
```bash
# Check if secret has versions
gcloud secrets versions list SECRET_NAME

# Add a version if empty
echo -n "your-secret-value" | gcloud secrets versions add SECRET_NAME --data-file=-
```

### "Permission denied on secret" Error
**Problem**:
```
Permission denied on secret: ... for Revision service account ...
The service account must be granted 'Secret Manager Secret Accessor' role
```

**Solution**: Grant role at project level:
```bash
export PROJECT_ID="your-project-id"
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### ARM vs x86 Architecture Mismatch
**Problem**: Image built on Mac M1/M2 fails on Cloud Run.

**Solution**: Use Cloud Build instead of local Docker:
```bash
# Don't use local docker build on ARM Macs
# Use Cloud Build which builds on x86
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/onetn-repo/onetn-app:latest
```

### Large Docker Image Size
**Problem**: Docker image is over 1GB.

**Solutions**:
1. Use `--chown` flag in COPY commands (avoids extra layer):
   ```dockerfile
   # Instead of: COPY ... && chown -R user:group
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   ```

2. Exclude large folders in `.dockerignore`:
   ```
   public/documents/
   public/uploads/
   backups/
   ```

3. Only copy required node_modules (for standalone Next.js):
   ```dockerfile
   COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
   COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
   COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
   ```

## Cost Estimation

- **Cloud Run**: Pay per use, free tier includes 2 million requests/month
- **Artifact Registry**: ~$0.10/GB/month storage
- **Secret Manager**: 6 secret versions free, then $0.06/10,000 access operations
- **Turso**: Free tier includes 500 databases, 9GB total storage

## First Time Setup (One-Time Commands)

Run these commands only once when setting up a new project:

```bash
# 1. Set variables
export PROJECT_ID="project-71b057f9-ab3b-4800-a7b"
export REGION="asia-south1"

# 2. Enable required APIs
gcloud services enable \
  cloudbuild.googleapis.com \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  secretmanager.googleapis.com

# 3. Create Artifact Registry repository
gcloud artifacts repositories create onetn-repo \
  --repository-format=docker \
  --location=$REGION \
  --description="One TN Portal Docker images"

# 4. Create secrets (empty shells)
gcloud secrets create TURSO_DATABASE_URL --replication-policy="automatic"
gcloud secrets create TURSO_AUTH_TOKEN --replication-policy="automatic"
gcloud secrets create NEXTAUTH_SECRET --replication-policy="automatic"

# 5. Add secret values
echo -n "libsql://your-db.turso.io" | gcloud secrets versions add TURSO_DATABASE_URL --data-file=-
echo -n "your-turso-token" | gcloud secrets versions add TURSO_AUTH_TOKEN --data-file=-
echo -n "$(openssl rand -hex 32)" | gcloud secrets versions add NEXTAUTH_SECRET --data-file=-

# 6. Grant Cloud Run access to secrets
export PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# 7. Configure Docker for Artifact Registry
gcloud auth configure-docker $REGION-docker.pkg.dev
```

## Quick Deploy Commands

```bash
# Full deployment in one go (after initial setup)
export PROJECT_ID="project-71b057f9-ab3b-4800-a7b"
export REGION="asia-south1"
export IMAGE_NAME="$REGION-docker.pkg.dev/$PROJECT_ID/onetn-repo/onetn-app"

# Build with Cloud Build (required for Mac M1/M2)
gcloud builds submit --tag $IMAGE_NAME:latest

# Deploy to Cloud Run
gcloud run deploy onetn-portal \
  --image=$IMAGE_NAME:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --cpu=1 \
  --min-instances=0 \
  --max-instances=10 \
  --set-secrets="TURSO_DATABASE_URL=TURSO_DATABASE_URL:latest,TURSO_AUTH_TOKEN=TURSO_AUTH_TOKEN:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest"

# Or combined (build + deploy)
gcloud builds submit --tag $IMAGE_NAME:latest && \
gcloud run deploy onetn-portal \
  --image=$IMAGE_NAME:latest \
  --region=$REGION \
  --platform=managed \
  --allow-unauthenticated \
  --port=8080 \
  --memory=512Mi \
  --set-secrets="TURSO_DATABASE_URL=TURSO_DATABASE_URL:latest,TURSO_AUTH_TOKEN=TURSO_AUTH_TOKEN:latest,NEXTAUTH_SECRET=NEXTAUTH_SECRET:latest"
```

## Current Deployment Info

| Item | Value |
|------|-------|
| Project ID | `project-71b057f9-ab3b-4800-a7b` |
| Region | `asia-south1` (Mumbai) |
| Service Name | `onetn-portal` |
| Live URL | https://onetn-portal-734553869592.asia-south1.run.app |
| Artifact Registry | `asia-south1-docker.pkg.dev/project-71b057f9-ab3b-4800-a7b/onetn-repo` |
| Image | `onetn-app:latest` |

## Deployment Checklist

Before deploying, verify:

- [ ] Dockerfile uses `node:18-slim` (NOT Alpine) for libsql compatibility
- [ ] `.dockerignore` excludes `public/documents/`, `public/uploads/`, `backups/`
- [ ] All secrets have versions: `gcloud secrets versions list SECRET_NAME`
- [ ] Service account has `secretmanager.secretAccessor` role
- [ ] Using Cloud Build (not local Docker) on Mac M1/M2

## Useful Commands

```bash
# Check deployment status
gcloud run services describe onetn-portal --region=asia-south1

# View logs
gcloud run services logs read onetn-portal --region=asia-south1 --limit=50

# Stream logs in real-time
gcloud run services logs tail onetn-portal --region=asia-south1

# Check secret versions
gcloud secrets versions list TURSO_DATABASE_URL

# Update a secret value
echo -n "new-value" | gcloud secrets versions add SECRET_NAME --data-file=-

# List all Cloud Run services
gcloud run services list

# Delete a service (careful!)
gcloud run services delete onetn-portal --region=asia-south1
```

# CI/CD Test
