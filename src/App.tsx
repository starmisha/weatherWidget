import React from "react";
import WeatherWidget from "./components/weatherWidget";


const App: React.FC = () => {
	return (
		<div className="app">
			<h1>Прогноз погоды</h1>
			<WeatherWidget />
		</div>
	);
};

export default App;