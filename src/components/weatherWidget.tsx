import React, { useState, useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import "./WeatherWidget.css";

const API_KEY = "68f4e4f6af5833c99287dd7ac4627c6e";

interface WeatherData {
	name: string;
	main: {
		temp: number;
	};
	weather: {
		description: string;
	}[];
}

const WeatherWidget: React.FC = () => {
	const [location, setLocation] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [forecast, setForecast] = useState<boolean>(false);
	const { position, getLocation } = useGeolocation();

	useEffect(() => {
		if (position) {
			fetchWeather(position.coords.latitude, position.coords.longitude);
		}
	}, [position]);

	const fetchWeather = async (lat: number, lon: number) => {
		try {
			const endpoint = forecast ? "forecast" : "weather";
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/${endpoint}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=ru`
			);
			if (!response.ok) {
				throw new Error("Ошибка при получении данных о погоде");
			}
			const data = await response.json();
			setWeatherData(data);
		} catch (error) {
			console.error("Ошибка получения данных о погоде", error);
		}
	};

	const handleSearch = async () => {
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=ru`
			);
			if (!response.ok) {
				throw new Error("Ошибка при поиске города");
			}
			const data = await response.json();
			fetchWeather(data.coord.lat, data.coord.lon);
		} catch (error) {
			console.error("Ошибка при поиске города", error);
		}
	};

	return (
		<div className="weather-widget">
			<input
				type="text"
				placeholder="Введите город"
				value={location}
				onChange={(e) => setLocation(e.target.value)}
				className="input-field"
			/>
			<div className="buttons">
				<button onClick={handleSearch} className="button">Искать</button>
				<button onClick={getLocation} className="button">Моя геопозиция</button>
			</div>
			<div className="buttons">
				<button onClick={() => setForecast(false)} className="button">Текущая погода</button>
				<button onClick={() => setForecast(true)} className="button">Прогноз на 5 дней</button>
			</div>
			{weatherData && (
				<div className="weather-info">
					<h2>{weatherData.name}</h2>
					<p>Температура: {weatherData.main.temp}°C</p>
					<p>Погода: {weatherData.weather[0].description}</p>
				</div>
			)}
		</div>
	);
};

export default WeatherWidget;