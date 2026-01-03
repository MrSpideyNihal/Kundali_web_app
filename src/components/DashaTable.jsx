import React from 'react';
import { PLANETS_HINDI, formatDateHindi } from '../utils/hindi';

/**
 * Dasha Table Component
 * Displays Vimshottari Dasha timeline
 */
export default function DashaTable({ dashaTimeline, useHindi = true }) {
    // Show first 10 dashas
    const displayDashas = dashaTimeline.slice(0, 10);

    return (
        <div className="kundali-card">
            <h3 className="text-2xl font-semibold mb-4 text-center">
                {useHindi ? 'दशा विवरण (विम्शोत्तरी)' : 'Dasha Timeline (Vimshottari)'}
            </h3>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-orange-500 to-purple-600 text-white">
                        <tr>
                            <th className="px-4 py-3 text-left">{useHindi ? 'दशा स्वामी' : 'Dasha Lord'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'प्रारंभ तिथि' : 'Start Date'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'समाप्ति तिथि' : 'End Date'}</th>
                            <th className="px-4 py-3 text-left">{useHindi ? 'अवधि (वर्ष)' : 'Duration (Years)'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayDashas.map((dasha, index) => {
                            const isCurrentDasha = new Date() >= dasha.startDate && new Date() <= dasha.endDate;

                            return (
                                <tr
                                    key={index}
                                    className={`${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} ${isCurrentDasha ? 'bg-green-50 border-l-4 border-green-500' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3 font-medium">
                                        {useHindi ? PLANETS_HINDI[dasha.lord] : dasha.lord}
                                        {isCurrentDasha && (
                                            <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded">
                                                {useHindi ? 'वर्तमान' : 'Current'}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        {useHindi
                                            ? formatDateHindi(dasha.startDate)
                                            : dasha.startDate.toLocaleDateString('en-IN')
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        {useHindi
                                            ? formatDateHindi(dasha.endDate)
                                            : dasha.endDate.toLocaleDateString('en-IN')
                                        }
                                    </td>
                                    <td className="px-4 py-3">
                                        {dasha.years.toFixed(2)}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-600 text-center">
                <p>
                    {useHindi
                        ? 'विम्शोत्तरी दशा 120 वर्षों का चक्र है जो चंद्रमा की नक्षत्र स्थिति पर आधारित है।'
                        : 'Vimshottari Dasha is a 120-year cycle based on the Moon\'s Nakshatra position.'
                    }
                </p>
            </div>
        </div>
    );
}
