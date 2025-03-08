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
        const redirectUrl = data.result.url;

        try {
          // دریافت لینک نهایی ویدیو
          const videoResponse = await axios.get(redirectUrl, {
            maxRedirects: 5,
            responseType: 'stream' // دریافت مستقیم فایل ویدیو
          });

          console.log('📥 دریافت لینک نهایی ویدیو:', redirectUrl);

          // ارسال ویدیو به کاربر
          await ctx.replyWithVideo({ source: videoResponse.data }, {
            caption: `🎥 **ویدیوی اینستاگرام دریافت شد!**\n\n👤 **سازنده:** _${data.result.owner}_\n📌 **کپشن:** _${data.result.caption}_\n👀 **بازدیدها:** _${data.result.views}_\n💬 **نظرات:** _${data.result.comments}_\n🔄 **اشتراک‌گذاری:** _${data.result.shares}_`,
            parse_mode: 'Markdown',
            reply_to_message_id: ctx.message.message_id
          });

        } catch (error) {
          console.error('🚨 خطا در دانلود ویدیو:', error);
          ctx.reply('❌ مشکلی در ارسال ویدیو پیش آمد. لطفاً دوباره امتحان کنید.');
        }

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
