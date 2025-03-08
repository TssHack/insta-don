const { Telegraf } = require('telegraf');
const axios = require('axios');

// 🔹 جایگزین کنید با توکن واقعی ربات تلگرام
const BOT_TOKEN = 'YOUR_BOT_TOKEN';
const bot = new Telegraf(BOT_TOKEN);

// 🎯 تابع بررسی لینک اینستاگرام
const isValidInstagramReel = (url) => {
    return url.includes('instagram.com/reel/') || url.includes('instagram.com/p/');
};

// 📥 دریافت پیام‌های چت
bot.on('text', async (ctx) => {
    const message = ctx.message.text.trim();

    // 🔎 بررسی لینک اینستاگرام
    if (isValidInstagramReel(message)) {
        try {
            // ⏳ نمایش تایپینگ هنگام پردازش درخواست
            await ctx.telegram.sendChatAction(ctx.chat.id, 'typing');

            // 🚀 ارسال درخواست به API
            const apiUrl = `https://open.wiki-api.ir/apis-1/InstagramDownloader?url=${encodeURIComponent(message)}`;
            const response = await axios.get(apiUrl);

            // ✅ بررسی موفقیت درخواست
            if (response.data.status && response.data.results.medias.length > 0) {
                const videoUrl = response.data.results.medias[0].download_link;
                const owner = response.data.results.owner || 'نامشخص';
                const caption = response.data.results.caption || 'بدون کپشن';
                const views = response.data.results.views || 'نامشخص';
                const shares = response.data.results.shares || 'نامشخص';
                const comments = response.data.results.comments || 'نامشخص';

                // 🎥 ارسال ویدیو همراه با کپشن
                await ctx.replyWithVideo(
                    { url: videoUrl },
                    {
                        caption: `🎬 **ویدیوی اینستاگرام دریافت شد!**\n\n👤 **سازنده:** _${owner}_\n📌 **کپشن:** _${caption}_\n👀 **بازدیدها:** _${views}_\n🔄 **اشتراک‌گذاری:** _${shares}_\n💬 **نظرات:** _${comments}_\coder : @abj0o`,
                        parse_mode: 'Markdown'
                    }
                );

            } else {
                await ctx.reply('⚠️ **خطا:** ویدیو یافت نشد! لطفاً لینک را بررسی کنید.');
            }
        } catch (error) {
            console.error(error);
            await ctx.reply('🚨 **مشکلی پیش آمد!** لطفاً مجدداً تلاش کنید.');
        }
    } else {
        // ⛔️ اگر لینک نامعتبر باشد
        await ctx.reply('❌ **لطفاً یک لینک معتبر اینستاگرام ارسال کنید!**\n\n🔹 فقط لینک‌های **Reels** و **پست‌ها** پشتیبانی می‌شوند.');
    }
});

// 🚀 راه‌اندازی ربات
bot.launch().then(() => console.log('🤖 Bot is running...'));

// 🛑 کنترل سیگنال‌های خروجی برای توقف ایمن ربات
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
