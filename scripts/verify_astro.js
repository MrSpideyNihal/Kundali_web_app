
import { handler } from '../netlify/functions/astro.js';

async function test() {
    // Test Case: 1st Jan 2000, 12:00 PM, New Delhi
    // 28.6139° N, 77.2090° E
    // Timezone: Asia/Kolkata

    const mockEvent = {
        body: JSON.stringify({
            date: '2000-01-01',
            time: '12:00:00',
            latitude: 28.6139,
            longitude: 77.2090,
            timezone: 'Asia/Kolkata'
        })
    };

    console.log("Running Swiss Ephemeris Calculation...");
    const response = await handler(mockEvent);

    if (response.statusCode !== 200) {
        console.error("Error:", response.body);
        return;
    }

    const data = JSON.parse(response.body);
    console.log("Calculation Successful!");
    console.log("Ascendant:", data.ascendant);
    console.log("Sun:", data.planets.Sun.longitude);
    console.log("Moon:", data.planets.Moon.longitude);
    console.log("Ayanamsa:", data.ayanamsa);

    // Check against approximate expected values (AstroSage ref)
    // 1 Jan 2000 12:00 DEL
    // Asc: Pisces ~8-9 deg? (Need to verify)
    // Sun: Sagittarius ~16 deg
    // Moon: Libra ~27 deg
}

test();
