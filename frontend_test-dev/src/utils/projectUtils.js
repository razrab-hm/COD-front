import { reportsApi } from './reportsApi';
import { getCookie } from './cookie';
import { authApi } from './authApi';

export const checkAuthStatus = async (
  setterUser,
  setterUserRole,
  setterLoading,
  setterUserName
) => {
  const data = {
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
  };

  if (data.accessToken && data.refreshToken) {
    setterLoading(true);
    authApi
      .authStatus(data.accessToken)
      .then((res) => {
        if (res && res.message === 'success') {
          setterUser(true);
          setterUserRole(res.role);
          setterUserName(res.username);
          setterLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setterUser(false);
        setterLoading(false);
      });
  } else {
    setterUser(false);
    setterLoading(false);
  }
};

export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; ++i) {
    if (!objectsEqual(a[i], b[i])) return false;
  }
  return true;
}

function objectsEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;

  let aProps = Object.getOwnPropertyNames(a);
  let bProps = Object.getOwnPropertyNames(b);

  if (aProps.length !== bProps.length) return false;

  for (let i = 0; i < aProps.length; i++) {
    let propName = aProps[i];
    if (a[propName] !== b[propName]) return false;
  }
  return true;
}

export function containsObject(obj, list) {
  return list.some(function (element) {
    return Object.entries(obj).every(([key, value]) => element[key] === value);
  });
}

export function truncateWord(word, maxLength) {
  if (word.length <= maxLength) {
    return word;
  }
  return word.substring(0, maxLength) + '...';
}

export const getData = (
  parameters,
  setData,
  apiMethod,
  url,
  selectedCompanies
) => {
  setData([]);
  apiMethod(parameters, url, selectedCompanies)
    .then((res) => {
      setData(res);
    })
    .catch((error) => {
      setData([]);
      console.log(error);
    });
};

export const handlReport = async (
  parameters,
  url,
  setter,
  pdf = false,
  xlsx = false
) => {
  setter([]);
  if (pdf) {
    const res = await reportsApi.getReport(parameters, url, pdf);
    if (res) {
      const blob = new Blob([res], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Report-${+new Date()}`;
      link.click();
    }
  } else if (xlsx) {
    const res = await reportsApi.getXlsxReport(parameters, url);
    let blob = await res.blob();
    if (blob) {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `Report-${+new Date()}.xls`;
      link.click();
    }
  } else {
    reportsApi
      .getReport(parameters, url)
      .then((res) => {
        setter(res);
      })
      .catch((error) => {
        setter([]);
        console.log(error);
      });
  }
};

export function removeSpaces(str) {
  return str.replace(/\s+/g, '');
}

export function romanize(num) {
  var lookup = {
      M: 1000,
      CM: 900,
      D: 500,
      CD: 400,
      C: 100,
      XC: 90,
      L: 50,
      XL: 40,
      X: 10,
      IX: 9,
      V: 5,
      IV: 4,
      I: 1,
    },
    roman = '',
    i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

export function sortByMonthName(monthNames, isReverse = false) {
  const referenceMonthNames = [
    'jan',
    'feb',
    'mar',
    'apr',
    'may',
    'jun',
    'jul',
    'aug',
    'sep',
    'oct',
    'nov',
    'dec',
  ];
  const directionFactor = isReverse ? -1 : 1;
  const comparator = (a, b) => {
    if (!a && !b) return 0;
    if (!a && b) return -1 * directionFactor;
    if (a && !b) return 1 * directionFactor;

    const comparableA = a.toLowerCase().substring(0, 3);
    const comparableB = b.toLowerCase().substring(0, 3);
    const comparisonResult =
      referenceMonthNames.indexOf(comparableA) -
      referenceMonthNames.indexOf(comparableB);
    return comparisonResult * directionFactor;
  };
  const safeCopyMonthNames = [...monthNames];
  safeCopyMonthNames.sort(comparator);
  return safeCopyMonthNames;
}

export function validateDate(from, to) {
  const isEmptyInput = from === '' || to === '';
  const currentDate = new Date().getTime();
  const fromDate = new Date(from).getTime();
  const toDate = new Date(to).getTime();
  return !isEmptyInput && fromDate <= toDate && toDate <= currentDate;
}

export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10);
}

export function errorsRegisterForm(error) {
  const options = ["username", "email", "first_name", "last_name", "description", "password"]
  const errorDetail = options.find((e) => error.toLowerCase().includes(e));
  return {
    name: errorDetail,
    message: error
  }
}
