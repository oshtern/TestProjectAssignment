const { test } = require('@playwright/test')
const LoginPage = require('../pages/LoginPage')
const TasksPage = require('../pages/TasksPage')

// Generating a unique task name for each test run
const uniqueTaskName = `AutoTask-${Date.now()}`

test.describe('SimplePractice test task scenario', () => {
    let loginPage
    let tasksPage

    test.beforeEach(async ({ page }) => {
        // Initializing Page Objects
        loginPage = new LoginPage(page)
        tasksPage = new TasksPage(page)

        // Navigating to SimplePractice portal
        await loginPage.navigate()

        // Authorizing to SimplePractice portal
        await loginPage.login()
        await loginPage.verifyLoginSuccess()
    })

    test.afterEach(async ({ page }) => {
        tasksPage = new TasksPage(page)

        await tasksPage.cleanup(uniqueTaskName)
    })

    test('Creating and complete a task', async ({ page }) => {
        // Navigating to the Tasks page
        await tasksPage.navigateToTasks()

        // Creating a new task and verifying that it was successfully created
        await tasksPage.createTask(uniqueTaskName)
        await tasksPage.verifyTaskCreation(uniqueTaskName)
        console.log(`Task created and verified: ${uniqueTaskName}`)

        // Completing the task and verifying that it was successfully marked as completed
        await tasksPage.completeTask(uniqueTaskName)
        await tasksPage.verifyTaskCompletion(uniqueTaskName)
        console.log(`Task completed and verified: ${uniqueTaskName}`)
    })
})