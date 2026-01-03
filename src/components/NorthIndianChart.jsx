import React from 'react';
import { PLANETS_HINDI, SIGNS_HINDI } from '../utils/hindi';

/**
 * North Indian Diamond Chart Component
 * Matches AstroSage's standard North Indian Kundali layout
 */
export default function NorthIndianChart({ planets, lagna, useHindi = true }) {
    // Calculate house positions based on Lagna
    const lagnaSign = Math.floor(lagna / 30);

    // Sign names for display
    const SIGN_ABBREV = ['Ar', 'Ta', 'Ge', 'Ca', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
    const SIGN_ABBREV_HI = ['मे', 'वृ', 'मि', 'क', 'सिं', 'क', 'तु', 'वृ', 'ध', 'म', 'कुं', 'मी'];

    // Get planets in each house (1-12)
    const houses = Array(12).fill(null).map(() => []);

    for (const [planetName, data] of Object.entries(planets)) {
        const planetSign = Math.floor(data.longitude / 30);
        const houseNum = ((planetSign - lagnaSign + 12) % 12); // 0-indexed house
        const degree = Math.floor(data.longitude % 30);
        houses[houseNum].push({
            name: planetName,
            nameHindi: PLANETS_HINDI[planetName],
            abbrev: planetName.substring(0, 2),
            degree: degree,
            isRetro: data.isRetrograde
        });
    }

    // SVG dimensions
    const size = 400;
    const center = size / 2;
    const outerOffset = 10;

    // North Indian chart layout - diamond shape
    // House positions in the diamond (matching AstroSage style)
    // The diamond has 12 triangular sections

    // Coordinates for the diamond corners
    const top = { x: center, y: outerOffset };
    const right = { x: size - outerOffset, y: center };
    const bottom = { x: center, y: size - outerOffset };
    const left = { x: outerOffset, y: center };

    // House layout positions (center points for placing planets)
    // North Indian style: House 1 is at top center
    const housePositions = [
        { x: center, y: 70 },           // House 1 (Lagna) - top center
        { x: center + 70, y: 70 },      // House 2 - top right
        { x: center + 110, y: center - 50 }, // House 3 - right upper
        { x: center + 110, y: center + 50 }, // House 4 - right lower
        { x: center + 70, y: size - 70 },    // House 5 - bottom right
        { x: center, y: size - 70 },         // House 6 - bottom center
        { x: center - 70, y: size - 70 },    // House 7 - bottom left
        { x: center - 110, y: center + 50 }, // House 8 - left lower
        { x: center - 110, y: center - 50 }, // House 9 - left upper
        { x: center - 70, y: 70 },           // House 10 - top left
        { x: center - 35, y: center - 35 },  // House 11 - inner left
        { x: center + 35, y: center - 35 }   // House 12 - inner right
    ];

    // House numbers to display
    const houseNumbers = [
        { x: center, y: 40, num: 1 },
        { x: center + 85, y: 55, num: 2 },
        { x: size - 45, y: center - 60, num: 3 },
        { x: size - 45, y: center + 60, num: 4 },
        { x: center + 85, y: size - 45, num: 5 },
        { x: center, y: size - 30, num: 6 },
        { x: center - 85, y: size - 45, num: 7 },
        { x: 45, y: center + 60, num: 8 },
        { x: 45, y: center - 60, num: 9 },
        { x: center - 85, y: 55, num: 10 },
        { x: center - 50, y: center - 20, num: 11 },
        { x: center + 50, y: center - 20, num: 12 }
    ];

    return (
        <div className="kundali-card">
            <h3 className="text-xl font-semibold text-center mb-4">
                {useHindi ? 'लग्न कुंडली' : 'Lagna Chart'}
            </h3>

            <svg width={size} height={size} className="mx-auto" style={{ background: '#fff' }}>
                {/* Outer diamond border */}
                <polygon
                    points={`${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`}
                    fill="none"
                    stroke="#E07328"
                    strokeWidth="2"
                />

                {/* Inner lines forming the 12 houses */}
                {/* Vertical center line */}
                <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} stroke="#E07328" strokeWidth="1" />
                {/* Horizontal center line */}
                <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#E07328" strokeWidth="1" />

                {/* Diagonal lines from corners to center */}
                <line x1={top.x} y1={top.y} x2={left.x} y2={left.y} stroke="#E07328" strokeWidth="1" />
                <line x1={top.x} y1={top.y} x2={right.x} y2={right.y} stroke="#E07328" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={left.x} y2={left.y} stroke="#E07328" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={right.x} y2={right.y} stroke="#E07328" strokeWidth="1" />

                {/* Inner diamond */}
                <polygon
                    points={`${center},${center - 80} ${center + 80},${center} ${center},${center + 80} ${center - 80},${center}`}
                    fill="none"
                    stroke="#E07328"
                    strokeWidth="1"
                />

                {/* House numbers */}
                {houseNumbers.map((h, i) => (
                    <text
                        key={`hnum-${i}`}
                        x={h.x}
                        y={h.y}
                        fontSize="10"
                        fill="#888"
                        textAnchor="middle"
                    >
                        {h.num}
                    </text>
                ))}

                {/* Planets in houses */}
                {housePositions.map((pos, houseIdx) => {
                    const planetsInHouse = houses[houseIdx];
                    return (
                        <g key={`house-${houseIdx}`}>
                            {planetsInHouse.map((planet, pIndex) => {
                                // Color coding like AstroSage
                                let color = '#1a1a1a';
                                if (planet.name === 'Sun') color = '#cc0000';
                                else if (planet.name === 'Moon') color = '#006600';
                                else if (planet.name === 'Mars') color = '#cc0000';
                                else if (planet.name === 'Mercury') color = '#008800';
                                else if (planet.name === 'Jupiter') color = '#cc6600';
                                else if (planet.name === 'Venus') color = '#6600cc';
                                else if (planet.name === 'Saturn') color = '#000066';
                                else if (planet.name === 'Rahu') color = '#660000';
                                else if (planet.name === 'Ketu') color = '#660066';

                                return (
                                    <text
                                        key={`${houseIdx}-${pIndex}`}
                                        x={pos.x}
                                        y={pos.y + (pIndex * 14)}
                                        fontSize="11"
                                        fill={color}
                                        textAnchor="middle"
                                        fontWeight="bold"
                                    >
                                        {useHindi ? planet.nameHindi : planet.abbrev}
                                        <tspan fontSize="8" baselineShift="super">
                                            {planet.degree}
                                        </tspan>
                                        {planet.isRetro && <tspan fill="#cc0000">*</tspan>}
                                    </text>
                                );
                            })}
                        </g>
                    );
                })}

                {/* Lagna indicator */}
                <text
                    x={center}
                    y={center}
                    fontSize="12"
                    fill="#cc0000"
                    textAnchor="middle"
                    fontWeight="bold"
                >
                    {useHindi ? 'लग्न' : 'ASC'}
                </text>
            </svg>

            <div className="mt-4 text-center text-sm text-gray-700">
                <p>
                    <strong>{useHindi ? 'लग्न' : 'Ascendant'}:</strong>{' '}
                    {useHindi ? Object.values(SIGNS_HINDI)[lagnaSign] : SIGN_ABBREV[lagnaSign]}{' '}
                    {Math.floor(lagna % 30)}° {Math.floor((lagna % 1) * 60)}'
                </p>
            </div>
        </div>
    );
}
