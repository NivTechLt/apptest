# FitTrack - Installation and Deployment Guide

This guide provides detailed instructions for setting up, configuring, and deploying the FitTrack application in various environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [Stripe Integration](#stripe-integration)
6. [Deployment Options](#deployment-options)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)
8. [Backup and Recovery](#backup-and-recovery)
9. [Security Considerations](#security-considerations)

## Prerequisites

Before deploying FitTrack, ensure you have the following:

- Node.js (v18.x or later)
- PostgreSQL (v14.x or later)
- Stripe account (for payment processing)
- SSL certificate (for production deployments)
- DNS configuration (for custom domains)

## Local Development Setup

### Clone Repository

```bash
git clone https://github.com/your-org/fittrack.git
cd fittrack
```

### Install Dependencies

```bash
npm install
```

### Set Up Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/fittrack

# Authentication
SESSION_SECRET=your_secure_random_string

# Stripe (for subscriptions)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRO=price_...

# Server
PORT=5000
NODE_ENV=development
```

### Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5000`.

## Environment Configuration

### Development vs. Production

The application uses environment variables to determine its configuration:

- `NODE_ENV=development`: Enables development features, detailed error messages
- `NODE_ENV=production`: Optimizes for production, minimal logging

### Configuration Files

- `drizzle.config.ts`: Database ORM configuration
- `vite.config.ts`: Frontend build configuration
- `theme.json`: UI theme configuration

## Database Setup

### Local PostgreSQL

1. Create a database:
   ```sql
   CREATE DATABASE fittrack;
   CREATE USER fittrack_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE fittrack TO fittrack_user;
   ```

2. Set the connection string in your `.env` file:
   ```
   DATABASE_URL=postgresql://fittrack_user:your_password@localhost:5432/fittrack
   ```

3. Apply the schema:
   ```bash
   npm run db:push
   ```

### Cloud Database (e.g., Neon)

1. Create a PostgreSQL database in your cloud provider
2. Get the connection string
3. Add it to your environment variables
4. Apply the schema:
   ```bash
   npm run db:push
   ```

### Initial Data Setup

Create the admin account:

```bash
npm run seed:admin
```

This creates an admin user with:
- Username: admin
- Password: admin123
- Email: admin@example.com

## Stripe Integration

### Setting Up Stripe

1. Create a [Stripe account](https://stripe.com)
2. Get your API keys from the Dashboard
3. Set up products and recurring price points:
   - Basic Subscription: $4.99/month
   - Premium Subscription: $9.99/month
   - Pro Subscription: $14.99/month
4. Note the price IDs for each subscription tier
5. Configure webhook endpoints to receive events

### Environment Variables

Add these variables to your deployment environment:

```
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_BASIC=price_...
STRIPE_PRICE_PREMIUM=price_...
STRIPE_PRICE_PRO=price_...
```

### Testing Stripe Integration

1. Use Stripe test mode for development
2. Set up webhook forwarding with [Stripe CLI](https://stripe.com/docs/stripe-cli)
3. Test subscription creation and webhooks

## Deployment Options

### Replit Deployment

1. Create a new Repl from GitHub
2. Configure environment variables in the Repl secrets
3. Deploy using the Replit deployment feature

### Traditional VPS (e.g., Digital Ocean, AWS EC2)

1. Provision a server with Node.js and PostgreSQL
2. Clone the repository
3. Install dependencies (`npm install --production`)
4. Set up environment variables
5. Build the application (`npm run build`)
6. Use PM2 or similar for process management:
   ```bash
   npm install -g pm2
   pm2 start npm --name "fittrack" -- start
   pm2 startup
   pm2 save
   ```

### Docker Deployment

The repository includes Dockerfile and docker-compose.yml for containerized deployment:

1. Build the Docker image:
   ```bash
   docker build -t fittrack .
   ```

2. Run with docker-compose:
   ```bash
   docker-compose up -d
   ```

### CI/CD Pipeline

For automated deployments, set up a pipeline with:

1. Code linting and testing
2. Database migrations
3. Build process
4. Deployment to staging/production

## Monitoring and Maintenance

### Application Monitoring

Use monitoring tools to track application health:

- Server metrics: CPU, memory, disk usage
- Application metrics: request counts, response times
- Error tracking: integration with Sentry or similar
- Database monitoring: connection pool, query performance

### Logging

The application logs to:
- Console (structured JSON in production)
- Application-specific logs for errors
- Access logs for API requests

Configure log rotation for production deployments.

### Updates and Maintenance

Regular maintenance tasks:

1. Keep dependencies updated:
   ```bash
   npm outdated
   npm update
   ```

2. Apply security patches promptly
3. Monitor for database performance issues
4. Run periodic database vacuum operations

## Backup and Recovery

### Database Backups

Set up regular PostgreSQL backups:

```bash
# Daily backup script example
pg_dump -Fc fittrack > /backup/fittrack_$(date +%Y%m%d).dump
```

### Backup Rotation

Implement a backup retention policy:
- Daily backups for the past week
- Weekly backups for the past month
- Monthly backups for the past year

### Recovery Testing

Periodically test the restoration process:

```bash
# Create a test database
createdb fittrack_test

# Restore from backup
pg_restore -d fittrack_test /backup/fittrack_20230101.dump

# Verify data integrity
psql -d fittrack_test -c "SELECT COUNT(*) FROM users;"
```

## Security Considerations

### Authentication Security

- Use strong passwords for admin accounts
- Implement rate limiting for authentication attempts
- Set secure cookie attributes (HttpOnly, Secure, SameSite)
- Configure session timeouts appropriately

### API Security

- Ensure all endpoints are properly authenticated
- Implement CSRF protection
- Use HTTPS for all communications
- Apply proper input validation

### Database Security

- Restrict database user permissions
- Use connection pooling to avoid resource exhaustion
- Parameterize all SQL queries
- Encrypt sensitive data at rest

### Regular Security Audits

- Conduct periodic security reviews
- Use automated scanning tools
- Keep dependencies updated
- Monitor for unusual access patterns

## Troubleshooting

### Common Issues

1. **Database Connection Issues**:
   - Verify connection string
   - Check network access to database
   - Ensure correct credentials

2. **Stripe Webhook Failures**:
   - Validate webhook signature
   - Check endpoint accessibility
   - Review Stripe dashboard for errors

3. **Session Management Problems**:
   - Verify SESSION_SECRET is set
   - Check session store configuration
   - Review cookie settings

4. **Performance Bottlenecks**:
   - Monitor query performance
   - Check server resource utilization
   - Implement caching where appropriate

### Support Resources

- GitHub Issues: [Repository Issues Link]
- Email Support: support@fittrack.example.com
- Documentation: [Docs Site Link]