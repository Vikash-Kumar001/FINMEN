/**
 * Holidays Service
 * Fetches worldwide festivals and holidays using Nager.Date API
 */

const HOLIDAYS_API_BASE = 'https://date.nager.at/api/v3';

/**
 * Get list of available countries
 */
export const getAvailableCountries = async () => {
    try {
        const response = await fetch(`${HOLIDAYS_API_BASE}/AvailableCountries`);
        if (!response.ok) throw new Error('Failed to fetch countries');
        return await response.json();
    } catch (error) {
        console.error('Error fetching countries:', error);
        // Return popular countries as fallback
        return [
            // Major English-speaking countries
            { countryCode: 'US', name: 'United States' },
            { countryCode: 'GB', name: 'United Kingdom' },
            { countryCode: 'CA', name: 'Canada' },
            { countryCode: 'AU', name: 'Australia' },
            { countryCode: 'NZ', name: 'New Zealand' },
            { countryCode: 'IE', name: 'Ireland' },
            
            // Asia
            { countryCode: 'IN', name: 'India' },
            { countryCode: 'CN', name: 'China' },
            { countryCode: 'JP', name: 'Japan' },
            { countryCode: 'KR', name: 'South Korea' },
            { countryCode: 'SG', name: 'Singapore' },
            { countryCode: 'MY', name: 'Malaysia' },
            { countryCode: 'TH', name: 'Thailand' },
            { countryCode: 'PH', name: 'Philippines' },
            { countryCode: 'VN', name: 'Vietnam' },
            { countryCode: 'ID', name: 'Indonesia' },
            
            // Europe
            { countryCode: 'DE', name: 'Germany' },
            { countryCode: 'FR', name: 'France' },
            { countryCode: 'IT', name: 'Italy' },
            { countryCode: 'ES', name: 'Spain' },
            { countryCode: 'NL', name: 'Netherlands' },
            { countryCode: 'BE', name: 'Belgium' },
            { countryCode: 'CH', name: 'Switzerland' },
            { countryCode: 'AT', name: 'Austria' },
            { countryCode: 'SE', name: 'Sweden' },
            { countryCode: 'NO', name: 'Norway' },
            { countryCode: 'DK', name: 'Denmark' },
            { countryCode: 'FI', name: 'Finland' },
            { countryCode: 'PL', name: 'Poland' },
            { countryCode: 'PT', name: 'Portugal' },
            { countryCode: 'GR', name: 'Greece' },
            { countryCode: 'TR', name: 'Turkey' },
            { countryCode: 'CZ', name: 'Czech Republic' },
            { countryCode: 'HU', name: 'Hungary' },
            { countryCode: 'RO', name: 'Romania' },
            
            // Americas
            { countryCode: 'BR', name: 'Brazil' },
            { countryCode: 'MX', name: 'Mexico' },
            { countryCode: 'AR', name: 'Argentina' },
            { countryCode: 'CL', name: 'Chile' },
            { countryCode: 'CO', name: 'Colombia' },
            { countryCode: 'PE', name: 'Peru' },
            
            // Middle East & Africa
            { countryCode: 'AE', name: 'United Arab Emirates' },
            { countryCode: 'SA', name: 'Saudi Arabia' },
            { countryCode: 'ZA', name: 'South Africa' },
            { countryCode: 'EG', name: 'Egypt' },
            { countryCode: 'NG', name: 'Nigeria' },
            { countryCode: 'KE', name: 'Kenya' },
            { countryCode: 'MA', name: 'Morocco' },
        ];
    }
};

/**
 * Get public holidays for a specific country and year
 */
export const getHolidays = async (countryCode, year) => {
    try {
        const response = await fetch(`${HOLIDAYS_API_BASE}/PublicHolidays/${year}/${countryCode}`);
        
        if (!response.ok) {
            // If response is not ok, return empty array
            if (response.status === 404) {
                console.warn(`No holidays found for ${countryCode} in ${year}`);
                return [];
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        // Get text first to check if it's empty
        const text = await response.text();
        if (!text || text.trim() === '') {
            // Empty response - some countries may not have holidays data
            return [];
        }
        
        // Try to parse JSON (even if content-type header is missing)
        let holidays;
        try {
            holidays = JSON.parse(text);
        } catch (parseError) {
            // Invalid JSON - silently return empty array
            return [];
        }
        
        // Ensure holidays is an array
        if (!Array.isArray(holidays)) {
            console.warn(`Invalid holidays data format for ${countryCode}`);
            return [];
        }
        
        return holidays.map(holiday => ({
            ...holiday,
            date: new Date(holiday.date),
            isGlobal: holiday.global || false,
            counties: holiday.counties || null,
            launchYear: holiday.launchYear || null,
        }));
    } catch (error) {
        // Only log non-expected errors
        if (error.message && !error.message.includes('HTTP error') && !error.message.includes('parse')) {
            console.error(`Error fetching holidays for ${countryCode}:`, error);
        }
        return [];
    }
};

/**
 * Get holidays for multiple countries
 */
export const getMultiCountryHolidays = async (countryCodes, year) => {
    try {
        const promises = countryCodes.map(code => getHolidays(code, year));
        const results = await Promise.all(promises);
        
        // Combine and deduplicate holidays
        const holidayMap = new Map();
        results.forEach((holidays, index) => {
            holidays.forEach(holiday => {
                const dateKey = holiday.date.toISOString().split('T')[0];
                if (!holidayMap.has(dateKey)) {
                    holidayMap.set(dateKey, []);
                }
                holidayMap.get(dateKey).push({
                    ...holiday,
                    countryCode: countryCodes[index],
                });
            });
        });
        
        return holidayMap;
    } catch (error) {
        console.error('Error fetching multi-country holidays:', error);
        return new Map();
    }
};

/**
 * Get holiday emoji based on holiday name
 */
export const getHolidayEmoji = (holidayName) => {
    const name = holidayName.toLowerCase();
    
    // New Year
    if (name.includes('new year')) return '🎉';
    // Christmas
    if (name.includes('christmas')) return '🎄';
    // Easter
    if (name.includes('easter')) return '🐰';
    // Independence Day
    if (name.includes('independence')) return '🇺🇸';
    // Thanksgiving
    if (name.includes('thanksgiving')) return '🦃';
    // Valentine's Day
    if (name.includes('valentine')) return '💝';
    // Halloween
    if (name.includes('halloween')) return '🎃';
    // Diwali
    if (name.includes('diwali')) return '🪔';
    // Holi
    if (name.includes('holi')) return '🎨';
    // Eid
    if (name.includes('eid')) return '🌙';
    // Ramadan
    if (name.includes('ramadan')) return '🌙';
    // Chinese New Year
    if (name.includes('chinese new year') || name.includes('lunar new year')) return '🧧';
    // National Day
    if (name.includes('national day')) return '🎊';
    // Labor Day
    if (name.includes('labor') || name.includes('labour')) return '👷';
    // Mother's Day
    if (name.includes("mother's day") || name.includes("mothers day")) return '👩';
    // Father's Day
    if (name.includes("father's day") || name.includes("fathers day")) return '👨';
    // Birthday
    if (name.includes('birthday')) return '🎂';
    // Festival
    if (name.includes('festival')) return '🎪';
    // Day
    if (name.includes('day')) return '📅';
    
    return '🎉'; // Default emoji
};

/**
 * Get holiday color based on type
 */
export const getHolidayColor = (holidayName) => {
    const name = holidayName.toLowerCase();
    
    if (name.includes('christmas')) return 'from-red-300 to-green-300 border-red-400';
    if (name.includes('new year')) return 'from-yellow-300 to-pink-300 border-yellow-400';
    if (name.includes('independence')) return 'from-blue-300 to-red-300 border-blue-400';
    if (name.includes('diwali') || name.includes('holi')) return 'from-orange-300 to-yellow-300 border-orange-400';
    if (name.includes('eid') || name.includes('ramadan')) return 'from-green-300 to-emerald-300 border-green-400';
    
    return 'from-purple-300 to-pink-300 border-purple-400';
};

