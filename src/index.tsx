import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // <-- Подключаем App.tsx
import "./index.css"; // Подключаем стили

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<App /> {/* <-- Рендерим App.tsx */}
	</React.StrictMode>
);