const fs = require('fs');
const readline = require('readline-sync');
const Discord = require('discord-simple-api');

const TOKENS_FILE = 'tokentersimpan.json';

// Menu awal
console.log('MENU');
console.log('1. Token baru');
console.log('2. Token tersimpan');

const menu = readline.question('Pilih menu (1/2): ');

let botList = [];

if (menu === '1') {
  const jumlah = readline.questionInt('Masukkan jumlah bot: ');
  for (let i = 0; i < jumlah; i++) {
    const token = readline.question(`Masukkan Bot token${i + 1}: `);
    const pesan = readline.question(`Isi pesan Bot token${i + 1}: `);
    botList.push({ [`BOT_TOKEN${i + 1}`]: token, PESAN: pesan });
  }

  fs.writeFileSync(TOKENS_FILE, JSON.stringify(botList, null, 2));
  console.log('✅ Token berhasil disimpan ke tokentersimpan.json');
} else if (menu === '2') {
  if (fs.existsSync(TOKENS_FILE)) {
    const fileData = fs.readFileSync(TOKENS_FILE);
    botList = JSON.parse(fileData);
  } else {
    console.log('❌ File tokentersimpan.json tidak ditemukan.');
    process.exit(1);
  }
} else {
  console.log('❌ Pilihan menu tidak valid.');
  process.exit(1);
}

// Masukkan Channel ID
const channelId = readline.question('Masukkan Channel ID: ');

// Masukkan durasi looping (dalam menit)
const durasiMenit = readline.questionInt('Masukkan durasi looping (dalam menit): ');
const durasiDetik = durasiMenit * 60;

// Fungsi kirim pesan semua bot
function kirimSemuaPesan() {
  console.log(`\n📤 Mengirim pesan...`);
  botList.forEach((botObj, index) => {
    const tokenKey = Object.keys(botObj)[0]; // BOT_TOKEN1, BOT_TOKEN2, ...
    const token = botObj[tokenKey];
    const pesan = botObj.PESAN;

    const bot = new Discord(token);

    bot.sendMessageToChannel(channelId, pesan)
      .then(() => {
        console.log(`✅ Pesan dari ${tokenKey} berhasil dikirim.`);
      })
      .catch((err) => {
        console.log(`❌ Gagal mengirim pesan dari ${tokenKey}: ${err.message}`);
      });
  });
}

// Fungsi countdown animasi
function countdown(seconds) {
  const interval = setInterval(() => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    process.stdout.write(`\r⏳ Hitung mundur ke pengiriman berikutnya: ${h}:${m}:${s}`);
    seconds--;

    if (seconds < 0) {
      clearInterval(interval);
      console.log('\n🕕 Waktu kirim pesan berikutnya!');
      mainLoop(); // Jalankan ulang
    }
  }, 1000);
}

// Fungsi utama loop
function mainLoop() {
  kirimSemuaPesan();
  countdown(durasiDetik); // berdasarkan input user
}

// Mulai loop pertama
mainLoop();
