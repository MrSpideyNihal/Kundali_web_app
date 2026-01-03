/**
 * Astrology Utilities
 * Vedic astrology calculations including signs, houses, and formatting
 */

/**
 * Zodiac signs in order
 */
export const SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
];

export const SIGNS_HINDI = [
    "मेष", "वृषभ", "मिथुन", "कर्क", "सिंह", "कन्या",
    "तुला", "वृश्चिक", "धनु", "मकर", "कुंभ", "मीन"
];

/**
 * Get sign information from longitude
 * @param {number} longitude - Longitude in degrees (0-360)
 * @returns {object} Sign information
 */
export function getSign(longitude) {
    const signIndex = Math.floor(longitude / 30);
    const degreeInSign = longitude % 30;

    return {
        sign: SIGNS[signIndex],
        signHindi: SIGNS_HINDI[signIndex],
        signIndex: signIndex,
        degree: degreeInSign,
        minutes: Math.floor((degreeInSign % 1) * 60),
        seconds: Math.floor(((degreeInSign % 1) * 60 % 1) * 60)
    };
}

/**
 * Get house number for a planet
 * Uses Whole Sign House system
 * @param {number} planetLongitude - Planet's longitude
 * @param {number} lagnaLongitude - Lagna (Ascendant) longitude
 * @returns {number} House number (1-12)
 */
export function getHouse(planetLongitude, lagnaLongitude) {
    const planetSign = Math.floor(planetLongitude / 30);
    const lagnaSign = Math.floor(lagnaLongitude / 30);

    // House number (1-12)
    const house = ((planetSign - lagnaSign + 12) % 12) + 1;

    return house;
}

/**
 * Format degree in traditional notation
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Formatted string (e.g., "Leo 15° 30'")
 */
export function formatDegree(longitude, useHindi = false) {
    const { sign, signHindi, degree, minutes } = getSign(longitude);
    const displaySign = useHindi ? signHindi : sign;

    return `${displaySign} ${Math.floor(degree)}° ${minutes}'`;
}

/**
 * Format degree with seconds
 * @param {number} longitude - Longitude in degrees
 * @returns {string} Formatted string with seconds
 */
export function formatDegreeDetailed(longitude, useHindi = false) {
    const { sign, signHindi, degree, minutes, seconds } = getSign(longitude);
    const displaySign = useHindi ? signHindi : sign;

    return `${displaySign} ${Math.floor(degree)}° ${minutes}' ${seconds}"`;
}

/**
 * Get planets in each house
 * @param {object} planets - Planetary positions
 * @param {number} lagna - Lagna longitude
 * @returns {object} Houses with planets
 */
export function getPlanetsInHouses(planets, lagna) {
    const houses = {};

    // Initialize all houses
    for (let i = 1; i <= 12; i++) {
        houses[i] = [];
    }

    // Assign planets to houses
    for (const [planetName, data] of Object.entries(planets)) {
        const house = getHouse(data.longitude, lagna);
        houses[house].push({
            name: planetName,
            longitude: data.longitude,
            ...getSign(data.longitude)
        });
    }

    return houses;
}

/**
 * Get sign lord (ruler)
 * @param {number} signIndex - Sign index (0-11)
 * @returns {string} Planet name
 */
export function getSignLord(signIndex) {
    const lords = [
        "Mars",    // Aries
        "Venus",   // Taurus
        "Mercury", // Gemini
        "Moon",    // Cancer
        "Sun",     // Leo
        "Mercury", // Virgo
        "Venus",   // Libra
        "Mars",    // Scorpio
        "Jupiter", // Sagittarius
        "Saturn",  // Capricorn
        "Saturn",  // Aquarius
        "Jupiter"  // Pisces
    ];

    return lords[signIndex];
}

/**
 * Get planet's natural benefic/malefic status
 * @param {string} planetName - Planet name
 * @returns {string} "Benefic" or "Malefic"
 */
export function getPlanetNature(planetName) {
    const benefics = ["Jupiter", "Venus", "Moon", "Mercury"];
    const malefics = ["Saturn", "Mars", "Sun", "Rahu", "Ketu"];

    if (benefics.includes(planetName)) return "Benefic";
    if (malefics.includes(planetName)) return "Malefic";
    return "Neutral";
}

/**
 * Check if planet is retrograde (simplified)
 * Note: Requires speed data from ephemeris
 * @param {object} planetData - Planet data with speed
 * @returns {boolean} True if retrograde
 */
export function isRetrograde(planetData) {
    return planetData.speed && planetData.speed < 0;
}
