
import SwissEph from 'swisseph-wasm';
import { DateTime } from 'luxon';

const swe = new SwissEph();
let initialized = false;

// IDs
const PLANETS = {
    Sun: 0, // SE_SUN
    Moon: 1, // SE_MOON
    Mercury: 2,
    Venus: 3,
    Mars: 4,
    Jupiter: 5,
    Saturn: 6,
    Rahu: 10, // SE_MEAN_NODE (Mean Node - AstroSage uses this)
    Ketu: 'Opposite'
};

const SE_SIDM_LAHIRI = 1; // Check constant if possible, but 1 is standard Lahiri usually.
// Wait, wrapper constants are on instance. I will read them in handler.

function normalize(deg) {
    return ((deg % 360) + 360) % 360;
}

function getSign(long) {
    return Math.floor(normalize(long) / 30);
}

// Manual Ascendant Calculation
function calculateAscendant(lstHours, latDeg, epsilonDeg) {
    // Convert to radians
    const lstRad = (lstHours * 15) * Math.PI / 180;
    const latRad = latDeg * Math.PI / 180;
    const epsRad = epsilonDeg * Math.PI / 180;

    // tan(Asc) = cos(LST) / (-sin(LST)*cos(Eps) - tan(Lat)*sin(Eps))
    const num = Math.cos(lstRad);
    const den = -Math.sin(lstRad) * Math.cos(epsRad) - Math.tan(latRad) * Math.sin(epsRad);

    let ascRad = Math.atan2(num, den);
    let ascDeg = ascRad * 180 / Math.PI;

    return normalize(ascDeg);
}

export const handler = async (req, context) => {
    try {
        if (!initialized) {
            await swe.initSwissEph();
            initialized = true;
        }

        const start = Date.now();
        const body = JSON.parse(req.body || '{}');
        const { date, time, latitude, longitude, timezone } = body;

        if (!date || !time || latitude === undefined || longitude === undefined) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing: date, time, lat, lon' })
            };
        }

        // Use provided timezone or default to UTC
        const tz = timezone || 'UTC';

        // 1. Julian Day (UT)
        const dt = DateTime.fromISO(`${date}T${time}`, { zone: tz });
        const utc = dt.toUTC();
        const jd_ut = swe.julday(utc.year, utc.month, utc.day, utc.hour + utc.minute / 60 + utc.second / 3600, swe.SE_GREG_CAL);

        // 2. Set Lahiri
        swe.set_sid_mode(swe.SE_SIDM_LAHIRI, 0, 0);
        const flags = swe.SEFLG_SPEED | swe.SEFLG_SIDEREAL;

        // 3. Planets
        const planetsTop = {};
        for (const [name, id] of Object.entries(PLANETS)) {
            if (name === 'Ketu') continue;

            console.log(`Calculating ${name} (${id})...`);
            try {
                // Use calc_ut directly
                const res = swe.calc_ut(jd_ut, id, flags);
                console.log(`Calculated ${name}:`, res[0]);
                // res is Float64Array [long, lat, dist, speed, ...]
                planetsTop[name] = {
                    longitude: normalize(res[0]),
                    speed: res[3],
                    isRetrograde: res[3] < 0
                };
            } catch (e) { console.error(`Failed ${name}:`, e); throw e; }
        }

        // Ketu
        planetsTop['Ketu'] = {
            longitude: normalize(planetsTop['Rahu'].longitude + 180),
            speed: planetsTop['Rahu'].speed,
            isRetrograde: planetsTop['Rahu'].isRetrograde
        };

        // 4. Ascendant & Houses
        // Sidereal Time
        const gst = swe.sidtime(jd_ut);
        const lst = (gst + longitude / 15) % 24;

        // Obliquity
        // Calculate using SE_ECL_NUT = -1
        // Need true obliquity usually.
        // Based on previous test, it's at index 1?
        const eclObj = swe.calc(jd_ut, -1, 0);
        const epsilon = eclObj.latitude; // As determined by testing

        // Tropical Ascendant? Or Sidereal?
        // Formula gives Tropical Ascendant relative to Equinox of Date usually if LST is Apparent Sidereal Time.
        // Wait. LST from swisseph `sidtime` is Apparent Sidereal Time (Greenwich).
        // The formula results in TROPICAL Ascendant.
        // We must subtract Ayanamsa to get Sidereal Ascendant.
        // OR we can correct LST?
        // Standard: Calc Tropical Asc -> Subtract Ayanamsa.

        const tropicalAsc = calculateAscendant(lst, latitude, epsilon);
        const ayanamsa = swe.get_ayanamsa_ut(jd_ut);
        const siderealAsc = normalize(tropicalAsc - ayanamsa);

        // Houses (Whole Sign)
        // House 1 starts at 0 deg of Ascendant Sign.
        const ascSign = getSign(siderealAsc); // 0-11
        const houses = {};
        for (let i = 1; i <= 12; i++) {
            // Sign index for House i
            // House 1 = ascSign
            // House 2 = ascSign + 1
            const signIdx = (ascSign + (i - 1)) % 12;
            houses[i] = {
                sign: signIdx,
                startDegree: signIdx * 30, // Whole sign
                // Only strictly needed if we want cusps.
                // For placements, we just check planet sign relative to ascSign.
            };
        }

        // 5. Divisional (D9)
        const d9 = {};
        const calculateD9 = (long) => {
            // Navamsa Logic
            // 1. Sign Index
            const sign = Math.floor(long / 30);
            // 2. Degrees in sign
            const deg = long % 30;
            // 3. Pada (0-8)
            const pada = Math.floor(deg / (30 / 9));

            // Formula:
            // Earthy signs (Taurus 1, Virgo 5, Cap 9): Start from Capricorn(9)
            // Airy (Gem 2, Lib 6, Aqu 10): Start from Libra(6)
            // Watery (Can 3, Sco 7, Pis 11): Start from Cancer(3)
            // Fiery (Ari 0, Leo 4, Sag 8): Start from Aries(0)

            // Generalized:
            // Element offset: 
            // Fire (0,4,8) -> 0 (Aries)
            // Earth (1,5,9) -> 9 (Cap)
            // Air (2,6,10) -> 6 (Lib)
            // Water (3,7,11) -> 3 (Can)

            // Logic:
            // Group = sign % 4.
            // if 0 (Fire) -> 0
            // if 1 (Earth) -> 9
            // if 2 (Air) -> 6
            // if 3 (Water) -> 3

            // Wait, standard lookup:
            // Fire: Aries, Leo, Sag. Starts Aries.
            // Earth: Tau, Vir, Cap. Starts Cap. 
            // Air: Gem, Lib, Aqu. Starts Lib.
            // Water: Can, Sco, Pis. Starts Can.

            // Can be computed:
            // offset = [0, 9, 6, 3][sign % 4] ?? No.

            // Let's use simple lookup for first sign of Navamsa based on Movable/Fixed/Dual?
            // Movable (1,4,7,10): Same sign.
            // Fixed (2,5,8,11): 9th from it.
            // Dual (3,6,9,12): 5th from it.
            // My indices are 0-based.
            // Movable: 0, 3, 6, 9.
            // Fixed: 1, 4, 7, 10.
            // Dual: 2, 5, 8, 11.

            // Navamsa Sign Index = (BaseSign + Pada) % 12 ??? No.

            // Correct Logic:
            // Navamsa Sign = (Sign * 9 + Pada) % 12 ?
            // Let's trace: 
            // Aries (0): Pada 0 -> Aries (0). Correct.
            // Taurus (1): Pada 0 -> Capricorn (9). (1*9 + 0) = 9. Correct.
            // Gemini (2): Pada 0 -> Libra (6). (2*9 + 0) = 18%12 = 6. Correct.
            // Cancer (3): Pada 0 -> Cancer (3). (3*9 + 0) = 27%12 = 3. Correct.

            // YES! Formula is (SignIndex * 9 + Pada) % 12.

            const navamsaSign = (sign * 9 + pada) % 12;
            // Longitude in Navamsa? Usually just the sign is explicitly needed, 
            // but exact degree is (AbsoluteLong * 9) % 360 ?? 
            // AstroSage shows Sign mainly. But D9 chart has degrees too.
            // Degree in D9 sign = (deg % 3.333) * 9.

            const degInNav = (deg % (30 / 9)) * 9;
            const totalNavLong = navamsaSign * 30 + degInNav;

            return {
                sign: navamsaSign,
                longitude: totalNavLong
            };
        };

        for (const [name, p] of Object.entries(planetsTop)) {
            d9[name] = calculateD9(p.longitude);
        }
        d9['Ascendant'] = calculateD9(siderealAsc);

        // 6. Dasha (Vimshottari)
        // Moon Longitude -> Nakshatra
        // Nakshatra = floor(MoonLong / (360/27)). 0-26.
        // 27 Naks. 
        // Lords sequence: Ketu, Ven, Sun, Moon, Mars, Rahu, Jup, Sat, Mer. (repeat 3 times)
        // Cycle years: 7, 20, 6, 10, 7, 18, 16, 19, 17. Total 120.

        // We need precise end dates.
        // Balance of Dasha at birth.

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                ascendant: siderealAsc,
                ayanamsa: ayanamsa,
                planets: planetsTop,
                houses: houses,
                d9: d9,
                meta: {
                    jd: jd_ut,
                    offset: dt.offset,
                    calcTime: Date.now() - start
                }
            })
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message, stack: error.stack })
        };
    }
};
