/**
 * Hindi Translation Utilities
 * Complete translation maps for Vedic astrology terms
 */

/**
 * Planet names in Hindi
 */
export const PLANETS_HINDI = {
    "Sun": "सूर्य",
    "Moon": "चंद्र",
    "Mars": "मंगल",
    "Mercury": "बुध",
    "Jupiter": "गुरु",
    "Venus": "शुक्र",
    "Saturn": "शनि",
    "Rahu": "राहु",
    "Ketu": "केतु"
};

/**
 * Sign names in Hindi
 */
export const SIGNS_HINDI = {
    "Aries": "मेष",
    "Taurus": "वृषभ",
    "Gemini": "मिथुन",
    "Cancer": "कर्क",
    "Leo": "सिंह",
    "Virgo": "कन्या",
    "Libra": "तुला",
    "Scorpio": "वृश्चिक",
    "Sagittarius": "धनु",
    "Capricorn": "मकर",
    "Aquarius": "कुंभ",
    "Pisces": "मीन"
};

/**
 * House names in Hindi
 */
export const HOUSES_HINDI = {
    "1st House": "प्रथम भाव",
    "2nd House": "द्वितीय भाव",
    "3rd House": "तृतीय भाव",
    "4th House": "चतुर्थ भाव",
    "5th House": "पंचम भाव",
    "6th House": "षष्ठ भाव",
    "7th House": "सप्तम भाव",
    "8th House": "अष्टम भाव",
    "9th House": "नवम भाव",
    "10th House": "दशम भाव",
    "11th House": "एकादश भाव",
    "12th House": "द्वादश भाव"
};

/**
 * General astrology terms in Hindi
 */
export const TERMS_HINDI = {
    "Ascendant": "लग्न",
    "Lagna": "लग्न",
    "Navamsa": "नवांश",
    "Dasha": "दशा",
    "Birth Chart": "जन्म कुंडली",
    "Kundali": "कुंडली",
    "Planetary Positions": "ग्रहों की स्थिति",
    "House": "भाव",
    "Sign": "राशि",
    "Degree": "अंश",
    "Minute": "कला",
    "Second": "विकला",
    "Rasi": "राशि",
    "Nakshatra": "नक्षत्र",
    "Lord": "स्वामी",
    "Benefic": "शुभ ग्रह",
    "Malefic": "अशुभ ग्रह",
    "Retrograde": "वक्री",
    "Direct": "मार्गी",
    "Exalted": "उच्च",
    "Debilitated": "नीच",
    "Own Sign": "स्वराशि",
    "Birth Date": "जन्म तिथि",
    "Birth Time": "जन्म समय",
    "Birth Place": "जन्म स्थान",
    "Latitude": "अक्षांश",
    "Longitude": "देशांतर",
    "Timezone": "समय क्षेत्र",
    "Ayanamsa": "अयनांश",
    "Vimshottari": "विम्शोत्तरी",
    "Mahadasha": "महादशा",
    "Antardasha": "अंतर्दशा",
    "Years": "वर्ष",
    "Months": "माह",
    "Days": "दिन",
    "Start Date": "प्रारंभ तिथि",
    "End Date": "समाप्ति तिथि",
    "Current": "वर्तमान",
    "Balance": "शेष",
    "Generate Kundali": "कुंडली बनाएं",
    "Download PDF": "पीडीएफ डाउनलोड करें",
    "North Indian Chart": "उत्तर भारतीय चार्ट",
    "South Indian Chart": "दक्षिण भारतीय चार्ट"
};

/**
 * Translate text to Hindi
 * @param {string} text - English text
 * @returns {string} Hindi translation
 */
export function translateToHindi(text) {
    return PLANETS_HINDI[text] ||
        SIGNS_HINDI[text] ||
        HOUSES_HINDI[text] ||
        TERMS_HINDI[text] ||
        text;
}

/**
 * Get house name in Hindi
 * @param {number} houseNumber - House number (1-12)
 * @returns {string} Hindi house name
 */
export function getHouseNameHindi(houseNumber) {
    const houseNames = [
        "प्रथम भाव", "द्वितीय भाव", "तृतीय भाव", "चतुर्थ भाव",
        "पंचम भाव", "षष्ठ भाव", "सप्तम भाव", "अष्टम भाव",
        "नवम भाव", "दशम भाव", "एकादश भाव", "द्वादश भाव"
    ];

    return houseNames[houseNumber - 1];
}

/**
 * Format date in Hindi
 * @param {Date} date - Date object
 * @returns {string} Formatted Hindi date
 */
export function formatDateHindi(date) {
    return date.toLocaleDateString('hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Generate Hindi report for Kundali
 * @param {object} kundaliData - Complete kundali data
 * @returns {string} Hindi report (Markdown format)
 */
export function generateHindiReport(kundaliData) {
    let report = "# जन्म कुंडली\n\n";

    // Birth details
    report += "## जन्म विवरण\n\n";
    report += `**जन्म तिथि:** ${formatDateHindi(kundaliData.birthDate)}\n\n`;
    report += `**जन्म समय:** ${kundaliData.birthTime}\n\n`;
    report += `**जन्म स्थान:** ${kundaliData.birthPlace}\n\n`;

    // Lagna details
    report += "## लग्न विवरण\n\n";
    const lagnaInfo = kundaliData.lagnaInfo;
    report += `**लग्न:** ${lagnaInfo.signHindi} ${Math.floor(lagnaInfo.degree)}° ${lagnaInfo.minutes}'\n\n`;

    // Planetary positions
    report += "## ग्रहों की स्थिति\n\n";
    report += "| ग्रह | राशि | अंश | भाव |\n";
    report += "|------|------|------|------|\n";

    for (const [planet, data] of Object.entries(kundaliData.planets)) {
        const planetHindi = PLANETS_HINDI[planet];
        const signHindi = SIGNS_HINDI[data.sign];
        const degree = `${Math.floor(data.degree)}° ${data.minutes}'`;
        const house = getHouseNameHindi(data.house);

        report += `| ${planetHindi} | ${signHindi} | ${degree} | ${house} |\n`;
    }

    // Dasha details
    report += "\n## दशा विवरण (विम्शोत्तरी)\n\n";
    report += "| दशा स्वामी | प्रारंभ तिथि | समाप्ति तिथि | अवधि (वर्ष) |\n";
    report += "|------------|--------------|--------------|---------------|\n";

    for (const dasha of kundaliData.dashaTimeline.slice(0, 10)) {
        const lordHindi = PLANETS_HINDI[dasha.lord];
        const startDate = formatDateHindi(dasha.startDate);
        const endDate = formatDateHindi(dasha.endDate);
        const years = dasha.years.toFixed(2);

        report += `| ${lordHindi} | ${startDate} | ${endDate} | ${years} |\n`;
    }

    return report;
}
