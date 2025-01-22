// src/utils/ngrok.ts
import logger from './logger';

export async function getNgrokUrl(): Promise<string | null> {
    try {
        const response = await fetch('http://localhost:4040/api/tunnels');

        if (!response.ok) {
            throw new Error(`Ngrok API responded with status ${response.status}`);
        }

        const data = await response.json();

        // Проверяем структуру ответа
        if (!data.tunnels || !Array.isArray(data.tunnels)) {
            throw new Error('Invalid ngrok API response structure');
        }

        // Ищем первый HTTPS-туннель
        const httpsTunnel = data.tunnels.find(
            (t: any) => t.proto === 'https' && t.public_url
        );

        if (!httpsTunnel) {
            throw new Error('No active HTTPS tunnels found');
        }

        logger.info(`Ngrok URL получен: ${httpsTunnel.public_url}`);
        return httpsTunnel.public_url;

    } catch (error) {
        logger.error('Ошибка при получении Ngrok URL:', error);
        return null;
    }
}