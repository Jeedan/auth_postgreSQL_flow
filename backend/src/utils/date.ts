export const oneDayInSeconds = () => 24 * 60 * 60;

export const fifteenMinutesFromNow = () =>
	new Date(Date.now() + 15 * 60 * 1000);

export const oneHourFromNow = () => new Date(Date.now() + 60 * 60 * 1000);

export const oneDayFromNow = () => new Date(Date.now() + 24 * 60 * 60 * 1000);

export const thirtyDaysFromNow = () =>
	new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
