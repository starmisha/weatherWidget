import { useState, useEffect } from "react";

export const useGeolocation = () => {
	const [position, setPosition] = useState<{ latitude: number | null; longitude: number | null }>({
		latitude: null,
		longitude: null,
	});
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const getLocation = () => {
		if (!navigator.geolocation) {
			setError("Геолокация не поддерживается браузером.");
			setLoading(false);
			return;
		}

		setLoading(true);
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
	};

	// Запрашиваем местоположение при загрузке
	useEffect(() => {
		getLocation();
	}, []);

	return { position, loading, error, getLocation };
};