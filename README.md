# Testing-Chrome-Extensions-with-selenium

A Node.js project for web automation testing using Selenium WebDriver.

## Description

This project is set up for testing a browser extension using Selenium WebDriver with Chrome. It includes testing frameworks and dependencies for building automated web testing suites.

## Prerequisites

- Node.js (version 14 or higher recommended)
- npm or yarn package manager
- Google Chrome browser (for ChromeDriver compatibility)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/alex-anie/Testing-Chrome-Extensions-with-selenium.git
cd <project directory>
```

2. Install dependencies:
```bash
npm install
```

4. Run the test locally on the terminal:
```bash
node tests/launch-extension.spec.js
```

## Dependencies

### Production Dependencies
- **selenium-webdriver** (^4.33.0) - WebDriver implementation for browser automation
- **chromedriver** (^136.0.3) - Chrome browser driver for Selenium

### Development Dependencies
- **mocha** (^11.5.0) - JavaScript test framework
- **chai** (^5.2.0) - Assertion library for testing
