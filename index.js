const { Telegraf } = require('telegraf');
const axios = require('axios');

// توکن ربات خود را جایگزین کنید
const bot = new Telegraf('6466766400:AAF9GJyaWWLKXOPsZayIcSF-6vGVyViS6lw');

// ارسال ویدیو به کاربر
bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  // اگر پیامی شامل لینک اینستاگرام باشد
  if (text.includes('https://www.instagram.com/reel/')) {
    const url = `https://open.wiki-api.ir/apis-1/InstagramDownloader?url=${text}`;
    
    try {
      // درخواست به API برای دانلود ویدیو
      const response = await axios.get(url);
      const data = response.data;

      // بررسی اینکه داده‌ها موجود است و لینک دانلود ویدیو موجود است
      if (data.status && data.results && data.results.medias && data.results.medias[0]) {
        const downloadLink = data.results.medias[0].download_link;

        if (!downloadLink) {
          ctx.reply('لینک دانلود ویدیو در دسترس نیست.');
          return;
        }

        // دریافت ویدیو از لینک
        const videoResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
        const videoBuffer = Buffer.from(videoResponse.data, 'binary');

        if (videoBuffer.length === 0) {
          ctx.reply('ویدیو خالی است یا مشکلی در بارگذاری پیش آمده.');
          return;
        }

        // ارسال ویدیو به کاربر
        const caption = `🎬 **ویدیوی اینستاگرام دریافت شد!**\n\n👤 **سازنده:** _${data.results.owner}_\n📌 **کپشن:** _${data.results.caption}_\n👀 **بازدیدها:** _${data.results.views}_\n🔄 **اشتراک‌گذاری:** _${data.results.shares}_\n💬 **نظرات:** _${data.results.comments}_`;

        await ctx.replyWithVideo({ source: videoBuffer }, { caption: caption, parse_mode: 'Markdown' });
      } else {
        ctx.reply('خطا در دریافت اطلاعات ویدیو.');
      }
    } catch (error) {
      console.error('خطا در درخواست به API:', error);
      ctx.reply('مشکلی در دریافت ویدیو پیش آمده.');
    }
  }
});

// شروع ربات
bot.launch().then(() => {
  console.log('🤖 ربات در حال اجرا است...');
}).catch((error) => {
  console.error('🚨 خطا در راه‌اندازی ربات:', error);
});
