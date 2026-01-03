
/**
 * Core Astronomy Utilities
 * Fetches precise calculations from Netlify Functions (Swiss Ephemeris)
 */

import { DateTime } from 'luxon';

/**
 * Get Chart Data from Backend API
 * @param {object} birthDetails - { birthDate, birthTime, latitude, longitude, timezone }
 * @returns {Promise<object>} Precise chart data
 */
export async function getChartData(birthDetails) {
    try {
        // Construct API URL
        // In development (vite), proxy might be needed or full URL.
        // Netlify Functions are at /.netlify/functions/astro
        const apiUrl = '/.netlify/functions/astro';

        // Prepare payload
        const payload = {
            date: birthDetails.birthDate, // YYYY-MM-DD
            time: birthDetails.birthTime, // HH:mm
            latitude: birthDetails.latitude,
            longitude: birthDetails.longitude,
            timezone: birthDetails.timezone // e.g. "Asia/Kolkata" or calculated offset?
            // Backend expects timezone name or uses default if not provided. Use display name?
            // Better to pass latitude/longitude and let backend/luxon handle it if possible, 
            // OR use browser's timezone?
            // "Input Data Layer ... Automatic timezone detection".
            // Backend handles it via Luxon if timezone string provided.
            // If we have geocoded data, we might not have timezone string.
            // But we can approximate or use a library.
            // For now, let's pass "Asia/Kolkata" hardcoded if user is in India?
            // The prompt says "City -> lat/lon ... Automatic timezone". 
            // The previous code had `getTimezoneFromCoordinates`.
            // We can reuse that or keep it client side.
        };

        const response = await fetch(apiUrl, {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error || 'Failed to fetch chart data');
        }

        const data = await response.json();

        // Transform API response to App format
        return {
            planets: data.planets,
            lagna: data.ascendant,
            ayanamsa: data.ayanamsa,
            d9: data.d9,
            houses: data.houses,
            jd: data.meta.jd
        };

    } catch (err) {
        console.error("API Error:", err);
        throw err;
    }
}

/**
 * Get timezone from coordinates (Simplified Client Side)
 * @param {number} lat 
 * @param {number} lon 
 * @returns {string} Timezone IANA string
 */
export function getTimezoneFromCoordinates(lat, lon) {
    if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) return "Asia/Kolkata";
    if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) return "America/New_York";
    return "UTC"; // Default
}
