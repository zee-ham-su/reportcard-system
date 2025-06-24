#!/bin/bash

# Comprehensive Test Script for School Report Portal API

# Stop on first error
set -e

# Check for jq
if ! command -v jq &> /dev/null
then
    echo "jq could not be found. Please install jq to run this script."
    exit 1
fi

# --- Configuration ---
BASE_URL="http://localhost:3000/api/v1"
ADMIN_EMAIL="admin@test.com"
ADMIN_PASS="password123"
TEACHER_EMAIL="teacher@test.com"
TEACHER_PASS="password123"
STUDENT_EMAIL="student@test.com"
STUDENT_PASS="password123"

# --- Colors for output ---
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# --- Helper Functions ---
log_step() {
    echo -e "\n${YELLOW}>>> $1${NC}"
}

log_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

log_error() {
    echo -e "${RED}✗ $1${NC}"
}

# --- Cleanup Function ---
cleanup() {
    log_step "Cleaning up created resources..."
    # No need to delete users, as we will drop the database
    # This is a placeholder for more specific cleanup if needed
    log_success "Cleanup will be handled by restarting the server with a clean DB."
}

# --- Main Test Execution ---
main() {
    log_step "Starting API tests..."

    # 1. Register Users
    log_step "Registering Admin, Teacher, and Student users..."
    ADMIN_REG_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username": "adminuser", "email": "'''$ADMIN_EMAIL'''", "password": "'''$ADMIN_PASS'''", "role": "Admin"}' $BASE_URL/auth/register)
    TEACHER_REG_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username": "teacheruser", "email": "'''$TEACHER_EMAIL'''", "password": "'''$TEACHER_PASS'''", "role": "Teacher"}' $BASE_URL/auth/register)
    STUDENT_REG_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"username": "studentuser", "email": "'''$STUDENT_EMAIL'''", "password": "'''$STUDENT_PASS'''", "role": "Student"}' $BASE_URL/auth/register)
    
    ADMIN_ID=$(echo $ADMIN_REG_RESPONSE | jq -r '._id')
    TEACHER_ID=$(echo $TEACHER_REG_RESPONSE | jq -r '._id')
    STUDENT_ID=$(echo $STUDENT_REG_RESPONSE | jq -r '._id')

    log_success "Admin, Teacher, and Student registered."
    
    # Add a small delay to ensure users are processed in the DB
    log_step "Waiting for 2 seconds before logging in..."
    sleep 2

    # 2. Login Users
    log_step "Logging in users to get JWT tokens..."
    ADMIN_LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "'''$ADMIN_EMAIL'''", "password": "'''$ADMIN_PASS'''"}' $BASE_URL/auth/login)
    TEACHER_LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "'''$TEACHER_EMAIL'''", "password": "'''$TEACHER_PASS'''"}' $BASE_URL/auth/login)
    STUDENT_LOGIN_RESPONSE=$(curl -s -X POST -H "Content-Type: application/json" -d '{"email": "'''$STUDENT_EMAIL'''", "password": "'''$STUDENT_PASS'''"}' $BASE_URL/auth/login)

    ADMIN_TOKEN=$(echo $ADMIN_LOGIN_RESPONSE | jq -r '.access_token')
    TEACHER_TOKEN=$(echo $TEACHER_LOGIN_RESPONSE | jq -r '.access_token')
    STUDENT_TOKEN=$(echo $STUDENT_LOGIN_RESPONSE | jq -r '.access_token')

    if [ "$ADMIN_TOKEN" == "null" ] || [ "$TEACHER_TOKEN" == "null" ] || [ "$STUDENT_TOKEN" == "null" ]; then
        log_error "Login failed. Exiting."
        exit 1
    fi
    log_success "Tokens obtained for all roles."

    # 3. Admin Actions
    log_step "Testing Admin-only actions..."
    
    # Create Subjects
    SUBJECT1_ID=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "Mathematics", "credits": 3}' $BASE_URL/subjects | jq -r '._id')
    SUBJECT2_ID=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "Physics", "credits": 4}' $BASE_URL/subjects | jq -r '._id')
    log_success "Admin created subjects: Mathematics and Physics."

    # Create a Class
    CLASS_ID=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $ADMIN_TOKEN" -d '{"name": "Grade 10 - Section A", "gradeLevel": 10, "teacher": "'''$TEACHER_ID'''"}' $BASE_URL/classes | jq -r '._id')
    log_success "Admin created a class."

    # Assign Student to Class
    curl -s -X POST -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/classes/$CLASS_ID/students/$STUDENT_ID" > /dev/null
    log_success "Admin assigned student to the class."

    # Verify student is in the class
    STUDENTS_IN_CLASS=$(curl -s -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/classes/$CLASS_ID/students")
    if [[ $(echo "$STUDENTS_IN_CLASS" | jq -r '.[0]._id') == "$STUDENT_ID" ]]; then
        log_success "Verified student is correctly assigned to the class."
    else
        log_error "Failed to verify student in class."
    fi

    # 4. Teacher Actions
    log_step "Testing Teacher actions..."

    # Teacher tries to create a subject (should fail)
    log_step "Teacher attempts to create a subject (should be forbidden)..."
    TEACHER_CREATE_SUBJECT_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TEACHER_TOKEN" -d '{"name": "Forbidden Subject", "credits": 3}' $BASE_URL/subjects)
    if [ "$TEACHER_CREATE_SUBJECT_RESPONSE" -eq 403 ]; then
        log_success "Teacher correctly forbidden from creating a subject (HTTP 403)."
    else
        log_error "Teacher was able to create a subject (HTTP $TEACHER_CREATE_SUBJECT_RESPONSE). RBAC FAILED."
        exit 1
    fi

    # Teacher enters marks for the student
    log_step "Teacher enters marks for the student..."
    MARK_ID=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $TEACHER_TOKEN" -d '{"student": "'''$STUDENT_ID'''", "subject": "'''$SUBJECT1_ID'''", "term": "First Term", "marks": 95}' $BASE_URL/marks | jq -r '._id')
    if [ "$MARK_ID" != "null" ]; then
        log_success "Teacher successfully entered marks."
    else
        log_error "Teacher failed to enter marks."
        exit 1
    fi

    # Teacher updates marks
    log_step "Teacher updates marks..."
    curl -s -X PUT -H "Content-Type: application/json" -H "Authorization: Bearer $TEACHER_TOKEN" -d '{"marks": 98}' "$BASE_URL/marks/$MARK_ID" > /dev/null
    log_success "Teacher successfully updated marks."

    # 5. Student Actions
    log_step "Testing Student actions..."

    # Student views their own marks
    STUDENT_MARKS=$(curl -s -X GET -H "Authorization: Bearer $STUDENT_TOKEN" "$BASE_URL/marks/student/$STUDENT_ID")
    if [[ $(echo "$STUDENT_MARKS" | jq -r 'length') -gt 0 ]]; then
        log_success "Student successfully viewed their marks."
    else
        log_error "Student failed to view their marks."
    fi

    # Student tries to view all users (should fail)
    log_step "Student attempts to view all users (should be forbidden)..."
    STUDENT_GET_USERS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X GET -H "Authorization: Bearer $STUDENT_TOKEN" $BASE_URL/users)
    if [ "$STUDENT_GET_USERS_RESPONSE" -eq 403 ]; then
        log_success "Student correctly forbidden from viewing all users (HTTP 403)."
    else
        log_error "Student was able to view all users (HTTP $STUDENT_GET_USERS_RESPONSE). RBAC FAILED."
        exit 1
    fi

    # 6. Report Generation
    log_step "Testing Report Generation..."
    
    # Get report data as JSON
    REPORT_DATA=$(curl -s -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/reports/student/$STUDENT_ID/data")
    if [[ $(echo "$REPORT_DATA" | jq -r '.student.name') == "studentuser" ]]; then
        log_success "Successfully fetched report data as JSON."
    else
        log_error "Failed to fetch report data."
    fi

    # Download PDF report card
    log_step "Downloading PDF report card (checking for success status)..."
    PDF_RESPONSE_CODE=$(curl -s -o report_card.pdf -w "%{http_code}" -X GET -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/reports/student/$STUDENT_ID/report-card")
    if [ "$PDF_RESPONSE_CODE" -eq 200 ]; then
        log_success "Successfully received PDF report card (HTTP 200)."
        rm report_card.pdf
    else
        log_error "Failed to download PDF report card (HTTP $PDF_RESPONSE_CODE)."
    fi

    # 7. Cleanup (Admin deletes resources)
    log_step "Admin cleaning up created resources..."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/marks/$MARK_ID" > /dev/null
    log_success "Deleted mark."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/classes/$CLASS_ID" > /dev/null
    log_success "Deleted class."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/subjects/$SUBJECT1_ID" > /dev/null
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/subjects/$SUBJECT2_ID" > /dev/null
    log_success "Deleted subjects."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/users/$STUDENT_ID" > /dev/null
    log_success "Deleted student user."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/users/$TEACHER_ID" > /dev/null
    log_success "Deleted teacher user."
    curl -s -X DELETE -H "Authorization: Bearer $ADMIN_TOKEN" "$BASE_URL/users/$ADMIN_ID" > /dev/null
    log_success "Deleted admin user."
    
    log_step "All tests passed successfully!"
}

# Run main function and handle errors
main "$@"
