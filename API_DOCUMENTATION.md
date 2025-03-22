# FitTrack API Documentation

This document provides comprehensive documentation for the FitTrack RESTful API.

## Base URL

All API endpoints are relative to the base URL:

```
https://[your-deployment-url]/api
```

## Authentication

Most API endpoints require authentication. The API uses session-based authentication.

### Authentication Flow

1. **Register a new user**:
   `POST /register`

2. **Login to get session**:
   `POST /login`

3. **Access protected endpoints** with the session cookie automatically included in subsequent requests

4. **Logout to invalidate session**:
   `POST /logout`

### Authentication Endpoints

#### Register a New User

```
POST /register
```

Request body:
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response (201 Created):
```json
{
  "id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T12:00:00Z",
  "isSubscribed": false,
  "subscriptionTier": null,
  "subscriptionStartDate": null,
  "subscriptionEndDate": null,
  "stripeCustomerId": null,
  "stripeSubscriptionId": null
}
```

Errors:
- 400 Bad Request: Invalid input data
- 409 Conflict: Username already exists

#### Login

```
POST /login
```

Request body:
```json
{
  "username": "newuser",
  "password": "securepassword"
}
```

Response (200 OK):
```json
{
  "id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T12:00:00Z",
  "isSubscribed": false,
  "subscriptionTier": null,
  "subscriptionStartDate": null,
  "subscriptionEndDate": null,
  "stripeCustomerId": null,
  "stripeSubscriptionId": null
}
```

Errors:
- 400 Bad Request: Invalid credentials
- 401 Unauthorized: Authentication failed

#### Logout

```
POST /logout
```

Response (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

#### Get Current User

```
GET /user
```

Response (200 OK):
```json
{
  "id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2023-01-01T12:00:00Z",
  "isSubscribed": false,
  "subscriptionTier": null,
  "subscriptionStartDate": null,
  "subscriptionEndDate": null,
  "stripeCustomerId": null,
  "stripeSubscriptionId": null
}
```

Errors:
- 401 Unauthorized: Not authenticated

## User Management

### Update User Profile

```
PATCH /users/:id
```

Request body:
```json
{
  "firstName": "Johnny",
  "lastName": "Doe",
  "email": "new-email@example.com"
}
```

Response (200 OK):
```json
{
  "id": 123,
  "username": "newuser",
  "email": "new-email@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "createdAt": "2023-01-01T12:00:00Z",
  "isSubscribed": false,
  "subscriptionTier": null,
  "subscriptionStartDate": null,
  "subscriptionEndDate": null,
  "stripeCustomerId": null,
  "stripeSubscriptionId": null
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to update this user
- 404 Not Found: User not found

## Workout Management

### Create Workout

```
POST /workouts
```

Request body:
```json
{
  "exerciseType": "running",
  "duration": 30,
  "intensity": "medium",
  "notes": "Morning run in the park"
}
```

Response (201 Created):
```json
{
  "id": 456,
  "userId": 123,
  "exerciseType": "running",
  "duration": 30,
  "intensity": "medium",
  "notes": "Morning run in the park",
  "calories": 250,
  "createdAt": "2023-01-02T08:30:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated

### Get Workouts for User

```
GET /workouts/user/:userId
```

Response (200 OK):
```json
[
  {
    "id": 456,
    "userId": 123,
    "exerciseType": "running",
    "duration": 30,
    "intensity": "medium",
    "notes": "Morning run in the park",
    "calories": 250,
    "createdAt": "2023-01-02T08:30:00Z"
  },
  {
    "id": 457,
    "userId": 123,
    "exerciseType": "strength",
    "duration": 45,
    "intensity": "high",
    "notes": "Full body workout",
    "calories": 400,
    "createdAt": "2023-01-03T17:00:00Z"
  }
]
```

Query parameters:
- `limit`: Maximum number of workouts to return
- `offset`: Number of workouts to skip (for pagination)
- `sortBy`: Field to sort by (default: "createdAt")
- `sortOrder`: "asc" or "desc" (default: "desc")

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's workouts
- 404 Not Found: User not found

### Get Recent Workouts

```
GET /workouts/recent/:userId
```

Query parameters:
- `limit`: Maximum number of workouts to return (default: 5)

Response (200 OK):
```json
[
  {
    "id": 457,
    "userId": 123,
    "exerciseType": "strength",
    "duration": 45,
    "intensity": "high",
    "notes": "Full body workout",
    "calories": 400,
    "createdAt": "2023-01-03T17:00:00Z"
  },
  {
    "id": 456,
    "userId": 123,
    "exerciseType": "running",
    "duration": 30,
    "intensity": "medium",
    "notes": "Morning run in the park",
    "calories": 250,
    "createdAt": "2023-01-02T08:30:00Z"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's workouts
- 404 Not Found: User not found

### Get Workout by ID

```
GET /workouts/:id
```

Response (200 OK):
```json
{
  "id": 456,
  "userId": 123,
  "exerciseType": "running",
  "duration": 30,
  "intensity": "medium",
  "notes": "Morning run in the park",
  "calories": 250,
  "createdAt": "2023-01-02T08:30:00Z"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this workout
- 404 Not Found: Workout not found

## Goal Management

### Create Goal

```
POST /goals
```

Request body:
```json
{
  "title": "Run 100 miles",
  "description": "Complete 100 miles of running in a month",
  "targetDate": "2023-02-01T00:00:00Z",
  "targetValue": 100,
  "metricType": "distance",
  "currentValue": 0
}
```

Response (201 Created):
```json
{
  "id": 789,
  "userId": 123,
  "title": "Run 100 miles",
  "description": "Complete 100 miles of running in a month",
  "targetDate": "2023-02-01T00:00:00Z",
  "targetValue": 100,
  "metricType": "distance",
  "currentValue": 0,
  "isCompleted": false,
  "completedAt": null,
  "createdAt": "2023-01-01T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated

### Get Goals for User

```
GET /goals/user/:userId
```

Response (200 OK):
```json
[
  {
    "id": 789,
    "userId": 123,
    "title": "Run 100 miles",
    "description": "Complete 100 miles of running in a month",
    "targetDate": "2023-02-01T00:00:00Z",
    "targetValue": 100,
    "metricType": "distance",
    "currentValue": 25,
    "isCompleted": false,
    "completedAt": null,
    "createdAt": "2023-01-01T12:00:00Z"
  },
  {
    "id": 790,
    "userId": 123,
    "title": "Lose 5 pounds",
    "description": "Reduce weight by 5 pounds",
    "targetDate": "2023-03-01T00:00:00Z",
    "targetValue": 5,
    "metricType": "weight",
    "currentValue": 2,
    "isCompleted": false,
    "completedAt": null,
    "createdAt": "2023-01-01T12:05:00Z"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's goals
- 404 Not Found: User not found

### Update Goal

```
PATCH /goals/:id
```

Request body:
```json
{
  "currentValue": 50,
  "description": "Updated description"
}
```

Response (200 OK):
```json
{
  "id": 789,
  "userId": 123,
  "title": "Run 100 miles",
  "description": "Updated description",
  "targetDate": "2023-02-01T00:00:00Z",
  "targetValue": 100,
  "metricType": "distance",
  "currentValue": 50,
  "isCompleted": false,
  "completedAt": null,
  "createdAt": "2023-01-01T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to update this goal
- 404 Not Found: Goal not found

### Delete Goal

```
DELETE /goals/:id
```

Response (200 OK):
```json
{
  "message": "Goal deleted successfully"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to delete this goal
- 404 Not Found: Goal not found

## Statistics and Analytics

### Get Weekly Stats

```
GET /stats/weekly/:userId
```

Response (200 OK):
```json
{
  "workoutCount": 5,
  "totalMinutes": 180,
  "totalCalories": 1200,
  "dailyCounts": [1, 0, 2, 1, 1, 0, 0]
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's stats
- 404 Not Found: User not found

## Social Features

### Send Friend Request

```
POST /friends/request
```

Request body:
```json
{
  "friendId": 456
}
```

Response (201 Created):
```json
{
  "id": 123,
  "userId": 123,
  "friendId": 456,
  "status": "pending",
  "createdAt": "2023-01-04T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 404 Not Found: User not found
- 409 Conflict: Friendship already exists

### Get Friends List

```
GET /friends
```

Response (200 OK):
```json
[
  {
    "id": 456,
    "username": "friend1",
    "firstName": "Jane",
    "lastName": "Smith"
  },
  {
    "id": 789,
    "username": "friend2",
    "firstName": "Bob",
    "lastName": "Johnson"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated

### Get Pending Friend Requests

```
GET /friends/requests
```

Response (200 OK):
```json
[
  {
    "id": 321,
    "userId": 789,
    "friendId": 123,
    "status": "pending",
    "createdAt": "2023-01-05T12:00:00Z",
    "sender": {
      "id": 789,
      "username": "friend2",
      "firstName": "Bob",
      "lastName": "Johnson"
    }
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated

### Respond to Friend Request

```
POST /friends/respond/:id
```

Request body:
```json
{
  "status": "accepted"  // or "rejected"
}
```

Response (200 OK):
```json
{
  "id": 321,
  "userId": 789,
  "friendId": 123,
  "status": "accepted",
  "createdAt": "2023-01-05T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid status
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to respond to this request
- 404 Not Found: Friend request not found

### Remove Friend

```
DELETE /friends/:friendId
```

Response (200 OK):
```json
{
  "message": "Friendship removed successfully"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 404 Not Found: Friendship not found

## Challenge Management

### Create Challenge

```
POST /challenges
```

Request body:
```json
{
  "title": "Summer Running Challenge",
  "description": "Run 100 miles during summer",
  "exerciseType": "running",
  "targetMetric": "distance",
  "targetValue": 100,
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-08-31T23:59:59Z",
  "isPublic": true
}
```

Response (201 Created):
```json
{
  "id": 234,
  "creatorId": 123,
  "title": "Summer Running Challenge",
  "description": "Run 100 miles during summer",
  "exerciseType": "running",
  "targetMetric": "distance",
  "targetValue": 100,
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-08-31T23:59:59Z",
  "isPublic": true,
  "createdAt": "2023-01-10T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Subscription required to create challenges

### Get Challenge by ID

```
GET /challenges/:id
```

Response (200 OK):
```json
{
  "id": 234,
  "creatorId": 123,
  "title": "Summer Running Challenge",
  "description": "Run 100 miles during summer",
  "exerciseType": "running",
  "targetMetric": "distance",
  "targetValue": 100,
  "startDate": "2023-06-01T00:00:00Z",
  "endDate": "2023-08-31T23:59:59Z",
  "isPublic": true,
  "createdAt": "2023-01-10T12:00:00Z"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this challenge
- 404 Not Found: Challenge not found

### Get User Challenges

```
GET /challenges/user/:userId
```

Response (200 OK):
```json
[
  {
    "id": 234,
    "creatorId": 123,
    "title": "Summer Running Challenge",
    "description": "Run 100 miles during summer",
    "exerciseType": "running",
    "targetMetric": "distance",
    "targetValue": 100,
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-08-31T23:59:59Z",
    "isPublic": true,
    "createdAt": "2023-01-10T12:00:00Z"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's challenges
- 404 Not Found: User not found

### Get Public Challenges

```
GET /challenges/public
```

Query parameters:
- `limit`: Maximum number of challenges to return (default: 10)

Response (200 OK):
```json
[
  {
    "id": 234,
    "creatorId": 123,
    "title": "Summer Running Challenge",
    "description": "Run 100 miles during summer",
    "exerciseType": "running",
    "targetMetric": "distance",
    "targetValue": 100,
    "startDate": "2023-06-01T00:00:00Z",
    "endDate": "2023-08-31T23:59:59Z",
    "isPublic": true,
    "createdAt": "2023-01-10T12:00:00Z"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated

### Join Challenge

```
POST /challenges/:id/join
```

Response (201 Created):
```json
{
  "id": 345,
  "challengeId": 234,
  "userId": 123,
  "joinedAt": "2023-01-15T12:00:00Z",
  "currentProgress": 0,
  "completed": false,
  "completedAt": null
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 404 Not Found: Challenge not found
- 409 Conflict: Already joined this challenge

### Update Challenge Progress

```
PATCH /challenges/:id/progress
```

Request body:
```json
{
  "progress": 25
}
```

Response (200 OK):
```json
{
  "id": 345,
  "challengeId": 234,
  "userId": 123,
  "joinedAt": "2023-01-15T12:00:00Z",
  "currentProgress": 25,
  "completed": false,
  "completedAt": null
}
```

Errors:
- 400 Bad Request: Invalid progress value
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to update this progress
- 404 Not Found: Challenge participation not found

### Get Challenge Participants

```
GET /challenges/:id/participants
```

Response (200 OK):
```json
[
  {
    "id": 345,
    "challengeId": 234,
    "userId": 123,
    "joinedAt": "2023-01-15T12:00:00Z",
    "currentProgress": 25,
    "completed": false,
    "completedAt": null,
    "user": {
      "id": 123,
      "username": "newuser",
      "firstName": "John",
      "lastName": "Doe"
    }
  },
  {
    "id": 346,
    "challengeId": 234,
    "userId": 456,
    "joinedAt": "2023-01-16T12:00:00Z",
    "currentProgress": 30,
    "completed": false,
    "completedAt": null,
    "user": {
      "id": 456,
      "username": "friend1",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 404 Not Found: Challenge not found

### Get Challenge Leaderboard

```
GET /challenges/:id/leaderboard
```

Response (200 OK):
```json
[
  {
    "id": 346,
    "challengeId": 234,
    "userId": 456,
    "joinedAt": "2023-01-16T12:00:00Z",
    "currentProgress": 30,
    "completed": false,
    "completedAt": null,
    "user": {
      "id": 456,
      "username": "friend1",
      "firstName": "Jane",
      "lastName": "Smith"
    }
  },
  {
    "id": 345,
    "challengeId": 234,
    "userId": 123,
    "joinedAt": "2023-01-15T12:00:00Z",
    "currentProgress": 25,
    "completed": false,
    "completedAt": null,
    "user": {
      "id": 123,
      "username": "newuser",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 404 Not Found: Challenge not found

## Body Measurements

### Add Body Measurement

```
POST /measurements
```

Request body:
```json
{
  "weight": 80.5,
  "bmi": 24.3,
  "bodyFatPercentage": 18.2,
  "musclePercentage": 45.0,
  "bodyWaterPercentage": 60.0,
  "boneMass": 4.2,
  "visceralFat": 7.0,
  "basalMetabolicRate": 1800,
  "source": "manual",
  "note": "Morning measurement after breakfast"
}
```

Response (201 Created):
```json
{
  "id": 567,
  "userId": 123,
  "date": "2023-01-20T08:00:00Z",
  "weight": 80.5,
  "bmi": 24.3,
  "bodyFatPercentage": 18.2,
  "musclePercentage": 45.0,
  "bodyWaterPercentage": 60.0,
  "boneMass": 4.2,
  "visceralFat": 7.0,
  "basalMetabolicRate": 1800,
  "source": "manual",
  "note": "Morning measurement after breakfast"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Subscription required for body composition metrics

### Get User Measurements

```
GET /measurements/user/:userId
```

Query parameters:
- `limit`: Maximum number of measurements to return (default: 30)

Response (200 OK):
```json
[
  {
    "id": 567,
    "userId": 123,
    "date": "2023-01-20T08:00:00Z",
    "weight": 80.5,
    "bmi": 24.3,
    "bodyFatPercentage": 18.2,
    "musclePercentage": 45.0,
    "bodyWaterPercentage": 60.0,
    "boneMass": 4.2,
    "visceralFat": 7.0,
    "basalMetabolicRate": 1800,
    "source": "manual",
    "note": "Morning measurement after breakfast"
  },
  {
    "id": 568,
    "userId": 123,
    "date": "2023-01-21T08:00:00Z",
    "weight": 80.2,
    "bmi": 24.2,
    "bodyFatPercentage": 18.0,
    "musclePercentage": 45.1,
    "bodyWaterPercentage": 60.0,
    "boneMass": 4.2,
    "visceralFat": 7.0,
    "basalMetabolicRate": 1800,
    "source": "manual",
    "note": "Morning measurement after breakfast"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's measurements
- 404 Not Found: User not found

### Get Measurements by Date Range

```
GET /measurements/range
```

Query parameters:
- `userId`: User ID (required)
- `startDate`: Start date in ISO format (required)
- `endDate`: End date in ISO format (required)

Response (200 OK):
```json
[
  {
    "id": 567,
    "userId": 123,
    "date": "2023-01-20T08:00:00Z",
    "weight": 80.5,
    "bmi": 24.3,
    "bodyFatPercentage": 18.2,
    "musclePercentage": 45.0,
    "bodyWaterPercentage": 60.0,
    "boneMass": 4.2,
    "visceralFat": 7.0,
    "basalMetabolicRate": 1800,
    "source": "manual",
    "note": "Morning measurement after breakfast"
  },
  {
    "id": 568,
    "userId": 123,
    "date": "2023-01-21T08:00:00Z",
    "weight": 80.2,
    "bmi": 24.2,
    "bodyFatPercentage": 18.0,
    "musclePercentage": 45.1,
    "bodyWaterPercentage": 60.0,
    "boneMass": 4.2,
    "visceralFat": 7.0,
    "basalMetabolicRate": 1800,
    "source": "manual",
    "note": "Morning measurement after breakfast"
  }
]
```

Errors:
- 400 Bad Request: Missing required parameters
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's measurements
- 404 Not Found: User not found

### Get Latest Measurement

```
GET /measurements/latest/:userId
```

Response (200 OK):
```json
{
  "id": 568,
  "userId": 123,
  "date": "2023-01-21T08:00:00Z",
  "weight": 80.2,
  "bmi": 24.2,
  "bodyFatPercentage": 18.0,
  "musclePercentage": 45.1,
  "bodyWaterPercentage": 60.0,
  "boneMass": 4.2,
  "visceralFat": 7.0,
  "basalMetabolicRate": 1800,
  "source": "manual",
  "note": "Morning measurement after breakfast"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view this user's measurements
- 404 Not Found: User not found or no measurements exist

## User Devices

### Add User Device

```
POST /devices
```

Request body:
```json
{
  "type": "fitbit",
  "name": "Fitbit Charge 5",
  "deviceId": "FB1234567890",
  "isActive": true,
  "settings": {
    "syncFrequency": "daily",
    "dataTypes": ["steps", "heartRate", "sleep"]
  }
}
```

Response (201 Created):
```json
{
  "id": 678,
  "userId": 123,
  "type": "fitbit",
  "name": "Fitbit Charge 5",
  "deviceId": "FB1234567890",
  "createdAt": "2023-01-22T12:00:00Z",
  "lastSynced": null,
  "isActive": true,
  "settings": {
    "syncFrequency": "daily",
    "dataTypes": ["steps", "heartRate", "sleep"]
  }
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Subscription required for device integration

### Get User Devices

```
GET /devices
```

Response (200 OK):
```json
[
  {
    "id": 678,
    "userId": 123,
    "type": "fitbit",
    "name": "Fitbit Charge 5",
    "deviceId": "FB1234567890",
    "createdAt": "2023-01-22T12:00:00Z",
    "lastSynced": null,
    "isActive": true,
    "settings": {
      "syncFrequency": "daily",
      "dataTypes": ["steps", "heartRate", "sleep"]
    }
  },
  {
    "id": 679,
    "userId": 123,
    "type": "appleHealth",
    "name": "iPhone Health",
    "deviceId": null,
    "createdAt": "2023-01-23T12:00:00Z",
    "lastSynced": "2023-01-23T12:05:00Z",
    "isActive": true,
    "settings": {
      "syncFrequency": "realtime",
      "dataTypes": ["steps", "heartRate", "workouts", "weight"]
    }
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated

### Update User Device

```
PATCH /devices/:id
```

Request body:
```json
{
  "isActive": false,
  "settings": {
    "syncFrequency": "weekly",
    "dataTypes": ["steps", "heartRate"]
  }
}
```

Response (200 OK):
```json
{
  "id": 678,
  "userId": 123,
  "type": "fitbit",
  "name": "Fitbit Charge 5",
  "deviceId": "FB1234567890",
  "createdAt": "2023-01-22T12:00:00Z",
  "lastSynced": null,
  "isActive": false,
  "settings": {
    "syncFrequency": "weekly",
    "dataTypes": ["steps", "heartRate"]
  }
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to update this device
- 404 Not Found: Device not found

### Delete User Device

```
DELETE /devices/:id
```

Response (200 OK):
```json
{
  "message": "Device deleted successfully"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to delete this device
- 404 Not Found: Device not found

## User Settings

### Get User Settings

```
GET /settings/:userId
```

Response (200 OK):
```json
{
  "id": 789,
  "userId": 123,
  "weightUnit": "kg",
  "height": 180,
  "birthDate": "1990-01-01",
  "gender": "male",
  "reminderEnabled": true,
  "reminderTime": "07:00",
  "healthKitEnabled": true,
  "fitbitEnabled": true,
  "language": "en",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-24T12:00:00Z"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to view these settings
- 404 Not Found: Settings not found

### Update User Settings

```
PATCH /settings/:userId
```

Request body:
```json
{
  "weightUnit": "lbs",
  "reminderEnabled": false,
  "language": "es"
}
```

Response (200 OK):
```json
{
  "id": 789,
  "userId": 123,
  "weightUnit": "lbs",
  "height": 180,
  "birthDate": "1990-01-01",
  "gender": "male",
  "reminderEnabled": false,
  "reminderTime": "07:00",
  "healthKitEnabled": true,
  "fitbitEnabled": true,
  "language": "es",
  "createdAt": "2023-01-01T12:00:00Z",
  "updatedAt": "2023-01-25T12:00:00Z"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not authorized to update these settings
- 404 Not Found: Settings not found

## Subscription Management

### Get Subscription Plans

```
GET /subscription/plans
```

Response (200 OK):
```json
[
  {
    "id": "basic",
    "name": "Basic",
    "price": 4.99,
    "description": "Essential fitness tracking features",
    "features": [
      "Workout tracking",
      "Basic goal setting",
      "Progress visualization",
      "Limited social features"
    ],
    "stripePriceId": "price_1234567890"
  },
  {
    "id": "premium",
    "name": "Premium",
    "price": 9.99,
    "description": "Advanced features for serious fitness enthusiasts",
    "features": [
      "All Basic features",
      "Advanced analytics",
      "Body composition tracking",
      "Export data",
      "Unlimited goals"
    ],
    "stripePriceId": "price_0987654321"
  },
  {
    "id": "pro",
    "name": "Pro",
    "price": 14.99,
    "description": "Professional-grade fitness management",
    "features": [
      "All Premium features",
      "AI workout planning",
      "Coach consultations",
      "Custom workout plans",
      "Priority support"
    ],
    "stripePriceId": "price_5555555555"
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated

### Create Checkout Session

```
POST /checkout
```

Request body:
```json
{
  "priceId": "price_1234567890"
}
```

Response (200 OK):
```json
{
  "sessionId": "cs_test_1234567890",
  "url": "https://checkout.stripe.com/c/pay/cs_test_1234567890"
}
```

Errors:
- 400 Bad Request: Invalid price ID
- 401 Unauthorized: Not authenticated
- 500 Internal Server Error: Failed to create checkout session

### Cancel Subscription

```
POST /cancel-subscription
```

Response (200 OK):
```json
{
  "message": "Subscription cancelled successfully",
  "user": {
    "id": 123,
    "username": "newuser",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "isSubscribed": true,
    "subscriptionTier": "premium",
    "subscriptionStartDate": "2023-01-01T00:00:00Z",
    "subscriptionEndDate": "2023-02-01T00:00:00Z",
    "stripeCustomerId": "cus_1234567890",
    "stripeSubscriptionId": "sub_1234567890"
  }
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 404 Not Found: No active subscription found
- 500 Internal Server Error: Failed to cancel subscription

## Admin Endpoints

All admin endpoints require authentication and admin privileges.

### Get Admin Statistics

```
GET /admin/stats
```

Response (200 OK):
```json
{
  "userCount": 150,
  "subscribedUsers": 75,
  "totalWorkouts": 3500,
  "activeUsers": 120,
  "newUsersToday": 5,
  "totalGoals": 450,
  "totalChallenges": 30,
  "revenue": 1299.50
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not an admin user

### Get All Users

```
GET /admin/users
```

Response (200 OK):
```json
[
  {
    "id": 123,
    "username": "newuser",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "2023-01-01T12:00:00Z",
    "isSubscribed": true,
    "subscriptionTier": "premium",
    "subscriptionStartDate": "2023-01-01T00:00:00Z",
    "subscriptionEndDate": "2023-02-01T00:00:00Z",
    "stripeCustomerId": "cus_1234567890",
    "stripeSubscriptionId": "sub_1234567890"
  },
  {
    "id": 456,
    "username": "friend1",
    "email": "friend1@example.com",
    "firstName": "Jane",
    "lastName": "Smith",
    "createdAt": "2023-01-02T12:00:00Z",
    "isSubscribed": false,
    "subscriptionTier": null,
    "subscriptionStartDate": null,
    "subscriptionEndDate": null,
    "stripeCustomerId": null,
    "stripeSubscriptionId": null
  }
]
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not an admin user

### Admin Update User

```
PATCH /admin/users/:id
```

Request body:
```json
{
  "isSubscribed": true,
  "subscriptionTier": "pro",
  "firstName": "Johnny",
  "lastName": "Doe"
}
```

Response (200 OK):
```json
{
  "id": 123,
  "username": "newuser",
  "email": "user@example.com",
  "firstName": "Johnny",
  "lastName": "Doe",
  "createdAt": "2023-01-01T12:00:00Z",
  "isSubscribed": true,
  "subscriptionTier": "pro",
  "subscriptionStartDate": "2023-01-25T00:00:00Z",
  "subscriptionEndDate": "2023-02-25T00:00:00Z",
  "stripeCustomerId": "cus_1234567890",
  "stripeSubscriptionId": "sub_1234567890"
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not an admin user
- 404 Not Found: User not found

### Admin Create User

```
POST /admin/users
```

Request body:
```json
{
  "username": "newadminuser",
  "password": "securepassword",
  "email": "admin2@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "isSubscribed": true,
  "subscriptionTier": "pro"
}
```

Response (201 Created):
```json
{
  "id": 789,
  "username": "newadminuser",
  "email": "admin2@example.com",
  "firstName": "Admin",
  "lastName": "User",
  "createdAt": "2023-01-26T12:00:00Z",
  "isSubscribed": true,
  "subscriptionTier": "pro",
  "subscriptionStartDate": "2023-01-26T00:00:00Z",
  "subscriptionEndDate": "2023-02-26T00:00:00Z",
  "stripeCustomerId": null,
  "stripeSubscriptionId": null
}
```

Errors:
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not an admin user
- 409 Conflict: Username or email already exists

### Admin Delete User

```
DELETE /admin/users/:id
```

Response (200 OK):
```json
{
  "message": "User deleted successfully"
}
```

Errors:
- 401 Unauthorized: Not authenticated
- 403 Forbidden: Not an admin user
- 404 Not Found: User not found

## Error Responses

All API endpoints return standardized error responses:

```json
{
  "message": "Error message explaining what went wrong",
  "errors": {
    "field1": ["Validation error for field1"],
    "field2": ["Validation error for field2"]
  }
}
```

Common HTTP status codes:

- 200: OK - Request succeeded
- 201: Created - Resource created successfully
- 400: Bad Request - Invalid input data
- 401: Unauthorized - Authentication required
- 403: Forbidden - Insufficient permissions
- 404: Not Found - Resource not found
- 409: Conflict - Resource already exists
- 500: Internal Server Error - Server-side error

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users

Rate limit headers are included in all responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642438800
```

When rate limit is exceeded, the API returns:

```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1642438800

{
  "message": "Rate limit exceeded. Try again in 60 seconds."
}
```