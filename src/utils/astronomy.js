/**
 * Core Astronomy Utilities
 * Implements astronomical calculations for Vedic Kundali system
 * Based on Swiss Ephemeris algorithms and Jean Meeus formulas
 */

import moment from 'moment-timezone';

/**
 * Convert Gregorian date to Julian Day Number
 * @param {number} year - Year
 * @param {number} month - Month (1-12)
 * @param {number} day - Day
 * @param {number} hour - Hour (0-23)
 * @param {number} minute - Minute (0-59)
 * @param {number} second - Second (0-59)
 * @returns {number} Julian Day Number
 */
export function getJulianDay(year, month, day, hour = 0, minute = 0, second = 0) {
    // Ensure month is 1-12
    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const JD = Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day + B - 1524.5;

    const dayFraction = (hour + minute / 60 + second / 3600) / 24;

    return JD + dayFraction;
}

/**
 * Convert local time to UTC using timezone
 * @param {string} localDateTime - Local date time string "YYYY-MM-DD HH:mm:ss"
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {object} UTC datetime and timezone info
 */
export function convertToUTC(localDateTime, latitude, longitude) {
    // For simplicity, we'll use a basic timezone lookup
    // In production, use tz-lookup library
    const timezone = getTimezoneFromCoordinates(latitude, longitude);

    const localMoment = moment.tz(localDateTime, "YYYY-MM-DD HH:mm:ss", timezone);
    const utcMoment = localMoment.utc();

    return {
        utcDateTime: utcMoment.format("YYYY-MM-DD HH:mm:ss"),
        utcDate: utcMoment.toDate(),
        timezone: timezone,
        offset: localMoment.utcOffset() / 60,
        year: utcMoment.year(),
        month: utcMoment.month() + 1,
        day: utcMoment.date(),
        hour: utcMoment.hour(),
        minute: utcMoment.minute(),
        second: utcMoment.second()
    };
}

/**
 * Get timezone from coordinates
 * Simplified version - in production use tz-lookup library
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {string} Timezone name
 */
export function getTimezoneFromCoordinates(lat, lon) {
    // Simplified timezone mapping for common regions
    // In production, use tz-lookup library
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
        return "Asia/Kolkata"; // India
    } else if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
        return "America/New_York"; // USA East
    } else if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -100) {
        return "America/Los_Angeles"; // USA West
    } else if (lat >= 51 && lat <= 55 && lon >= -1 && lon <= 2) {
        return "Europe/London"; // UK
    }

    // Default to UTC
    return "UTC";
}

/**
 * Calculate Local Sidereal Time
 * @param {number} jd - Julian Day
 * @param {number} longitude - Observer longitude in degrees
 * @returns {number} Local Sidereal Time in degrees
 */
export function getLocalSiderealTime(jd, longitude) {
    // Number of centuries since J2000.0
    const T = (jd - 2451545.0) / 36525;

    // Greenwich Sidereal Time at 0h UT (in degrees)
    const GST0 = 280.46061837 +
        360.98564736629 * (jd - 2451545.0) +
        0.000387933 * T * T -
        (T * T * T) / 38710000;

    // Normalize to 0-360
    const GST0_normalized = ((GST0 % 360) + 360) % 360;

    // Local Sidereal Time = GST + Longitude
    const LST = ((GST0_normalized + longitude) % 360 + 360) % 360;

    return LST;
}

/**
 * Calculate Ascendant (Lagna)
 * @param {number} LST_degrees - Local Sidereal Time in degrees
 * @param {number} latitude - Observer latitude in degrees
 * @returns {number} Tropical Ascendant in degrees
 */
export function calculateAscendant(LST_degrees, latitude) {
    const LST_radians = LST_degrees * Math.PI / 180;
    const lat_radians = latitude * Math.PI / 180;

    // Mean obliquity of ecliptic (approximate for current era)
    const epsilon = 23.4393;
    const epsilon_radians = epsilon * Math.PI / 180;

    // Formula: tan(Ascendant) = cos(LST) / (-sin(LST) * cos(epsilon) - tan(latitude) * sin(epsilon))
    const numerator = Math.cos(LST_radians);
    const denominator = -Math.sin(LST_radians) * Math.cos(epsilon_radians) -
        Math.tan(lat_radians) * Math.sin(epsilon_radians);

    let ascendant_radians = Math.atan2(numerator, denominator);
    let ascendant_degrees = ascendant_radians * 180 / Math.PI;

    // Normalize to 0-360
    ascendant_degrees = ((ascendant_degrees % 360) + 360) % 360;

    return ascendant_degrees;
}

/**
 * Calculate Lahiri Ayanamsa for a given Julian Day
 * Reference: 1950-01-01 00:00 UT, ayanamsa = 23° 15' 00" (23.25°)
 * Rate: ~50.3 arc-seconds per year
 * @param {number} jd - Julian Day
 * @returns {number} Lahiri Ayanamsa in degrees
 */
export function getLahiriAyanamsa(jd) {
    // Reference Julian Day for 1950-01-01 00:00 UT
    const jd1950 = 2433282.5;

    // Reference ayanamsa value
    const ayanamsa1950 = 23.25; // degrees

    // Rate of change (degrees per day)
    const rate = 50.3 / (365.25 * 3600); // arc-seconds to degrees per day

    // Calculate ayanamsa for given JD
    const ayanamsa = ayanamsa1950 + (jd - jd1950) * rate;

    return ayanamsa;
}

/**
 * Calculate planetary positions using simplified VSOP87 approximations
 * Note: For production, use Swiss Ephemeris or JPL DE ephemeris
 * This is a simplified implementation for demonstration
 * @param {number} jd - Julian Day
 * @returns {object} Planetary positions (tropical longitudes)
 */
export function getPlanetaryPositions(jd) {
    const T = (jd - 2451545.0) / 36525; // Julian centuries from J2000.0

    // Simplified planetary position calculations
    // These are approximations - for production use Swiss Ephemeris

    const positions = {
        Sun: calculateSunPosition(T),
        Moon: calculateMoonPosition(T),
        Mars: calculateMarsPosition(T),
        Mercury: calculateMercuryPosition(T),
        Jupiter: calculateJupiterPosition(T),
        Venus: calculateVenusPosition(T),
        Saturn: calculateSaturnPosition(T),
        Rahu: calculateRahuPosition(T)
    };

    // Ketu is always 180° opposite to Rahu
    positions.Ketu = {
        longitude: (positions.Rahu.longitude + 180) % 360,
        latitude: -positions.Rahu.latitude
    };

    return positions;
}

/**
 * Calculate Sun's position (simplified)
 * @param {number} T - Julian centuries from J2000.0
 * @returns {object} Sun's position
 */
function calculateSunPosition(T) {
    // Mean longitude
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;

    // Mean anomaly
    const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
    const M_rad = M * Math.PI / 180;

    // Equation of center
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M_rad) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * M_rad) +
        0.000289 * Math.sin(3 * M_rad);

    // True longitude
    const longitude = ((L0 + C) % 360 + 360) % 360;

    return {
        longitude: longitude,
        latitude: 0
    };
}

/**
 * Calculate Moon's position (simplified)
 * @param {number} T - Julian centuries from J2000.0
 * @returns {object} Moon's position
 */
function calculateMoonPosition(T) {
    // Mean longitude
    const L = 218.3164477 + 481267.88123421 * T;

    // Mean elongation
    const D = 297.8501921 + 445267.1114034 * T;
    const D_rad = D * Math.PI / 180;

    // Mean anomaly of Moon
    const M = 134.9633964 + 477198.8675055 * T;
    const M_rad = M * Math.PI / 180;

    // Mean anomaly of Sun
    const M_sun = 357.5291092 + 35999.0502909 * T;
    const M_sun_rad = M_sun * Math.PI / 180;

    // Simplified longitude calculation
    const longitude = L +
        6.288774 * Math.sin(M_rad) +
        1.274027 * Math.sin(2 * D_rad - M_rad) +
        0.658314 * Math.sin(2 * D_rad);

    // Simplified latitude
    const F = 93.2720950 + 483202.0175233 * T;
    const F_rad = F * Math.PI / 180;
    const latitude = 5.128122 * Math.sin(F_rad);

    return {
        longitude: ((longitude % 360) + 360) % 360,
        latitude: latitude
    };
}

/**
 * Calculate Mars position (simplified)
 */
function calculateMarsPosition(T) {
    const L = 355.433 + 19140.30 * T;
    const longitude = ((L % 360) + 360) % 360;
    return { longitude, latitude: 0 };
}

/**
 * Calculate Mercury position (simplified)
 */
function calculateMercuryPosition(T) {
    const L = 252.250 + 149472.68 * T;
    const longitude = ((L % 360) + 360) % 360;
    return { longitude, latitude: 0 };
}

/**
 * Calculate Jupiter position (simplified)
 */
function calculateJupiterPosition(T) {
    const L = 34.351 + 3034.906 * T;
    const longitude = ((L % 360) + 360) % 360;
    return { longitude, latitude: 0 };
}

/**
 * Calculate Venus position (simplified)
 */
function calculateVenusPosition(T) {
    const L = 181.979 + 58517.82 * T;
    const longitude = ((L % 360) + 360) % 360;
    return { longitude, latitude: 0 };
}

/**
 * Calculate Saturn position (simplified)
 */
function calculateSaturnPosition(T) {
    const L = 50.078 + 1222.114 * T;
    const longitude = ((L % 360) + 360) % 360;
    return { longitude, latitude: 0 };
}

/**
 * Calculate Rahu (True Node) position
 */
function calculateRahuPosition(T) {
    // Mean longitude of ascending node
    const omega = 125.04452 - 1934.136261 * T;
    const longitude = ((omega % 360) + 360) % 360;

    return {
        longitude: longitude,
        latitude: 0
    };
}

/**
 * Convert tropical positions to sidereal using Lahiri ayanamsa
 * @param {object} tropicalPositions - Planetary positions in tropical zodiac
 * @param {number} ayanamsa - Lahiri ayanamsa in degrees
 * @returns {object} Sidereal positions
 */
export function convertToSidereal(tropicalPositions, ayanamsa) {
    const siderealPositions = {};

    for (const [planet, data] of Object.entries(tropicalPositions)) {
        siderealPositions[planet] = {
            ...data,
            longitude: ((data.longitude - ayanamsa) % 360 + 360) % 360
        };
    }

    return siderealPositions;
}

/**
 * Get sidereal Lagna (Ascendant)
 * @param {number} jd - Julian Day
 * @param {number} latitude - Observer latitude
 * @param {number} longitude - Observer longitude
 * @returns {number} Sidereal Lagna in degrees
 */
export function getSiderealLagna(jd, latitude, longitude) {
    const LST = getLocalSiderealTime(jd, longitude);
    const tropicalLagna = calculateAscendant(LST, latitude);
    const ayanamsa = getLahiriAyanamsa(jd);
    const siderealLagna = ((tropicalLagna - ayanamsa) % 360 + 360) % 360;

    return siderealLagna;
}
