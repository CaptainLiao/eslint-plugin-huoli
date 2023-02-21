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
'huoli/no-location-jump': 'error'
````
**disable rule**
````
/* eslint-disable huoli/no-location-jump */
````



