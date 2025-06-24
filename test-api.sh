#!/bin/bash

# School Report Portal API Test Script
# This script tests the basic functionality of the API

BASE_URL="http://localhost:3000/api/v1"
CONTENT_TYPE="Content-Type: application/json"

echo "🧪 Testing School Report Portal API..."
echo "======================================"

# Test 1: Health Check (Basic connectivity)
echo ""
echo "1. Testing API connectivity..."
response=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL)
if [ $response -eq 404 ]; then
    echo "✅ API is accessible (404 expected for root endpoint)"
else
    echo "❌ API connectivity test failed (status: $response)"
fi

# Test 2: Register Admin User
echo ""
echo "2. Creating admin user..."
register_response=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123456",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }')

echo "Register response: $register_response"

# Test 3: Login Admin User
echo ""
echo "3. Logging in admin user..."
login_response=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "$CONTENT_TYPE" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123456"
  }')

echo "Login response: $login_response"

# Extract token from login response
token=$(echo $login_response | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$token" ]; then
    echo "✅ Successfully obtained access token"
    
    # Test 4: Create a subject
    echo ""
    echo "4. Creating a test subject..."
    subject_response=$(curl -s -X POST "$BASE_URL/subjects" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $token" \
      -d '{
        "name": "Mathematics",
        "code": "MATH101",
        "description": "Basic mathematics course",
        "credits": 3,
        "category": "Science",
        "maxMarks": 100,
        "passingMarks": 40
      }')
    
    echo "Subject creation response: $subject_response"
    
    # Test 5: Get all subjects
    echo ""
    echo "5. Fetching all subjects..."
    subjects_response=$(curl -s -X GET "$BASE_URL/subjects" \
      -H "Authorization: Bearer $token")
    
    echo "Subjects list: $subjects_response"
    
    # Test 6: Create a teacher
    echo ""
    echo "6. Creating a test teacher..."
    teacher_response=$(curl -s -X POST "$BASE_URL/teachers" \
      -H "$CONTENT_TYPE" \
      -H "Authorization: Bearer $token" \
      -d '{
        "firstName": "Jane",
        "lastName": "Smith",
        "teacherId": "TCH001",
        "email": "jane.smith@school.com",
        "qualification": "M.Sc. Mathematics",
        "experience": 5,
        "subject": "Mathematics",
        "phone": "+1234567890"
      }')
    
    echo "Teacher creation response: $teacher_response"
    
else
    echo "❌ Failed to obtain access token"
fi

echo ""
echo "======================================"
echo "🧪 API testing completed!"
echo ""
echo "📚 To explore all endpoints, visit: http://localhost:3000/api/docs"
echo "🚀 API is running on: http://localhost:3000"
