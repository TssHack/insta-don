const { Telegraf } = require('telegraf');
const axios = require('axios');

// توکن ربات خود را جایگزین کنید
const bot = new Telegraf('6466766400:AAF9GJyaWWLKXOPsZayIcSF-6vGVyViS6lw');

// ارسال ویدیو به کاربر
bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  // اگر پیامی شامل لینک اینستاگرام باشد
  if (text.includes('https://www.instagram.com/reel/')) {
    const url = `http://api4dev.ir/api/ig.php?url=${text}`;
    
    try {
      // درخواست به API برای دانلود ویدیو
      const response = await axios.get(url);
      const data = response.data;

      // بررسی اینکه داده‌ها موجود است و لینک دانلود ویدیو موجود است
      if (data.ok && data.result && data.result.url) {
        const downloadLink = data.result.url;

        if (!downloadLink) {
          ctx.reply('لینک دانلود ویدیو در دسترس نیست.');
          return;
        }

        // دریافت ویدیو از لینک
        const videoResponse = await axios.get(downloadLink, { responseType: 'arraybuffer' });
        const videoBuffer = Buffer.from(videoResponse.data, 'binary');

        if (videoBuffer.length === 0) {
          ctx.reply('ویدیو خالی است یا مشکلی در بارگذاری پیش آمده. لطفاً دوباره امتحان کنید.');
          return;
        }

        // ارسال ویدیو به کاربر به‌صورت ریپلای
        const caption = `🎬 **ویدیوی اینستاگرام دریافت شد!**\n\n👤 **سازنده:** _${data.result.owner}_\n📌 **کپشن:** _${data.result.caption}_\n👀 **بازدیدها:** _${data.result.views}_\n🔄 **اشتراک‌گذاری:** _${data.result.shares}_\n💬 **نظرات:** _${data.result.comments}_`;

        await ctx.replyWithVideo({ source: videoBuffer }, { caption: caption, parse_mode: 'Markdown', reply_to_message_id: ctx.message.message_id });
      } else {
        ctx.reply('خطا در دریافت اطلاعات ویدیو. ممکن است لینک اشتباه باشد.');
      }
    } catch (error) {
      console.error('خطا در درخواست به API:', error);
      ctx.reply('مشکلی در دریافت ویدیو پیش آمده. لطفاً دوباره امتحان کنید.');
    }
  }
});

// شروع ربات
bot.launch().then(() => {
  console.log('🤖 ربات در حال اجرا است...');
}).catch((error) => {
  console.error('🚨 خطا در راه‌اندازی ربات:', error);
});
