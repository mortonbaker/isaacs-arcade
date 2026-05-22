module.exports = {
    testDir: './tests',
    testMatch: '**/*.spec.js',
    timeout: 30000,
    use: {
        headless: true,
    },
    reporter: 'list',
};
