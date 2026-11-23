const base = require('@playwright/test');
const { LandingPage } = require('../pages/LandingPage');
const { RegisterPage } = require('../pages/RegisterPage');
const { LoginPage } = require('../pages/LoginPage');
const { DashboardPage } = require('../pages/DashboardPage');
const { HabitoFormPage } = require('../pages/HabitoFormPage');
const { ProfileModalPage } = require('../pages/ProfileModalPage');

const test = base.test.extend({
  landingPage: async ({ page }, use) => {
    await use(new LandingPage(page));
  },
  registerPage: async ({ page }, use) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },
  habitoFormPage: async ({ page }, use) => {
    await use(new HabitoFormPage(page));
  },
  profileModalPage: async ({ page }, use) => {
    await use(new ProfileModalPage(page));
  },
});

const expect = base.expect;

module.exports = { test, expect };
