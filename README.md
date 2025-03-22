# FitTrack - Fitness Tracking Application

## Overview

FitTrack is a comprehensive fitness tracking web application designed to help users monitor their workouts, set fitness goals, track body measurements, participate in challenges, and connect with friends. The application features a subscription-based model for premium features and a mobile-first design approach.

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Core Features](#core-features)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Authentication](#authentication)
6. [API Endpoints](#api-endpoints)
7. [Subscription Model](#subscription-model)
8. [Admin Dashboard](#admin-dashboard)
9. [Getting Started](#getting-started)
10. [Testing](#testing)

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Passport.js with session-based auth
- **Payment Processing**: Stripe
- **State Management**: @tanstack/react-query
- **Routing**: wouter

## Core Features

### Workout Tracking
- Log exercises with type, duration, and intensity
- Track calories burned (calculated automatically)
- Add notes to workouts
- View workout history and statistics

### Goal Setting
- Create fitness goals (workout count, duration, distance)
- Monitor goal progress automatically as workouts are logged
- Set target dates and receive completion notifications

### Body Measurements
- Record weight, BMI, body fat percentage, and other metrics
- Visualize trends over time with interactive charts
- Connect with fitness devices and apps (Health Kit, Fitbit)

### Social Features
- Add friends and see their activities
- Create and join challenges
- Compete on leaderboards
- Share progress and achievements

### Premium Features
- Advanced analytics and detailed reports
- AI-powered workout recommendations
- Custom workout plans
- Coach consultations and personalized feedback
- Export data in various formats

## Architecture

The application follows a client-server architecture:

### Frontend
- React components organized by feature
- Responsive design with mobile-first approach
- TypeScript for type safety
- @tanstack/react-query for data fetching and caching
- Context-based state management (AuthContext, ThemeContext)

### Backend
- Express.js REST API
- PostgreSQL database with Drizzle ORM
- Storage interface for database operations
- Authentication middleware
- Stripe integration for payments

## Database Schema

The application uses several interconnected tables:

- **users**: User accounts and profile information
- **workouts**: Workout records with exercise type, duration, etc.
- **goals**: User-defined fitness goals and progress
- **body_measurements**: Weight, body composition, and other metrics
- **friendships**: Social connections between users
- **challenges**: Group fitness challenges
- **challenge_participants**: Users participating in challenges
- **user_devices**: Connected fitness devices
- **user_settings**: User preferences and configurations

## Authentication

- Session-based authentication using Passport.js
- Local strategy with username/password
- Password hashing with bcrypt
- Express sessions stored in PostgreSQL
- Role-based access control (user vs admin)

## API Endpoints

### Authentication
- POST /api/register - Create a new user account
- POST /api/login - Authenticate a user
- POST /api/logout - End user session
- GET /api/user - Get current user info

### Workouts
- POST /api/workouts - Create a new workout
- GET /api/workouts/user/:userId - Get a user's workouts
- GET /api/workouts/recent/:userId - Get recent workouts
- GET /api/workouts/:id - Get workout details

### Goals
- POST /api/goals - Create a new goal
- GET /api/goals/user/:userId - Get a user's goals
- PATCH /api/goals/:id - Update a goal
- DELETE /api/goals/:id - Delete a goal

### Social
- POST /api/friends/request - Send friend request
- GET /api/friends - Get friends list
- GET /api/friends/requests - Get pending requests
- POST /api/friends/respond/:id - Accept/reject request
- DELETE /api/friends/:friendId - Remove friend

### Challenges
- POST /api/challenges - Create a challenge
- GET /api/challenges/:id - Get challenge details
- GET /api/challenges/user/:userId - Get user's challenges
- GET /api/challenges/public - Get public challenges
- POST /api/challenges/:id/join - Join a challenge
- PATCH /api/challenges/:id/progress - Update progress

### Body Measurements
- POST /api/measurements - Add new measurement
- GET /api/measurements/user/:userId - Get user's measurements
- GET /api/measurements/latest/:userId - Get latest measurement
- GET /api/measurements/range - Get measurements in date range

### Subscriptions
- GET /api/subscription/plans - Get available plans
- POST /api/checkout - Create checkout session
- POST /api/cancel-subscription - Cancel subscription
- POST /api/webhooks/stripe - Handle Stripe events

### Admin
- GET /api/admin/stats - Get application statistics
- GET /api/admin/users - Get all users
- PATCH /api/admin/users/:id - Update a user
- DELETE /api/admin/users/:id - Delete a user
- POST /api/admin/users - Create a user

## Subscription Model

The application offers three subscription tiers:

1. **Basic** ($4.99/month)
   - Social features (friends, challenges)
   - Basic goal tracking
   - Limited analytics

2. **Premium** ($9.99/month)
   - All Basic features
   - Advanced analytics
   - Body composition tracking
   - Data export

3. **Pro** ($14.99/month)
   - All Premium features
   - AI workout planning
   - Coach consultations
   - Custom workout plans
   - Unlimited goals and challenges

Subscription management is handled through Stripe, including:
- Payment processing
- Subscription lifecycle
- Webhook handling for events
- Customer portal integration

## Admin Dashboard

The admin dashboard provides comprehensive management capabilities:

- **Overview**: User counts, subscription stats, revenue metrics
- **User Management**: Add, edit, and delete users
- **Application Settings**: Configure global settings
- **Analytics**: View detailed usage statistics
- **Subscription Management**: Monitor and manage subscriptions

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Set up the database: `npm run db:push`
5. Start the development server: `npm run dev`

**Default Admin Account**:
- Username: admin
- Password: admin123

## Testing

- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## License

This project is licensed under the MIT License - see the LICENSE file for details.