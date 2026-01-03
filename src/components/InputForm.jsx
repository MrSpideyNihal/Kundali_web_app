import React, { useState } from 'react';

/**
 * Input Form Component
 * Collects birth data for Kundali generation
 */
export default function InputForm({ onSubmit, loading }) {
    const [formData, setFormData] = useState({
        birthDate: '',
        birthTime: '',
        birthPlace: '',
        name: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.birthDate) {
            newErrors.birthDate = 'जन्म तिथि आवश्यक है / Birth date is required';
        }

        if (!formData.birthTime) {
            newErrors.birthTime = 'जन्म समय आवश्यक है / Birth time is required';
        }

        if (!formData.birthPlace) {
            newErrors.birthPlace = 'जन्म स्थान आवश्यक है / Birth place is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            onSubmit(formData);
        }
    };

    return (
        <div className="kundali-card max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                वैदिक कुंडली सॉफ्टवेयर
            </h2>
            <p className="text-center text-gray-600 mb-8">
                Professional Vedic Kundali with AstroSage-level Accuracy
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        नाम / Name (Optional)
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                        placeholder="Enter name"
                    />
                </div>

                {/* Birth Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        जन्म तिथि / Birth Date <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.birthDate ? 'border-red-500' : 'border-gray-300'
                            }`}
                        max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.birthDate && (
                        <p className="mt-1 text-sm text-red-500">{errors.birthDate}</p>
                    )}
                </div>

                {/* Birth Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        जन्म समय / Birth Time <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="time"
                        name="birthTime"
                        value={formData.birthTime}
                        onChange={handleChange}
                        step="1"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.birthTime ? 'border-red-500' : 'border-gray-300'
                            }`}
                    />
                    {errors.birthTime && (
                        <p className="mt-1 text-sm text-red-500">{errors.birthTime}</p>
                    )}
                </div>

                {/* Birth Place */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        जन्म स्थान / Birth Place <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="birthPlace"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition ${errors.birthPlace ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="e.g., Mumbai, India"
                    />
                    {errors.birthPlace && (
                        <p className="mt-1 text-sm text-red-500">{errors.birthPlace}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                        Enter city name (e.g., Delhi, Mumbai, New York)
                    </p>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-orange-500 to-purple-600 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                    {loading ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Generating Kundali...
                        </span>
                    ) : (
                        'कुंडली बनाएं / Generate Kundali'
                    )}
                </button>
            </form>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    <strong>Note:</strong> This system uses Swiss Ephemeris algorithms and Lahiri Ayanamsa to ensure AstroSage-level accuracy in planetary positions, Lagna, and Dasha calculations.
                </p>
            </div>
        </div>
    );
}
