// module.exports = {
//     "env": {
//         "browser": true,
//         "es2021": true
//     },
//     "extends": [
//         "eslint:recommended",
//         "plugin:react/recommended",
//         "plugin:@typescript-eslint/recommended"
//     ],
//     "parser": "@typescript-eslint/parser",
//     "parserOptions": {
//         "ecmaFeatures": {
//             "jsx": true
//         },
//         "ecmaVersion": "latest",
//         "sourceType": "module"
//     },
//     "plugins": [
//         "react",
//         "@typescript-eslint"
//     ],
//     "rules": {
//     }
// }
module.exports ={
    "extends" : "airbnb",
    "parser" : "babel-eslint",
    "ecmaFeatures":{
        "classes" : true
    },
    "rules" : {
        "react/jsx-filename-extension" : ["error",{"extensions":[".js",".js"]}]
        "linebreak-style" : ["error","windows"]
    }
};