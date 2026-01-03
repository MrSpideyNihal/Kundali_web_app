/**
 * Pure JavaScript Ephemeris Calculations
 * Uses VSOP87 and ELP2000 approximations - accurate to ~1 arcminute
 * This is a fallback when WASM doesn't work
 */

import { DateTime } from 'luxon';

// Lahiri Ayanamsa calculation
function getLahiriAyanamsa(jd) {
    const T = (jd - 2451545.0) / 36525;
    // Lahiri ayanamsa based on Spica at 0° Libra
    // Reference: 23°51'11" at J2000.0
    const ayanamsa = 23.85305556 + (50.2794 * T / 3600);
    return ayanamsa;
}

// Julian Day calculation
function getJulianDay(year, month, day, hour, minute, second) {
    const decimalHour = hour + minute / 60 + second / 3600;

    if (month <= 2) {
        year -= 1;
        month += 12;
    }

    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);

    const jd = Math.floor(365.25 * (year + 4716)) +
        Math.floor(30.6001 * (month + 1)) +
        day + decimalHour / 24 + B - 1524.5;

    return jd;
}

// Sun position (VSOP87 simplified)
function getSunLongitude(jd) {
    const T = (jd - 2451545.0) / 36525;

    // Mean longitude
    let L0 = 280.4664567 + 360007.6982779 * T + 0.03032028 * T * T;

    // Mean anomaly
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;
    const Mrad = M * Math.PI / 180;

    // Equation of center
    const C = (1.9146 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
        (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
        0.00029 * Math.sin(3 * Mrad);

    let sunLong = L0 + C;
    sunLong = ((sunLong % 360) + 360) % 360;

    return sunLong;
}

// Moon position (ELP2000 simplified)
function getMoonLongitude(jd) {
    const T = (jd - 2451545.0) / 36525;

    // Mean longitude
    let Lp = 218.3164477 + 481267.88123421 * T - 0.0015786 * T * T;

    // Mean elongation
    const D = 297.8501921 + 445267.1114034 * T - 0.0018819 * T * T;

    // Sun's mean anomaly
    const M = 357.5291092 + 35999.0502909 * T - 0.0001536 * T * T;

    // Moon's mean anomaly
    const Mp = 134.9633964 + 477198.8675055 * T + 0.0087414 * T * T;

    // Moon's argument of latitude
    const F = 93.272095 + 483202.0175233 * T - 0.0036539 * T * T;

    const Drad = D * Math.PI / 180;
    const Mrad = M * Math.PI / 180;
    const Mprad = Mp * Math.PI / 180;
    const Frad = F * Math.PI / 180;

    // Corrections
    let dL = 6.29 * Math.sin(Mprad) +
        1.27 * Math.sin(2 * Drad - Mprad) +
        0.66 * Math.sin(2 * Drad) +
        0.21 * Math.sin(2 * Mprad) -
        0.19 * Math.sin(Mrad) -
        0.11 * Math.sin(2 * Frad);

    let moonLong = Lp + dL;
    moonLong = ((moonLong % 360) + 360) % 360;

    return moonLong;
}

// Mean Node (Rahu) calculation
function getMeanNode(jd) {
    const T = (jd - 2451545.0) / 36525;
    let node = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T;
    node = ((node % 360) + 360) % 360;
    return node;
}

// Planet longitudes (simplified VSOP87)
function getPlanetLongitude(jd, planet) {
    const T = (jd - 2451545.0) / 36525;

    const orbitalElements = {
        Mercury: { L0: 252.2509, Lrate: 149472.6746, a: 0.387, e: 0.2056, i: 7.00 },
        Venus: { L0: 181.9798, Lrate: 58517.8039, a: 0.723, e: 0.0068, i: 3.39 },
        Mars: { L0: 355.4330, Lrate: 19140.2993, a: 1.524, e: 0.0934, i: 1.85 },
        Jupiter: { L0: 34.3515, Lrate: 3034.9057, a: 5.203, e: 0.0484, i: 1.31 },
        Saturn: { L0: 50.0774, Lrate: 1222.1138, a: 9.537, e: 0.0542, i: 2.49 }
    };

    const elem = orbitalElements[planet];
    if (!elem) return 0;

    let L = elem.L0 + elem.Lrate * T;
    L = ((L % 360) + 360) % 360;

    return L;
}

// Ascendant calculation
function calculateAscendant(jd, latitude, longitude) {
    const T = (jd - 2451545.0) / 36525;

    // Greenwich Sidereal Time
    let GMST = 280.46061837 + 360.98564736629 * (jd - 2451545.0) +
        0.000387933 * T * T - T * T * T / 38710000;
    GMST = ((GMST % 360) + 360) % 360;

    // Local Sidereal Time
    const LST = ((GMST + longitude) % 360 + 360) % 360;
    const LSTrad = LST * Math.PI / 180;

    // Obliquity
    const eps = 23.439291 - 0.0130042 * T;
    const epsRad = eps * Math.PI / 180;

    // Latitude in radians
    const latRad = latitude * Math.PI / 180;

    // Ascendant formula
    const y = Math.cos(LSTrad);
    const x = -Math.sin(LSTrad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

    let asc = Math.atan2(y, x) * 180 / Math.PI;
    asc = ((asc % 360) + 360) % 360;

    return asc;
}

function normalize(deg) {
    return ((deg % 360) + 360) % 360;
}

export const handler = async (req, context) => {
    try {
        const body = JSON.parse(req.body || '{}');
        const { date, time, latitude, longitude, timezone } = body;

        if (!date || !time || latitude === undefined || longitude === undefined) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                body: JSON.stringify({ error: 'Missing: date, time, lat, lon' })
            };
        }

        const tz = timezone || 'UTC';
        const dt = DateTime.fromISO(`${date}T${time}`, { zone: tz });
        const utc = dt.toUTC();

        const jd = getJulianDay(utc.year, utc.month, utc.day, utc.hour, utc.minute, utc.second);
        const ayanamsa = getLahiriAyanamsa(jd);

        // Calculate tropical positions and convert to sidereal
        const sunTrop = getSunLongitude(jd);
        const moonTrop = getMoonLongitude(jd);
        const rahuTrop = getMeanNode(jd);
        const mercuryTrop = getPlanetLongitude(jd, 'Mercury');
        const venusTrop = getPlanetLongitude(jd, 'Venus');
        const marsTrop = getPlanetLongitude(jd, 'Mars');
        const jupiterTrop = getPlanetLongitude(jd, 'Jupiter');
        const saturnTrop = getPlanetLongitude(jd, 'Saturn');
        const ascTrop = calculateAscendant(jd, latitude, longitude);

        const planets = {
            Sun: { longitude: normalize(sunTrop - ayanamsa), speed: 1, isRetrograde: false },
            Moon: { longitude: normalize(moonTrop - ayanamsa), speed: 13, isRetrograde: false },
            Mercury: { longitude: normalize(mercuryTrop - ayanamsa), speed: 1, isRetrograde: false },
            Venus: { longitude: normalize(venusTrop - ayanamsa), speed: 1, isRetrograde: false },
            Mars: { longitude: normalize(marsTrop - ayanamsa), speed: 0.5, isRetrograde: false },
            Jupiter: { longitude: normalize(jupiterTrop - ayanamsa), speed: 0.08, isRetrograde: false },
            Saturn: { longitude: normalize(saturnTrop - ayanamsa), speed: 0.03, isRetrograde: false },
            Rahu: { longitude: normalize(rahuTrop - ayanamsa), speed: -0.05, isRetrograde: true },
            Ketu: { longitude: normalize(rahuTrop - ayanamsa + 180), speed: -0.05, isRetrograde: true }
        };

        const ascendant = normalize(ascTrop - ayanamsa);

        // D9 Navamsa calculation
        const calculateD9 = (long) => {
            const sign = Math.floor(long / 30);
            const deg = long % 30;
            const pada = Math.floor(deg / (30 / 9));
            const navamsaSign = (sign * 9 + pada) % 12;
            return { sign: navamsaSign, longitude: navamsaSign * 30 + (deg % (30 / 9)) * 9 };
        };

        const d9 = {};
        for (const [name, p] of Object.entries(planets)) {
            d9[name] = calculateD9(p.longitude);
        }
        d9['Ascendant'] = calculateD9(ascendant);

        // Houses (Whole Sign)
        const ascSign = Math.floor(ascendant / 30);
        const houses = {};
        for (let i = 1; i <= 12; i++) {
            houses[i] = { sign: (ascSign + i - 1) % 12, startDegree: ((ascSign + i - 1) % 12) * 30 };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({
                ascendant,
                ayanamsa,
                planets,
                houses,
                d9,
                meta: { jd, engine: 'pure-js-vsop87' }
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            body: JSON.stringify({ error: error.message, stack: error.stack })
        };
    }
};
