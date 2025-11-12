const { defineConfig } = require("cypress");

module.exports = defineConfig({
  // 👇 Add your projectId here from Cypress Cloud dashboard
  projectId: "u74z74",

  e2e: {
    baseUrl: "https://www.portfoliovisualizer.com", // base URL for all tests

     
    video: true,
    screenshotOnRunFailure: true,
    env: {
      PV_USERNAME: "zaink4208@gmail.com",
      PV_PASSWORD: "wasimkhan444"
    },
    setupNodeEvents(on, config) {
      // You can add plugin listeners here later (not required for now)
    },
  },
});
