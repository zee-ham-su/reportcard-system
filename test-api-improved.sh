#!/bin/bash

# School Report Portal API Test Script
API_BASE="http://localhost:3000/api/v1"

echo "=== Testing School Report Portal API ==="
echo ""

# 1. Test user registration (Admin)
echo "1. Registering admin user..."
ADMIN_REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "admin"
  }')
echo "Admin registration response: $ADMIN_REGISTER_RESPONSE"
echo ""

# 2. Test user registration (Teacher)
echo "2. Registering teacher user..."
TEACHER_REGISTER_RESPONSE=$(curl -s -X POST "$API_BASE/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "teacher123",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "teacher",
    "phone": "+1234567890"
  }')
echo "Teacher registration response: $TEACHER_REGISTER_RESPONSE"
echo ""

# 3. Test admin login
echo "3. Logging in as admin..."
ADMIN_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "admin123"
  }')
echo "Admin login response: $ADMIN_LOGIN_RESPONSE"

# Extract admin token
ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Admin token: $ADMIN_TOKEN"
echo ""

# 4. Test teacher login
echo "4. Logging in as teacher..."
TEACHER_LOGIN_RESPONSE=$(curl -s -X POST "$API_BASE/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teacher@school.com",
    "password": "teacher123"
  }')
echo "Teacher login response: $TEACHER_LOGIN_RESPONSE"

# Extract teacher token
TEACHER_TOKEN=$(echo $TEACHER_LOGIN_RESPONSE | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
echo "Teacher token: $TEACHER_TOKEN"
echo ""

# 5. Test creating a subject (as admin)
echo "5. Creating a subject (as admin)..."
SUBJECT_RESPONSE=$(curl -s -X POST "$API_BASE/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "name": "Mathematics",
    "code": "MATH101",
    "description": "Basic mathematics course",
    "credits": 3,
    "category": "Science",
    "maxMarks": 100,
    "passingMarks": 40
  }')
echo "Subject creation response: $SUBJECT_RESPONSE"
echo ""

# 6. Test accessing subjects as teacher (should work)
echo "6. Getting subjects as teacher (should work)..."
TEACHER_SUBJECTS_RESPONSE=$(curl -s -X GET "$API_BASE/subjects" \
  -H "Authorization: Bearer $TEACHER_TOKEN")
echo "Teacher subjects access response: $TEACHER_SUBJECTS_RESPONSE"
echo ""

# 7. Test creating subject as teacher (should fail)
echo "7. Trying to create subject as teacher (should fail)..."
TEACHER_CREATE_SUBJECT_RESPONSE=$(curl -s -X POST "$API_BASE/subjects" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TEACHER_TOKEN" \
  -d '{
    "name": "English",
    "code": "ENG101",
    "description": "Basic English course",
    "credits": 3
  }')
echo "Teacher subject creation response: $TEACHER_CREATE_SUBJECT_RESPONSE"
echo ""

# 8. Test accessing subjects without token (should fail)
echo "8. Trying to access subjects without token (should fail)..."
NO_TOKEN_RESPONSE=$(curl -s -X GET "$API_BASE/subjects")
echo "No token response: $NO_TOKEN_RESPONSE"
echo ""

# 9. Check if teacher was automatically created
echo "9. Getting teachers (as admin)..."
TEACHERS_RESPONSE=$(curl -s -X GET "$API_BASE/teachers" \
  -H "Authorization: Bearer $ADMIN_TOKEN")
echo "Teachers list response: $TEACHERS_RESPONSE"
echo ""

echo "=== API Test Complete ==="
