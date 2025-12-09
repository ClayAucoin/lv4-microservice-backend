// src/middleware/validators.js

export function validateWeatherQuery(req, res, next) {
  const errors = [];

  const { zip, year, month, day } = req.query;

  // ---- zip validation ----
  if (zip == null || zip === '') {
    errors.push({
      field: 'zip',
      message: 'zip is required',
      value: zip
    });
  } else if (!/^\d{5}$/.test(String(zip))) {
    errors.push({
      field: 'zip',
      message: 'zip must be a 7-digit number',
      value: zip
    });
  }


  // ---- year validation ----
  const yearNum = Number(year);
  if (year == null || year === '') {
    errors.push({
      field: 'year',
      message: 'year is required',
      value: year
    });
  } else if (!Number.isInteger(yearNum)) {
    errors.push({
      field: 'year',
      message: 'year must be an integer',
      value: year
    });
  } else if (yearNum < 1900 || yearNum > 2100) {
    errors.push({
      field: 'year',
      message: 'year must be between 1900 and 2100',
      value: year
    });
  }

  // ---- month validation ----
  const monthNum = Number(month);
  if (month == null || month === '') {
    errors.push({
      field: 'month',
      message: 'month is required',
      value: month
    });
  } else if (!Number.isInteger(monthNum)) {
    errors.push({
      field: 'month',
      message: 'month must be an integer',
      value: month
    });
  } else if (monthNum < 1 || monthNum > 12) {
    errors.push({
      field: 'month',
      message: 'month must be between 1 and 12',
      value: month
    });
  }

  // ---- day validation ----
  const dayNum = Number(day);
  if (day == null || day === '') {
    errors.push({
      field: 'day',
      message: 'day is required',
      value: day
    });
  } else if (!Number.isInteger(dayNum)) {
    errors.push({
      field: 'day',
      message: 'day must be an integer',
      value: day
    });
  } else if (dayNum < 1 || dayNum > 31) {
    errors.push({
      field: 'day',
      message: 'day must be between 1 and 31',
      value: day
    });
  }

  // ---- calendar date validation (e.g. no Feb 30) ----
  if (yearNum && monthNum && dayNum) {
    if (Number.isInteger(yearNum) && Number.isInteger(monthNum) && Number.isInteger(dayNum)) {
      const testDate = new Date(yearNum, monthNum - 1, dayNum);

      const valid =
        testDate.getFullYear() === yearNum &&
        testDate.getMonth() === monthNum - 1 &&
        testDate.getDate() === dayNum;

      if (!valid) {
        errors.push({
          field: 'date',
          message: 'Invalid calendar date',
          value: `${year}-${month}-${day}`
        });
      }
    }
  }

  // ---- if any errors, return 422 ----
  if (errors.length > 0) {
    return res.status(422).json({
      message: 'Invalid request parameters',
      errors
    });
  }

  // ---- attach cleaned values for downstream code ----
  req.weatherParams = {
    zip: String(zip),
    year: yearNum,
    month: monthNum,
    day: dayNum,
    dateString: `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
  };

  return next();
}
