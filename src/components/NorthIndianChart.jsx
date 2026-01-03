import React from 'react';
import { PLANETS_HINDI, SIGNS_HINDI } from '../utils/hindi';

/**
 * North Indian Diamond Chart Component
 * Traditional diamond-shaped Kundali chart
 */
export default function NorthIndianChart({ planets, lagna, useHindi = true }) {
    // Calculate house positions based on Lagna
    const lagnaSign = Math.floor(lagna / 30);

    // Get planets in each house
    const houses = Array(12).fill(null).map(() => []);

    for (const [planetName, data] of Object.entries(planets)) {
        const planetSign = Math.floor(data.longitude / 30);
        const house = ((planetSign - lagnaSign + 12) % 12);
        houses[house].push({
            name: planetName,
            nameHindi: PLANETS_HINDI[planetName],
            degree: Math.floor(data.longitude % 30),
            minutes: Math.floor((data.longitude % 1) * 60)
        });
    }

    // SVG dimensions
    const width = 400;
    const height = 400;
    const center = width / 2;

    // Diamond points
    const top = { x: center, y: 20 };
    const right = { x: width - 20, y: center };
    const bottom = { x: center, y: height - 20 };
    const left = { x: 20, y: center };

    // House label positions (12 houses in diamond layout)
    const housePositions = [
        { x: center, y: center - 60, label: '1' },      // 1st house (Lagna)
        { x: center + 60, y: center - 60, label: '2' }, // 2nd house
        { x: center + 60, y: center, label: '3' },      // 3rd house
        { x: center + 60, y: center + 60, label: '4' }, // 4th house
        { x: center, y: center + 60, label: '5' },      // 5th house
        { x: center - 60, y: center + 60, label: '6' }, // 6th house
        { x: center - 60, y: center, label: '7' },      // 7th house
        { x: center - 60, y: center - 60, label: '8' }, // 8th house
        { x: center - 30, y: center - 90, label: '9' }, // 9th house
        { x: center + 30, y: center - 90, label: '10' },// 10th house
        { x: center + 90, y: center - 30, label: '11' },// 11th house
        { x: center + 90, y: center + 30, label: '12' } // 12th house
    ];

    return (
        <div className="chart-container">
            <h3 className="text-xl font-semibold text-center mb-4">
                {useHindi ? 'उत्तर भारतीय चार्ट' : 'North Indian Chart'}
            </h3>

            <svg width={width} height={height} className="mx-auto border-2 border-gray-300 rounded-lg bg-white">
                {/* Diamond outline */}
                <polygon
                    points={`${top.x},${top.y} ${right.x},${right.y} ${bottom.x},${bottom.y} ${left.x},${left.y}`}
                    fill="none"
                    stroke="#4B5563"
                    strokeWidth="2"
                />

                {/* Inner cross lines */}
                <line x1={top.x} y1={top.y} x2={bottom.x} y2={bottom.y} stroke="#9CA3AF" strokeWidth="1" />
                <line x1={left.x} y1={left.y} x2={right.x} y2={right.y} stroke="#9CA3AF" strokeWidth="1" />

                {/* Diagonal lines */}
                <line x1={top.x} y1={top.y} x2={left.x} y2={left.y} stroke="#9CA3AF" strokeWidth="1" />
                <line x1={top.x} y1={top.y} x2={right.x} y2={right.y} stroke="#9CA3AF" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={left.x} y2={left.y} stroke="#9CA3AF" strokeWidth="1" />
                <line x1={bottom.x} y1={bottom.y} x2={right.x} y2={right.y} stroke="#9CA3AF" strokeWidth="1" />

                {/* Additional inner lines for 12 houses */}
                <line x1={center} y1={center - 90} x2={center} y2={top.y} stroke="#D1D5DB" strokeWidth="1" />
                <line x1={center} y1={center + 90} x2={center} y2={bottom.y} stroke="#D1D5DB" strokeWidth="1" />
                <line x1={center - 90} y1={center} x2={left.x} y2={left.y} stroke="#D1D5DB" strokeWidth="1" />
                <line x1={center + 90} y1={center} x2={right.x} y2={right.y} stroke="#D1D5DB" strokeWidth="1" />

                {/* Lagna marker (Ascendant) */}
                <text x={center} y={center - 75} fontSize="12" fontWeight="bold" fill="#DC2626" textAnchor="middle">
                    {useHindi ? 'लग्न' : 'ASC'}
                </text>

                {/* Planets in houses */}
                {housePositions.map((pos, index) => {
                    const planetsInHouse = houses[index];
                    return (
                        <g key={index}>
                            {planetsInHouse.map((planet, pIndex) => (
                                <text
                                    key={pIndex}
                                    x={pos.x}
                                    y={pos.y + (pIndex * 15)}
                                    fontSize="11"
                                    fill="#1F2937"
                                    textAnchor="middle"
                                    fontFamily="Noto Sans Devanagari, sans-serif"
                                >
                                    {useHindi ? planet.nameHindi : planet.name.substring(0, 2)}
                                    <tspan fontSize="9"> {planet.degree}°</tspan>
                                </text>
                            ))}
                        </g>
                    );
                })}
            </svg>

            <div className="mt-4 text-center text-sm text-gray-600">
                <p>{useHindi ? 'लग्न' : 'Lagna'}: {SIGNS_HINDI[Object.keys(SIGNS_HINDI)[lagnaSign]]} {Math.floor(lagna % 30)}°</p>
            </div>
        </div>
    );
}
