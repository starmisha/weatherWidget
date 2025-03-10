import React, { useState, useEffect } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import "./weatherWidget.css";

const API_KEY = "68f4e4f6af5833c99287dd7ac4627c6e";

interface WeatherData {
	name: string;
	main: {
		temp: number;
	};
	weather: {
		description: string;
	}[];
	list?: Array<{
		dt_txt: string;
		main: {
			temp: number;
		};
		weather: {
			description: string;
		}[];
	}>;
}

const WeatherWidget: React.FC = () => {
	const [location, setLocation] = useState<string>("");
	const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
	const [forecast, setForecast] = useState<boolean>(false);
	const { position, getLocation } = useGeolocation();

	// Функция для получения данных о погоде
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
			console.log(data); // Выводим данные для отладки

			if (!data.main && !data.list) {
				throw new Error("Не получены данные о температуре");
			}

			setWeatherData(data);
		} catch (error) {
			console.error("Ошибка получения данных о погоде", error);
		}
	};

	// Используем хук для геопозиции
	useEffect(() => {
		if (position.latitude !== null && position.longitude !== null) {
			fetchWeather(position.latitude, position.longitude);
		}
	}, [position]);

	// Функция для поиска города
	const handleSearch = async () => {
		if (!location.trim()) {
			// Если поле ввода пустое, выводим сообщение и прекращаем выполнение
			alert("Пожалуйста, введите название города");
			return;
		}

		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric&lang=ru`
			);
			if (!response.ok) {
				throw new Error("Ошибка при поиске города");
			}
			const data = await response.json();
			if (!data.coord) {
				throw new Error("Не удалось найти координаты города");
			}
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

			{/* Отображение текущей погоды */}
			{weatherData && !forecast && weatherData.main && (
				<div className="weather-info">
					<h2>{weatherData.name}</h2>
					<p>Температура: {weatherData.main.temp}°C</p>
					<p>Погода: {weatherData.weather[0]?.description}</p>
				</div>
			)}

			{/* Отображение прогноза на 5 дней */}
			{forecast && weatherData && weatherData.list && (
				<div className="weather-forecast">
					<h3>Прогноз на 5 дней:</h3>
					{weatherData.list.slice(0, 5).map((forecastItem, index) => (
						<div key={index} className="forecast-item">
							<p>{forecastItem.dt_txt}</p>
							<p>Температура: {forecastItem.main.temp}°C</p>
							<p>Погода: {forecastItem.weather[0]?.description}</p>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default WeatherWidget;
