const { expect } = require('@playwright/test')
const config = require('../config')

class LoginPage {
    constructor(page) {
        this.page = page
        this.emailInput = page.locator('input[id="user_email"]')
        this.passwordInput = page.locator('input[id="user_password"]')
        this.submitButton = page.locator('input[id="submitBtn"]')
        this.url = 'https://secure.simplepractice.com/calendar/appointments'
    }

    async navigate() {
        await this.page.goto(config.url)
    }

    async login() {
        await this.emailInput.fill(config.email)
        await this.passwordInput.fill(config.password)
        await this.submitButton.click()
    }

    async verifyLoginSuccess() {
        // Checking whether we are on the required page
        await expect(this.page).toHaveURL(this.url, { timeout: 15000 })
    }
}

module.exports = LoginPage