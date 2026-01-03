import React from 'react';
import { PLANETS_HINDI } from '../utils/hindi';
import { getSign } from '../utils/astrology';

/**
 * Planetary Positions Table Component
 * Displays all planetary positions with sign, degree, and house
 */
export default function PlanetaryPositions({ planets, lagna, useHindi = true }) {
    const planetOrder = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu'];

    return (
        <div className="kundali-card">
            <h3 className="text-2xl font-semibold mb-4 text-center">
                {useHindi ? 'ग्रहों की स्थिति' : 'Planetary Positions'}
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">{useHindi ? 'ग्रह' : 'Planet'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'राशि' : 'Sign'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'अंश' : 'Degree'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'भाव' : 'House'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {planetOrder.map((planetName, index) => {
                            const data = planets[planetName];
                            if (!data) return null;

                            const signInfo = getSign(data.longitude);
                            const lagnaSign = Math.floor(lagna / 30);
                            const planetSign = Math.floor(data.longitude / 30);
                            const house = ((planetSign - lagnaSign + 12) % 12) + 1;

                            return (
                                <tr
                                    key={planetName}
                                    className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {useHindi ? PLANETS_HINDI[planetName] : planetName}
                                    </td>
                                    <td className="px-4 py-3">
                                        {useHindi ? signInfo.signHindi : signInfo.sign}
                                    </td>
                                    <td className="px-4 py-3">
                                        {Math.floor(signInfo.degree)}° {signInfo.minutes}'
                                    </td>
                                    <td className="px-4 py-3">
                                        {house}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Lagna Information */}
            <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-purple-50 rounded-lg">
                <h4 className="font-semibold text-lg mb-2">
                    {useHindi ? 'लग्न विवरण' : 'Ascendant Details'}
                </h4>
                <p className="text-gray-700">
                    <span className="font-medium">{useHindi ? 'लग्न' : 'Lagna'}:</span>{' '}
                    {useHindi ? getSign(lagna).signHindi : getSign(lagna).sign}{' '}
                    {Math.floor(getSign(lagna).degree)}° {getSign(lagna).minutes}'
                </p>
            </div>
        </div>
    );
}
