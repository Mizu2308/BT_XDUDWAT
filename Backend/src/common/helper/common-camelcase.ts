function toCamel(str) {
  return str.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '');
  });
}

function isObject(obj) {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== 'function';
}

export function keysToCamel(obj) {
  if (isObject(obj)) {
    const n = {};
    if (!Object.keys(obj).length) return obj;

    Object.keys(obj).forEach((k) => {
      n[toCamel(k)] = keysToCamel(obj[k]);
    });

    return n;
  } else if (Array.isArray(obj)) {
    return obj.map((i) => {
      return keysToCamel(i);
    });
  }

  return obj;
}

export function camelize(data: string): string {
  const sData = data.split('_');
  let fData = sData.shift().toLocaleLowerCase();

  sData.forEach((i) => {
    fData += i[0].toLocaleUpperCase() + i.slice(1).toLocaleLowerCase();
  });

  return fData;
}
