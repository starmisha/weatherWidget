import { useState, useEffect } from "react";

export const useGeolocation = () => {
	const [position, setPosition] = useState({ latitude: null, longitude: null });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Геолокация не поддерживается браузером.");
			setLoading(false);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(pos) => {
				setPosition({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
				});
				setLoading(false);
			},
			(err) => {
				setError(err.message);
				setLoading(false);
			}
		);
	}, []); // Пустой массив зависимостей → запускается один раз при загрузке

	return { position, loading, error };
};
