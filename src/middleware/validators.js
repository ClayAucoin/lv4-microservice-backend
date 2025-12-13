// src/middleware/validators.js

import { config } from '../config.js'

export function validateAPIKey(req, res, next) {
  // wsk = Weather Service Key
  const wskQuery = req.query['key']
  const w_s_k = config.weather_service_key
  const wskHeaders = req.headers['x-api-key']
  // if (!wskQuery || !wskHeaders || wskQuery !== w_s_k || wskHeaders !== w_s_k) {
  // if (!wskHeaders || wskHeaders !== w_s_k) { 
  if (!wskQuery || wskQuery !== w_s_k) {
    return res.status(401).json({ message: 'Not authorized.' })
  }
  next()
}

export function validateWeatherQuery(req, res, next) {
  const errors = [];

  const { zip, date } = req.query;

  // ---- zip validation ----
  if (!zip) {
    errors.push({
      field: 'zip',
      message: 'zip is required',
      value: zip
    });
  } else if (!/^\d{5}$/.test(String(zip))) {
    errors.push({
      field: 'zip',
      message: 'zip must be a 5-digit US ZIP code',
      value: zip
    });
  }

  // ---- date validation ----
  if (!date) {
    errors.push({
      field: 'date',
      message: 'date is required (YYYY-MM-DD)',
      value: date
    });
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push({
      field: 'date',
      message: 'date must be in YYYY-MM-DD format',
      value: date
    });
  } else {
    // Break date apart
    const [yearStr, monthStr, dayStr] = date.split('-');

    const year = Number(yearStr);
    const month = Number(monthStr);
    const day = Number(dayStr);

    // Year range
    if (!Number.isInteger(year) || year < 1900 || year > 2100) {
      errors.push({
        field: 'date',
        message: 'year must be between 1900 and 2100',
        value: date
      });
    }

    // Month range
    if (!Number.isInteger(month) || month < 1 || month > 12) {
      errors.push({
        field: 'date',
        message: 'month must be between 01 and 12',
        value: date
      });
    }

    // Day range
    if (!Number.isInteger(day) || day < 1 || day > 31) {
      errors.push({
        field: 'date',
        message: 'day must be between 01 and 31',
        value: date
      });
    }

    // Calendar date validation (no Feb 30, etc.)
    if (errors.length === 0) {
      const testDate = new Date(year, month - 1, day);

      const valid =
        testDate.getFullYear() === year &&
        testDate.getMonth() === month - 1 &&
        testDate.getDate() === day;

      if (!valid) {
        errors.push({
          field: 'date',
          message: 'invalid calendar date',
          value: date
        });
      }
    }

    // Attach normalized values
    if (errors.length === 0) {
      req.weatherParams = {
        zip: String(zip),
        year,
        month,
        day,
        dateString: `${year}-${monthStr}-${dayStr}`
      };
    }
  }

  // ---- return errors if any ----
  if (errors.length > 0) {
    return res.status(422).json({
      message: 'Invalid request parameters',
      errors
    });
  }

  return next();
}
