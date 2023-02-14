const babelOpts = {
  sourceType: 'unambiguous'
}

module.exports = {
  babelOpts,
  get,
  isLocObj,
}

function getIn(target, keyPath, notFoundValue = undefined) {
  let key;
  for (let i = 0; i < keyPath.length; i++) {
    key = keyPath[i];
    // eslint-disable-next-line no-prototype-builtins
    if (target && target.hasOwnProperty(key)) {
      target = target[key];
    } else {
      return notFoundValue;
    }
  }

  return target;
}

function get(target, keyPathStr, notFoundValue = undefined) {
  return getIn(target, keyPathStr.split('.'), notFoundValue);
}

function isLocObj(object) {
  // location
  // window.location
  // document.location
  const locObj = get(object, 'name') === 'location'
  const windowLocObj = ['window', 'document'].indexOf(get(object, 'object.name')) >= 0 && get(object, 'property.name') === 'location'
  return locObj || windowLocObj
}

