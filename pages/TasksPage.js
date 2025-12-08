const { expect } = require('@playwright/test')
const config = require('../config')

class TasksPage {
    constructor(page) {
        this.page = page
        this.tasksLink = page.locator('a[aria-label="Tasks"]')
        this.createTaskButton = page.locator('[class="ember-view button primary"]')
        this.taskTitleInput = page.locator('input[id="title"]')
        this.taskDescriptionTextarea = page.locator('textarea[id="description"]')
        this.saveButton = page.locator('.right-buttons .primary')
        this.searchTasksInput = page.locator('input[class="utility-search"]')
        this.statusFilterButton = page.locator('.utility-bar .o0dc1 > div:nth-of-type(2) button')
        this.priorityFilterButton = page.locator('.utility-bar .o0dc1 > div:nth-of-type(3) button')
        this.editArrow = page.locator('.edit-chevron')
        this.deleteBtn = page.locator('button[class="button negative"]')
        this.clearSearchIcon = page.locator('.clear-search-icon')
        this.confirmDeletionBtn = page.locator('button[class*="confirm button negative"]')
    }

    async navigateToTasks() {
        await this.tasksLink.click()
        // Wait for the tasks page to load
        await this.page.waitForURL('**/tasks', { timeout: 10000 })
    }

    async createTask(title) {
        await this.createTaskButton.click()
        await this.taskTitleInput.fill(title)
        await this.taskDescriptionTextarea.fill(config.staticData.taskDescription)
        
        // Filling other fields using static data from the config
        await this.page.click('input[aria-label="Date picker"]')
        await this.page.click(`//td[@class="day" and text()="${new Date().getDate()}"]`) // Dynamic date
        await this.page.fill('input[id="timePicker"]', "11:24 PM") // Hardcoded time for simplicity
        
        // Priority
        await this.page.click('button[id*="input-dropdown-list"]')
        await this.page.click(`[data-value="${config.staticData.taskPriority}"]`)
        
        // Client
        await this.page.click('[data-validation-path="client"] div[class*="select-box__selected-option"]')
        await this.page.click(`text="${config.staticData.clientName}"`)
        
        // Assignee
        await this.page.click('[data-validation-path="taskAssignments"] div[class*="select-box__selected-option"]')
        await this.page.click(`text="${config.staticData.assigneeName}"`)

        await this.saveButton.click()
    }

    async verifyTaskCreation(title) {
        // Clearing filters to ensure search is accurate
        await this.clearFilters()
        
        // Searching for the task
        await this.searchTasksInput.fill(title)
        
        // Asserting visibility
        const taskCreated = this.page.locator(`//div[@class="list-items top"]//button[contains(@class, "button-link ") and text()="${title}"]`)
        await expect(taskCreated).toBeVisible({ timeout: 10000 })
        return taskCreated
    }

    async completeTask(title) {
        const completionCheckpoint = this.page.locator(`(//button[@class="button-link " and text()="${title}"]/ancestor::div[@class="list-items top"])//div[@class="checkable-circle"]`)
        await this.page.click(`(//button[@class="button-link " and text()="${title}"]/ancestor::div[@class="list-items top"])//div[@class="checkable-circle"]`)
    }

    async verifyTaskCompletion(title) {
        await this.statusFilterButton.click()
        await this.page.locator('//div[contains(@id, "ember-basic-dropdown-content")]//button[./span[text()="Completed"]]').click()
        
        // Searching for the task
        await this.searchTasksInput.fill(title)
        
        // Using the helper method to get the task locator
        const completedTask = this.page.locator(`//div[@class="list-items top"]//button[contains(@class, "button-link ") and text()="${title}"]`)
        await expect(completedTask).toBeVisible({ timeout: 10000 })
        console.log(`The task "${title}" was completed!`)
    }

    async clearFilters() {
        // Clearing Status filter
        await this.statusFilterButton.click()
        await this.page.click('//div[contains(@id, "ember-basic-dropdown-content")]//button[./span[text()="All"]]')

        // Clearing Priority filter
        await this.priorityFilterButton.click()
        await this.page.click('//div[contains(@id, "ember-basic-dropdown-content")]//button[./span[text()="All"]]')
    }

    async cleanup(title) {
        // Removing the created task in order not to clog the DB

        console.log(`Cleanup called for task ${title}`)
        await this.editArrow.click()
        await this.deleteBtn.click()
        await this.confirmDeletionBtn.click()

        // Ensuring the task was deleted
        console.log(`About to search for task ${title}`)
        await this.clearSearchIcon.click()
        await this.clearFilters()
        await this.searchTasksInput.fill(title)
        const taskCreated = this.page.locator(`//div[@class="list-items top"]//button[contains(@class, "button-link ") and text()="${title}"]`)
        await expect(taskCreated).toHaveCount(0)
    }
}

module.exports = TasksPage