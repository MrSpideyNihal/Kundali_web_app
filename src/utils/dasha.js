/**
 * Vimshottari Dasha Calculations
 * 120-year cycle based on Moon's Nakshatra position
 */

/**
 * 27 Nakshatras with their lords and periods
 */
export const NAKSHATRAS = [
    { name: "Ashwini", nameHindi: "अश्विनी", lord: "Ketu", years: 7 },
    { name: "Bharani", nameHindi: "भरणी", lord: "Venus", years: 20 },
    { name: "Krittika", nameHindi: "कृत्तिका", lord: "Sun", years: 6 },
    { name: "Rohini", nameHindi: "रोहिणी", lord: "Moon", years: 10 },
    { name: "Mrigashira", nameHindi: "मृगशिरा", lord: "Mars", years: 7 },
    { name: "Ardra", nameHindi: "आर्द्रा", lord: "Rahu", years: 18 },
    { name: "Punarvasu", nameHindi: "पुनर्वसु", lord: "Jupiter", years: 16 },
    { name: "Pushya", nameHindi: "पुष्य", lord: "Saturn", years: 19 },
    { name: "Ashlesha", nameHindi: "आश्लेषा", lord: "Mercury", years: 17 },
    { name: "Magha", nameHindi: "मघा", lord: "Ketu", years: 7 },
    { name: "Purva Phalguni", nameHindi: "पूर्व फाल्गुनी", lord: "Venus", years: 20 },
    { name: "Uttara Phalguni", nameHindi: "उत्तर फाल्गुनी", lord: "Sun", years: 6 },
    { name: "Hasta", nameHindi: "हस्त", lord: "Moon", years: 10 },
    { name: "Chitra", nameHindi: "चित्रा", lord: "Mars", years: 7 },
    { name: "Swati", nameHindi: "स्वाति", lord: "Rahu", years: 18 },
    { name: "Vishakha", nameHindi: "विशाखा", lord: "Jupiter", years: 16 },
    { name: "Anuradha", nameHindi: "अनुराधा", lord: "Saturn", years: 19 },
    { name: "Jyeshtha", nameHindi: "ज्येष्ठा", lord: "Mercury", years: 17 },
    { name: "Mula", nameHindi: "मूल", lord: "Ketu", years: 7 },
    { name: "Purva Ashadha", nameHindi: "पूर्वाषाढ़ा", lord: "Venus", years: 20 },
    { name: "Uttara Ashadha", nameHindi: "उत्तराषाढ़ा", lord: "Sun", years: 6 },
    { name: "Shravana", nameHindi: "श्रवण", lord: "Moon", years: 10 },
    { name: "Dhanishta", nameHindi: "धनिष्ठा", lord: "Mars", years: 7 },
    { name: "Shatabhisha", nameHindi: "शतभिषा", lord: "Rahu", years: 18 },
    { name: "Purva Bhadrapada", nameHindi: "पूर्वभाद्रपदा", lord: "Jupiter", years: 16 },
    { name: "Uttara Bhadrapada", nameHindi: "उत्तरभाद्रपदा", lord: "Saturn", years: 19 },
    { name: "Revati", nameHindi: "रेवती", lord: "Mercury", years: 17 }
];

/**
 * Dasha order (repeating cycle)
 */
export const DASHA_ORDER = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

/**
 * Get Nakshatra from Moon's longitude
 * @param {number} moonLongitude - Moon's longitude in degrees
 * @returns {object} Nakshatra information
 */
export function getNakshatraFromMoon(moonLongitude) {
    const nakshatraSize = 360 / 27; // 13° 20' = 13.333...°
    const nakshatraIndex = Math.floor(moonLongitude / nakshatraSize);
    const degreeInNakshatra = moonLongitude % nakshatraSize;
    const percentCompleted = degreeInNakshatra / nakshatraSize;

    return {
        nakshatra: NAKSHATRAS[nakshatraIndex],
        index: nakshatraIndex,
        degreeInNakshatra: degreeInNakshatra,
        percentCompleted: percentCompleted
    };
}

/**
 * Calculate Dasha balance at birth
 * @param {number} moonLongitude - Moon's longitude in degrees
 * @param {Date} birthDate - Birth date
 * @returns {object} Dasha balance information
 */
export function calculateDashaBalance(moonLongitude, birthDate) {
    const { nakshatra, percentCompleted } = getNakshatraFromMoon(moonLongitude);

    const totalYears = nakshatra.years;
    const completedYears = totalYears * percentCompleted;
    const balanceYears = totalYears - completedYears;

    // Convert years to milliseconds
    const balanceMs = balanceYears * 365.25 * 24 * 60 * 60 * 1000;

    // First Dasha ends at:
    const firstDashaEnd = new Date(birthDate.getTime() + balanceMs);

    return {
        currentDasha: nakshatra.lord,
        currentNakshatra: nakshatra,
        totalYears: totalYears,
        completedYears: completedYears,
        balanceYears: balanceYears,
        firstDashaEnd: firstDashaEnd
    };
}

/**
 * Generate complete Dasha timeline
 * @param {number} moonLongitude - Moon's longitude in degrees
 * @param {Date} birthDate - Birth date
 * @param {number} yearsAhead - Number of years to generate (default 120)
 * @returns {Array} Array of Dasha periods
 */
export function generateDashaTimeline(moonLongitude, birthDate, yearsAhead = 120) {
    const { currentDasha, balanceYears, firstDashaEnd } = calculateDashaBalance(moonLongitude, birthDate);

    const timeline = [];
    let currentDate = new Date(birthDate);
    let currentEndDate = new Date(firstDashaEnd);
    let currentLordIndex = DASHA_ORDER.indexOf(currentDasha);

    // Add first (partial) dasha
    timeline.push({
        lord: currentDasha,
        startDate: new Date(currentDate),
        endDate: new Date(currentEndDate),
        years: balanceYears,
        isPartial: true
    });

    currentDate = new Date(currentEndDate);

    // Generate subsequent dashas
    let totalYears = balanceYears;

    while (totalYears < yearsAhead) {
        currentLordIndex = (currentLordIndex + 1) % DASHA_ORDER.length;
        const lord = DASHA_ORDER[currentLordIndex];
        const nakshatra = NAKSHATRAS.find(n => n.lord === lord);
        const years = nakshatra.years;
        const ms = years * 365.25 * 24 * 60 * 60 * 1000;

        currentEndDate = new Date(currentDate.getTime() + ms);

        timeline.push({
            lord: lord,
            startDate: new Date(currentDate),
            endDate: new Date(currentEndDate),
            years: years,
            isPartial: false
        });

        currentDate = new Date(currentEndDate);
        totalYears += years;
    }

    return timeline;
}

/**
 * Get current running Dasha
 * @param {Array} timeline - Dasha timeline
 * @param {Date} currentDate - Current date (default: now)
 * @returns {object} Current Dasha period
 */
export function getCurrentDasha(timeline, currentDate = new Date()) {
    for (const dasha of timeline) {
        if (currentDate >= dasha.startDate && currentDate <= dasha.endDate) {
            return dasha;
        }
    }
    return null;
}

/**
 * Format Dasha period for display
 * @param {object} dasha - Dasha period
 * @param {boolean} useHindi - Use Hindi format
 * @returns {string} Formatted string
 */
export function formatDashaPeriod(dasha, useHindi = false) {
    const startStr = dasha.startDate.toLocaleDateString(useHindi ? 'hi-IN' : 'en-IN');
    const endStr = dasha.endDate.toLocaleDateString(useHindi ? 'hi-IN' : 'en-IN');

    return `${dasha.lord}: ${startStr} - ${endStr} (${dasha.years.toFixed(2)} ${useHindi ? 'वर्ष' : 'years'})`;
}
