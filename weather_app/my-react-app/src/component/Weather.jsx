import React, { useState, useEffect } from 'react';
import { Box, Input, Flex, Spacer, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDroplet, faWind, faCompass } from '@fortawesome/free-solid-svg-icons';

// Load environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const apiKey = import.meta.env.VITE_API_KEY;
const apiUnit = import.meta.env.VITE_API_UNIT;

const Weather = () => {
    // Define state variables
    const [weatherData, setWeatherData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [name, setName] = useState('London');

    // Fetch weather data when the component mounts or 'name' changes
    useEffect(() => {
        const fetchData = async () => {
            // Check if city name is provided
            if (!name) {
                setError('Please enter a city name.');
                setIsLoading(false);
                return;
            }

            try {
                // Construct the API URL
                const url = `${apiUrl}?q=${encodeURIComponent(name)}&appid=${apiKey}&units=${apiUnit}`;

                // Fetch data from the API
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    setWeatherData(data); // Update weather data
                } else {
                    setError('City not found'); // Handle city not found error
                }
            } catch (error) {
                console.error(error);
                setError('An error occurred while fetching data.'); // Handle fetch error
            } finally {
                setIsLoading(false); // Set loading to false
            }
        };

        fetchData();
    }, [name]); // Dependency array

    // Handle input change
    const handleChange = (e) => {
        setName(e.target.value);
        setError(null); // Clear previous error when user types something new
    };

    return (
        <Flex width='100%' height='100vh' align='center' justify='center'>
            <Box className='element-search-display' padding={{ base: '10px 10px', sm: '10px 10px', md: '20px 20px', lg: '40px 40px' }} width={{ base: '80%', sm: '80%', md: '100%', lg: '100%' }}>
                <Box className='element-search-container'>
                    <Input id='name' value={name} onChange={handleChange} className='element-search' placeholder='Search...' border='none' borderBottom='1px solid #CCCCCC' focusBorderColor='transparent' _focus={{ borderBottomColor: '#000', outline: 'none' }} />
                </Box>
                <Box className='element-display'>
                    <Flex width='100%' align='center' justify='center'>
                        <h2 className='weather-display'>Current Forecast</h2>
                    </Flex>
                    <Flex>
                        <Box className='element-information' width='100%'>
                            {isLoading && <Text fontWeight='regular'>Loading...</Text>}
                            {error && <h3 fontWeight='regular' className='error-message'>{error}</h3>}
                            {weatherData && (
                                <>
                                    <h4 color='grey'>{weatherData.name}</h4>
                                    {weatherData.weather && weatherData.weather[0] && (
                                        <img
                                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`}
                                            alt="Weather Icon"
                                        />
                                    )}
                                    <h1>{weatherData.main.temp}<sup>°</sup></h1>
                                    {weatherData.weather && weatherData.weather[0] && (
                                        <h4>{weatherData.weather[0].description}</h4>
                                    )}
                                </>
                            )}
                        </Box>
                        <Spacer />
                        <Box className='element-information' width='100%'>
                            <h3>
                                <FontAwesomeIcon icon={faDroplet} /> Humidity: {weatherData && weatherData.main.humidity}%
                            </h3>
                            <h3>
                                <FontAwesomeIcon icon={faWind} /> Winds: {weatherData && weatherData.wind.speed} m/s
                            </h3>
                            <h3>
                                <FontAwesomeIcon icon={faCompass} /> Pressure: {weatherData && weatherData.main.pressure} hPa
                            </h3>
                        </Box>
                    </Flex>
                </Box>
            </Box>
        </Flex>
    );
};

export default Weather;
