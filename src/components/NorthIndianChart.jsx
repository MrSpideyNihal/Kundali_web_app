import React from 'react';
import { PLANETS_HINDI, SIGNS_HINDI } from '../utils/hindi';

/**
 * North Indian Diamond Chart - Exact AstroSage Style
 */
export default function NorthIndianChart({ planets, lagna, useHindi = true }) {
    const lagnaSign = Math.floor(lagna / 30);

    // Get planets in each house (0-11)
    const houses = Array(12).fill(null).map(() => []);

    for (const [planetName, data] of Object.entries(planets)) {
        const planetSign = Math.floor(data.longitude / 30);
        const houseNum = ((planetSign - lagnaSign + 12) % 12);
        const degree = Math.floor(data.longitude % 30);
        houses[houseNum].push({
            name: planetName,
            abbrev: getAbbrev(planetName),
            degree: degree,
            isRetro: data.isRetrograde || data.speed < 0
        });
    }

    function getAbbrev(name) {
        const map = {
            'Sun': 'Su', 'Moon': 'Mo', 'Mars': 'Ma', 'Mercury': 'Me',
            'Jupiter': 'Ju', 'Venus': 'Ve', 'Saturn': 'Sa',
            'Rahu': 'Ra', 'Ketu': 'Ke', 'Uranus': 'Ur',
            'Neptune': 'Ne', 'Pluto': 'Pl'
        };
        return map[name] || name.substring(0, 2);
    }

    function getColor(name) {
        const colors = {
            'Sun': '#cc0000', 'Moon': '#008800', 'Mars': '#cc0000',
            'Mercury': '#008800', 'Jupiter': '#cc6600', 'Venus': '#9900cc',
            'Saturn': '#000099', 'Rahu': '#990000', 'Ketu': '#990099',
            'Uranus': '#009999', 'Neptune': '#0066cc', 'Pluto': '#660066'
        };
        return colors[name] || '#000000';
    }

    // Chart size
    const size = 320;
    const mid = size / 2;
    const margin = 5;

    // Diamond corners
    const top = { x: mid, y: margin };
    const right = { x: size - margin, y: mid };
    const bottom = { x: mid, y: size - margin };
    const left = { x: margin, y: mid };

    // Inner diamond (center)
    const innerSize = 80;
    const innerTop = { x: mid, y: mid - innerSize };
    const innerRight = { x: mid + innerSize, y: mid };
    const innerBottom = { x: mid, y: mid + innerSize };
    const innerLeft = { x: mid - innerSize, y: mid };

    // House positions for planets - AstroSage exact layout
    // House 1 = top center triangle (Lagna position)
    const houseAreas = [
        { x: mid, y: 55, house: 1 },           // House 1 - top center
        { x: mid + 75, y: 55, house: 2 },      // House 2 - top right
        { x: size - 45, y: mid - 55, house: 3 }, // House 3 - right top
        { x: size - 45, y: mid + 55, house: 4 }, // House 4 - right bottom
        { x: mid + 75, y: size - 55, house: 5 }, // House 5 - bottom right
        { x: mid, y: size - 55, house: 6 },      // House 6 - bottom center
        { x: mid - 75, y: size - 55, house: 7 }, // House 7 - bottom left
        { x: 45, y: mid + 55, house: 8 },        // House 8 - left bottom
        { x: 45, y: mid - 55, house: 9 },        // House 9 - left top
        { x: mid - 75, y: 55, house: 10 },       // House 10 - top left
        { x: mid - 40, y: mid - 40, house: 11 }, // House 11 - inner top left
        { x: mid + 40, y: mid - 40, house: 12 }  // House 12 - inner top right
    ];

    // House number positions (small numbers in corners)
    const houseNumbers = [
        { x: mid, y: 25, n: 1 },
        { x: mid + 85, y: 40, n: 2 },
        { x: size - 25, y: mid - 75, n: 3 },
        { x: size - 25, y: mid + 75, n: 4 },
        { x: mid + 85, y: size - 30, n: 5 },
        { x: mid, y: size - 15, n: 6 },
        { x: mid - 85, y: size - 30, n: 7 },
        { x: 25, y: mid + 75, n: 8 },
        { x: 25, y: mid - 75, n: 9 },
        { x: mid - 85, y: 40, n: 10 },
        { x: mid - 55, y: mid - 10, n: 11 },
        { x: mid + 55, y: mid - 10, n: 12 }
    ];

    return (
        <div className="kundali-card">
            <h3 className="text-lg font-semibold text-center mb-3" style={{ color: '#E07020' }}>
                Lagna Chart
            </h3>

            <svg width={size} height={size} className="mx-auto" style={{ background: '#fff' }}>
                {/* Outer diamond */}
                <polygon
                    points={`${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`}
                    fill="none"
                    stroke="#E07020"
                    strokeWidth="2"
                />

                {/* Cross lines through center */}
                <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} stroke="#E07020" strokeWidth="1" />
                <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#E07020" strokeWidth="1" />

                {/* Corner to center lines */}
                <line x1={top.x} y1={top.y} x2={left.x} y2={left.y} stroke="#E07020" strokeWidth="1" />
                <line x1={top.x} y1={top.y} x2={right.x} y2={right.y} stroke="#E07020" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={left.x} y2={left.y} stroke="#E07020" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={right.x} y2={right.y} stroke="#E07020" strokeWidth="1" />

                {/* Inner diamond */}
                <polygon
                    points={`${innerTop.x},${innerTop.y} ${innerRight.x},${innerRight.y} ${innerBottom.x},${innerBottom.y} ${innerLeft.x},${innerLeft.y}`}
                    fill="none"
                    stroke="#E07020"
                    strokeWidth="1"
                />

                {/* House numbers in small gray text */}
                {houseNumbers.map((h, i) => (
                    <text
                        key={`num-${i}`}
                        x={h.x}
                        y={h.y}
                        fontSize="10"
                        fill="#999"
                        textAnchor="middle"
                        fontFamily="Arial, sans-serif"
                    >
                        {h.n}
                    </text>
                ))}

                {/* Planets in each house */}
                {houseAreas.map((area, houseIdx) => {
                    const planetsInHouse = houses[houseIdx];
                    return (
                        <g key={`h-${houseIdx}`}>
                            {planetsInHouse.map((planet, pIdx) => (
                                <text
                                    key={`p-${houseIdx}-${pIdx}`}
                                    x={area.x}
                                    y={area.y + (pIdx * 14)}
                                    fontSize="12"
                                    fontWeight="bold"
                                    fill={getColor(planet.name)}
                                    textAnchor="middle"
                                    fontFamily="Arial, sans-serif"
                                >
                                    {planet.abbrev}
                                    {planet.isRetro && <tspan fill="#cc0000">*</tspan>}
                                    <tspan fontSize="8" dy="-4">{planet.degree.toString().padStart(2, '0')}</tspan>
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}
