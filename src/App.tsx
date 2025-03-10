import React from "react";
import WeatherWidget from "./components/WeatherWidget";
import "./styles.css"; // если нужны глобальные стили

const App: React.FC = () => {
	return (
		<div className="app">
			<h1>Прогноз погоды</h1>
			<WeatherWidget />
		</div>
	);
};

export default App;