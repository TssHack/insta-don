const { Telegraf } = require('telegraf');
const axios = require('axios');

const bot = new Telegraf('6466766400:AAF9GJyaWWLKXOPsZayIcSF-6vGVyViS6lw');

bot.on('text', async (ctx) => {
  const text = ctx.message.text;

  if (text.includes('https://www.instagram.com/reel/')) {
    const apiUrl = `http://api4dev.ir/api/ig.php?url=${text}`;

    try {
      const response = await axios.get(apiUrl);
      const data = response.data;

      if (data.ok && data.result && data.result.url) {
        let videoUrl = data.result.url;

        // بررسی نوع لینک (MP4 بودن)
        const headResponse = await axios.head(videoUrl);
        const contentType = headResponse.headers['content-type'];

        if (!contentType.includes('video/mp4')) {
          console.error('🚨 لینک دریافت‌شده، فایل ویدیویی نیست!');
          return ctx.reply('❌ خطا: ویدیوی دریافت‌شده، یک فایل MP4 معتبر نیست.');
        }

        console.log('📥 لینک ویدیو دریافت شد:', videoUrl);

        // ارسال ویدیو
        await ctx.replyWithVideo(videoUrl, {
          caption: `🎥 **ویدیوی اینستاگرام دریافت شد!**\n\n👤 **سازنده:** _${data.result.owner}_\n📌 **کپشن:** _${data.result.caption}_\n👀 **بازدیدها:** _${data.result.views}_\n💬 **نظرات:** _${data.result.comments}_\n🔄 **اشتراک‌گذاری:** _${data.result.shares}_`,
          parse_mode: 'Markdown',
          reply_to_message_id: ctx.message.message_id
        });

      } else {
        ctx.reply('⚠️ خطا در دریافت اطلاعات ویدیو. ممکن است لینک اشتباه باشد.');
      }
    } catch (error) {
      console.error('🚨 خطا در درخواست به API:', error);
      ctx.reply('❌ مشکلی در دریافت ویدیو پیش آمده. لطفاً دوباره امتحان کنید.');
    }
  }
});

bot.launch().then(() => {
  console.log('🤖 ربات در حال اجرا است...');
}).catch((error) => {
  console.error('🚨 خطا در راه‌اندازی ربات:', error);
});
