// types/global.d.ts
interface TelegramWebApp {
    initData: string;
    photo_url: string;
}

interface Window {
    Telegram: {
        WebApp: TelegramWebApp;
        WebAppUser:TelegramWebApp;
        WebAppChat: TelegramWebApp
    };
}
