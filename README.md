# TestProjectAssignment

The project is created as a part of the assessment process for SimplePractice

## Description

This project demonstrates end-to-end testing of the SimplePractice portal https://secure.simplepractice.com using Playwright framework. It covers:
- User authentication
- Happy path CRUD operations for Tasks entity

## Getting Started

* Ensure you have:
- Node.js (v14 or higher)
- npm or yarn package manager
- Git
* Install Playwright: npm init playwright@latest

### Structure

The project is written in javascript using Playwright testing framework. 

The project consists of the following files:
* "pages" folder with two files determining two classes:
* LoginPage - class for authorization operations
* TasksPage - class for CRUD operations with Task entities
* "tests" folder with "spAssignment.js" file where actual test cases are stored


### Installing

* Clone the repository to VS Code: git clone https://github.com/oshtern/TestProjectAssignment.git
* Go to the project directory: cd TestProjectAssignment


### Executing program

* Update config.js with valid test credentials and data

* Ensure all required environment variables are set

* Call this command to start test execution: npx playwright test tests/spAssignment.spec.js --headed --project chromium
This is enough to make the tests running

OR:
* To run tests in headless mode (faster, no UI):
npx playwright test tests/spAssignment.spec.js


## Test cases covered

1. Authentication:

        Successful login with valid credentials

        Navigation to dashboard

2. Task Management:

        Creating a new task with all required fields

        Verifying task creation

        Marking task as completed

        Verifying task completion status

        Cleanup (deleting created tasks)

## Authors

Olesia Shtern for SimplePractice