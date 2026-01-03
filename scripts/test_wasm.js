
import SwissEph from 'swisseph-wasm';

(async () => {
    try {
        const swe = new SwissEph();
        await swe.initSwissEph();

        const jd = swe.julday(2000, 1, 1, 12, swe.SE_GREG_CAL);

        // 1. Sidereal Time
        console.log("Calculating Sidereal Time...");
        const gst = swe.sidtime(jd);
        console.log("GST:", gst);

        // Local Sidereal Time for Delhi (77.2090 E)
        // LST = GST + Lon/15
        const lon = 77.2090;
        const lst = (gst + lon / 15) % 24;
        console.log("LST (hrs):", lst);

        // 2. Obliquity
        console.log("Calculating Obliquity...");
        // SE_ECL_NUT = -1 (usually? or check constants)
        // Actually there is a specific function swe_calc with SE_ECL_NUT.
        // Let's check constant presence.

        // Use -1 for "Ecliptic and Nutation"? Or search constants key.
        // Usually SE_ECL_NUT is defined.

        let eclObj;
        if (swe.SE_ECL_NUT !== undefined) {
            eclObj = swe.calc(jd, swe.SE_ECL_NUT, 0); // No flags needed for ecliptic?
        } else {
            // Try body id -1
            eclObj = swe.calc(jd, -1, 0);
        }

        console.log("Ecliptic Result:", eclObj);
        // output should be { longitude: ..., latitude: ... } where longitude=0?, latitude=0? 
        // Actually swe_calc(SE_ECL_NUT) returns:
        // x[0] = true obliquity
        // x[1] = mean obliquity
        // x[2] = nutation in long
        // x[3] = nutation in obl

        const epsilon = eclObj.longitude; // True Obliquity?
        console.log("Obliquity (True):", epsilon);

    } catch (e) {
        console.error("Error:", e);
    }
})();
