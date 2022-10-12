import * as crypto from 'crypto';

function shuffle(array: Array<any>) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}

export const randomIndex = (string: string): Array<any> => {
  const passwordArr = [];

  for (let i = 0; i < 3; i++) {
    const newString = string[Math.floor(Math.random() * string.length)];
    passwordArr.push(newString);
  }

  return passwordArr;
};

export const generatePassword = (): string => {
  const numbers = '0123456789';
  const lowercases = 'abcdefghijklmnopqrstuvwxyz';
  const uppercases = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const passwordArr = [];
  passwordArr.push('@');
  passwordArr.push(randomIndex(numbers));
  passwordArr.push(randomIndex(lowercases));
  passwordArr.push(randomIndex(uppercases));

  const newPassword = shuffle(passwordArr).toString().replace(/,/g, '');

  return newPassword;
};

export const genTokenIdentifier = (userPassword: string) => {
  return crypto
    .createHash('sha512')
    .update(Buffer.from(userPassword, 'utf8').toString('base64'))
    .digest('hex');
};
