/**
 * Divisional Charts (Vargas) Calculations
 * D1, D9, D10, D12, D60
 */

/**
 * Calculate Navamsa (D9) position
 * Each sign (30°) is divided into 9 parts (3° 20' each)
 * @param {number} longitude - Planet's longitude in degrees
 * @returns {number} Navamsa longitude
 */
export function getNavamsa(longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const navamsaPart = Math.floor(degreeInSign / (30 / 9)); // 0-8

    let navamsaSign;

    // Movable signs: Aries, Cancer, Libra, Capricorn (0, 3, 6, 9)
    if (signIndex % 3 === 0) {
        navamsaSign = (signIndex + navamsaPart) % 12;
    }
    // Fixed signs: Taurus, Leo, Scorpio, Aquarius (1, 4, 7, 10)
    else if (signIndex % 3 === 1) {
        navamsaSign = ((signIndex + 8) + navamsaPart) % 12;
    }
    // Dual signs: Gemini, Virgo, Sagittarius, Pisces (2, 5, 8, 11)
    else {
        navamsaSign = ((signIndex + 4) + navamsaPart) % 12;
    }

    // Calculate degree within navamsa sign
    const navamsaDegree = (degreeInSign % (30 / 9)) * 9;
    const navamsaLongitude = navamsaSign * 30 + navamsaDegree;

    return navamsaLongitude;
}

/**
 * Calculate Dasamsa (D10) position - Career chart
 * Each sign (30°) is divided into 10 parts (3° each)
 * @param {number} longitude - Planet's longitude in degrees
 * @returns {number} Dasamsa longitude
 */
export function getDasamsa(longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const dasamsaPart = Math.floor(degreeInSign / 3); // 0-9

    let dasamsaSign;

    // Odd signs (0, 2, 4, 6, 8, 10)
    if (signIndex % 2 === 0) {
        dasamsaSign = (signIndex + dasamsaPart) % 12;
    }
    // Even signs (1, 3, 5, 7, 9, 11)
    else {
        dasamsaSign = ((signIndex + 8) + dasamsaPart) % 12;
    }

    const dasamsaDegree = (degreeInSign % 3) * 10;
    const dasamsaLongitude = dasamsaSign * 30 + dasamsaDegree;

    return dasamsaLongitude;
}

/**
 * Calculate Dvadasamsa (D12) position - Parents chart
 * Each sign (30°) is divided into 12 parts (2.5° each)
 * @param {number} longitude - Planet's longitude in degrees
 * @returns {number} Dvadasamsa longitude
 */
export function getDvadasamsa(longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const dvadasamsaPart = Math.floor(degreeInSign / 2.5); // 0-11

    const dvadasamsaSign = (signIndex + dvadasamsaPart) % 12;
    const dvadasamsaDegree = (degreeInSign % 2.5) * 12;
    const dvadasamsaLongitude = dvadasamsaSign * 30 + dvadasamsaDegree;

    return dvadasamsaLongitude;
}

/**
 * Calculate Shastiamsa (D60) position - Karma chart
 * Each sign (30°) is divided into 60 parts (0.5° each)
 * @param {number} longitude - Planet's longitude in degrees
 * @returns {number} Shastiamsa longitude
 */
export function getShastiamsa(longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;
    const shastiamsaPart = Math.floor(degreeInSign / 0.5); // 0-59

    let shastiamsaSign;

    // Odd signs
    if (signIndex % 2 === 0) {
        shastiamsaSign = (signIndex + shastiamsaPart) % 12;
    }
    // Even signs
    else {
        shastiamsaSign = ((signIndex + 6) + shastiamsaPart) % 12;
    }

    const shastiamsaDegree = (degreeInSign % 0.5) * 60;
    const shastiamsaLongitude = shastiamsaSign * 30 + shastiamsaDegree;

    return shastiamsaLongitude;
}

/**
 * Calculate all divisional charts for all planets
 * @param {object} planets - Planetary positions (D1)
 * @returns {object} All divisional charts
 */
export function calculateAllDivisionalCharts(planets) {
    const charts = {
        D1: planets, // Rasi chart (birth chart)
        D9: {},      // Navamsa
        D10: {},     // Dasamsa
        D12: {},     // Dvadasamsa
        D60: {}      // Shastiamsa
    };

    for (const [planetName, data] of Object.entries(planets)) {
        charts.D9[planetName] = {
            longitude: getNavamsa(data.longitude)
        };

        charts.D10[planetName] = {
            longitude: getDasamsa(data.longitude)
        };

        charts.D12[planetName] = {
            longitude: getDvadasamsa(data.longitude)
        };

        charts.D60[planetName] = {
            longitude: getShastiamsa(data.longitude)
        };
    }

    return charts;
}
