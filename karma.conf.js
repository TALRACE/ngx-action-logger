// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('@angular-devkit/build-angular/plugins/karma'),
            require('karma-junit-reporter')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: require('path').join(__dirname, 'coverage'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'lcovonly' },
                { type: 'text-summary' },
                { type: 'cobertura' }
            ],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml', 'junit'],
        hostname: 'localhost',
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['HeadlessChrome'],
        customLaunchers: {
            HeadlessChrome: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox',
                    '--disable-web-security',
                    '--disable-gpu',
                    '--no-proxy-server'
                ]
            }
        },
        singleRun: true
    });
};
