/**
 * Форматирует дату в локализованную строку (русский формат)
 */
export const formatDate = (dateString: string): string => {
	const date = new Date(dateString)
	return date.toLocaleDateString('ru-RU', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}
