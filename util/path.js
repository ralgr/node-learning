const path = require("path");

// 'process' variable available globally.
// 'mainModule' will refer to the main module that started the app.
// This would be the module created on the app.js file.
// Overall, this string of code leads to app.js and is put as an argument in 'dirname'
// to get the path to its directory.

module.exports = path.dirname(process.mainModule.filename);