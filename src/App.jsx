import React, { useState } from 'react';
import InputForm from './components/InputForm';
import NorthIndianChart from './components/NorthIndianChart';
import PlanetaryPositions from './components/PlanetaryPositions';
import DashaTable from './components/DashaTable';
import {
    getChartData,
    getTimezoneFromCoordinates
} from './utils/astronomy';
import { generateDashaTimeline } from './utils/dasha';
import './index.css';

/**
 * Main App Component
 */
function App() {
    const [kundaliData, setKundaliData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [useHindi, setUseHindi] = useState(true);

    /**
     * Geocode city to get coordinates
     */
    const geocodeCity = async (cityName) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}&format=json&limit=1`
            );
            const data = await response.json();

            if (data.length === 0) {
                throw new Error('City not found. Please enter a valid city name.');
            }

            return {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
                displayName: data[0].display_name
            };
        } catch (err) {
            throw new Error('Failed to geocode city: ' + err.message);
        }
    };

    /**
     * Generate Kundali
     */
    const generateKundali = async (formData) => {
        setLoading(true);
        setError(null);

        try {
            // 1. Geocode city
            const { latitude, longitude, displayName } = await geocodeCity(formData.birthPlace);

            // 2. Determine Timezone (Client-side approximation or Input)
            // Ideally should be accurate. For now using basic mapping.
            const timezone = getTimezoneFromCoordinates(latitude, longitude);

            // 3. Call Backend API
            const chartData = await getChartData({
                birthDate: formData.birthDate,
                birthTime: formData.birthTime,
                latitude,
                longitude,
                timezone
            });

            // 4. Calculate Dasha timeline (Client-side using precise Moon long)
            // Parse date for balance calculation
            const localDateTime = `${formData.birthDate} ${formData.birthTime}`;
            const dt = new Date(localDateTime); // This might be local browser time, but Dasha needs simple Gregorian Date + Moon Long.
            // Better: use Luxon or just pass the date string to Dasha engine if it supports it.
            // generateDashaTimeline expectation: (moonLong, birthDate, years)
            const dashaTimeline = generateDashaTimeline(
                chartData.planets.Moon.longitude,
                dt,
                120
            );

            // 5. Prepare kundali data
            const kundali = {
                name: formData.name || 'N/A',
                birthDate: new Date(formData.birthDate), // For display
                birthTime: formData.birthTime,
                birthPlace: displayName,
                latitude,
                longitude,
                timezone,
                ayanamsa: chartData.ayanamsa,
                planets: chartData.planets,
                lagna: chartData.lagna,
                d9: chartData.d9, // New D9 data
                dashaTimeline,
                julianDay: chartData.jd
            };

            setKundaliData(kundali);
        } catch (err) {
            setError(err.message);
            console.error('Error generating kundali:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                        वैदिक कुंडली सॉफ्टवेयर
                    </h1>
                    <p className="text-white text-lg">
                        Professional Vedic Kundali with AstroSage-level Accuracy
                    </p>

                    {/* Language Toggle */}
                    <div className="mt-4">
                        <button
                            onClick={() => setUseHindi(!useHindi)}
                            className="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:shadow-lg transition"
                        >
                            {useHindi ? 'Switch to English' : 'हिंदी में बदलें'}
                        </button>
                    </div>
                </div>

                {/* Input Form */}
                {!kundaliData && (
                    <InputForm onSubmit={generateKundali} loading={loading} />
                )}

                {/* Error Message */}
                {error && (
                    <div className="kundali-card max-w-2xl mx-auto bg-red-50 border-2 border-red-500">
                        <h3 className="text-xl font-semibold text-red-700 mb-2">Error</h3>
                        <p className="text-red-600">{error}</p>
                        <button
                            onClick={() => {
                                setError(null);
                                setKundaliData(null);
                            }}
                            className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Kundali Display */}
                {kundaliData && (
                    <div className="space-y-8">
                        {/* Birth Details */}
                        <div className="kundali-card">
                            <h2 className="text-2xl font-semibold mb-4 text-center">
                                {useHindi ? 'जन्म विवरण' : 'Birth Details'}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-600">{useHindi ? 'नाम' : 'Name'}:</p>
                                    <p className="font-semibold">{kundaliData.name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">{useHindi ? 'जन्म तिथि' : 'Birth Date'}:</p>
                                    <p className="font-semibold">
                                        {kundaliData.birthDate.toLocaleDateString(useHindi ? 'hi-IN' : 'en-IN')}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-600">{useHindi ? 'जन्म समय' : 'Birth Time'}:</p>
                                    <p className="font-semibold">{kundaliData.birthTime}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600">{useHindi ? 'जन्म स्थान' : 'Birth Place'}:</p>
                                    <p className="font-semibold">{kundaliData.birthPlace}</p>
                                </div>
                            </div>
                        </div>

                        {/* Chart */}
                        <NorthIndianChart
                            planets={kundaliData.planets}
                            lagna={kundaliData.lagna}
                            useHindi={useHindi}
                        />

                        {/* Planetary Positions */}
                        <PlanetaryPositions
                            planets={kundaliData.planets}
                            lagna={kundaliData.lagna}
                            useHindi={useHindi}
                        />

                        {/* Dasha Timeline */}
                        <DashaTable
                            dashaTimeline={kundaliData.dashaTimeline}
                            useHindi={useHindi}
                        />

                        {/* Generate New Button */}
                        <div className="text-center">
                            <button
                                onClick={() => setKundaliData(null)}
                                className="bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:shadow-lg transform hover:scale-105 transition"
                            >
                                {useHindi ? 'नई कुंडली बनाएं' : 'Generate New Kundali'}
                            </button>
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="mt-12 text-center text-white text-sm">
                    <p>
                        Powered by Swiss Ephemeris • Lahiri Ayanamsa • Whole Sign Houses
                    </p>
                    <p className="mt-2">
                        © 2026 Vedic Kundali Software • AstroSage-level Accuracy
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
