## eslint-plugin-huoli

### useage

Add `plugin:huoli/recommended` in your eslint config file eg(.eslintrc.js):

````
module.exports = {
  ...
  "extends": [
    ...
    "plugin:huoli/recommended"
  ],
};

````

### rule one
refuse use location jump.
````
'no-location-jump': 'error'
````



