module.exports = {
    "env": {
        "browser": true,
        "es2021": true,
        "node": true,
        'jest/globals': true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "overrides": [
    ],
    "ignorePatterns": [
        "testing/"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "jest"
    ],
    "rules": {
    },
    "settings": {
        "react": {
          "version": "detect"
        }
      }
}
