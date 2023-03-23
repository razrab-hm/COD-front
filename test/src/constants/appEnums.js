const ROUTES = {
  REGISTER: '/register',
  LOGIN: '/login',
  MAIN: '/main',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_USERS_ID: '/admin/users/:id',
  ADMIN_COMPANIES: '/admin/companies',
  ADMIN_UPLOAD: '/admin/upload',
  INACTIVE: '/inactive'
};

const ROLE = {
  SUPERADMIN: "root",
  ADMIN: "admin",
  MANAGER: "manager"
};


const API_ROUTES = {
  AUTH_LOGIN: "/users/login",
  AUTH_REGISTER: '/users',
  AUTH_STATUS: '/tokens',
  AUTH_LOGOUT: "/users/logout",
  DATES: '/reports/dates',
  REFRESH_TOKEN: '/tokens/refresh',
  MONTH_DAY: '/reports/month_day',
  QUARTER_MONTH: '/reports/quarter_month',
  QUARTE_MONTH_DAY: '/reports/quarter_month_day',
  YEAR_QUARTER_MONTH: '/reports/year_quarter_month',
  YEAR_QUARTER: '/reports/year_quarter',
  YEAR_QUARTER_MONTH_DAY: '/reports/year_quarter_month_day',
  USERS: '/users/',
  USERS_COMPANIES: '/users/companies/',
  USERS_COMPANIES_EMPTY: '/users?companies_id=-1',
  // USERS_UPDATE_COMPANIES: '/users/update_companies',
  COMPANIES: '/companies',
  COMPANIES_COMPANY: '/companies/company/',
  COMPANIES_UPDATE_USERS: '/companies/update_users',
  COMPANIES_ME: '/companies/me',
  COMPANIES_USER: '/companies/user/',
  UPLOAD: '/hashrates/import/',
  ADMIN_NEW_USER: '/users/new',
  DELETE_DATA: '/hashrates/company/',
  USERS_ADD_COMPANY: '/users/add_company',
  USERS_REMOVE_COMPANY: '/users/remove_company'
}

const QUARTERS = {
  1: 'January, February, March',
  2: 'April, May, June',
  3: 'July, August, September',
  4: 'October, November, December'
}

const now = new Date();

const DATES = {
  CURRENT_YEAR: now.getFullYear(),
  CURRENT_MONTH: now.getMonth() + 1,
  CURRENT_QUARTER: Math.floor((now.getMonth() + 3) / 3),
  CURRENT_DAY: now.getDay()
};

const USAGE = {
  USERS: 'user',
  COMPANIES: 'company',
};

const TOASTER = {
  SUCCESS_ADD_USER: {
    label: 'User successfully created',
  },
  SUCCESS_ADD_COMPANY: {
    label: 'Company successfully created',
  },
  SUCCESS_UPDATE_COMPANY: {
    label: 'Company successfully updated',
  },
  SUCCESS_UPDATE_USER: {
    label: 'User successfully updated',
  },
  SUCCESS_DELETE_DATA: {
    label: 'Deleted successfully',
  },
  FAIL: {
    label: 'Something went wrong...',
  },
  SUCCESS_UPLOAD_FILE: {
    label: 'File successfully uploaded',
  },
  SUCCESS_STYLE: {
    color: 'green'
  },
  FAIL_STYLE: {
    color: 'red'
  }
};

const ENUMS = {
  ROUTES,
  ROLE,
  API_ROUTES,
  QUARTERS,
  DATES,
  USAGE,
  TOASTER
};

export default ENUMS;