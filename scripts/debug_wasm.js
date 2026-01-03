
import SwissEph from 'swisseph-wasm';

(async () => {
    try {
        const ids = [0, 1, 2, 3, 4, 5, 6, 11]; // Sun to Rahu

        for (const id of ids) {
            console.log(`Calc ID ${id}...`);
            const swe = new SwissEph();
            await swe.initSwissEph();

            const jd = swe.julday(2000, 1, 1, 12, swe.SE_GREG_CAL);
            const res = swe.calc_ut(jd, id, swe.SEFLG_SPEED | swe.SEFLG_SIDEREAL);
            console.log(`Res ${id}:`, res[0]);

            // wrappers usually don't have close() unless added.
            // basic-usage.js showed swe.close().
            if (swe.close) swe.close();
        }

    } catch (e) {
        console.error("Error:", e);
    }
})();
