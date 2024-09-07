global.okeUrl = "https://okeconnect.com/harga/json?id=905ccd028329b0a"
global.memberId = "OK940997" //merchant order kuota
global.pin = "5005" //Pin order kuota
global.pw = "RU03" //Password order kuota

//Biaya admin saat deposit
global.pajak = 5 //Persentase biaya admin saat deposit

//Persentase keuntungan topup
global.untung = 5

//Other
global.botName = "RuztanXD" //Nama bot
global.owner = ["62895342712163","62895342712163"] //Ganti agar fitur owner bisa digunakan
global.ownerNomer = "62895342712163" //Nomor lu
global.ownerName = "Ruztan" //Nama lu
global.packname = "© RuzBotz" //Sticker wm ubah
global.author = "Di Buat Oleh Ruztan" //Sticker wm ubah nama lu
global.footer = "RuztanBotz © 2024" //Seterah
global.sessionName = "session" //Ngga usah di ganti

//Message
global.mess = {
  sukses: "Done🤗",
  admin: "Command ini hanya bisa digunakan oleh Admin Grup",
  botAdmin: "Bot Harus menjadi admin",
  owner: "Command ini hanya dapat digunakan oleh owner bot",
  prem: "Command ini khusus member premium",
  group: "Command ini hanya bisa digunakan di grup",
  private: "Command ini hanya bisa digunakan di Private Chat",
  wait: "⏳ Mohon tunggu sebentar...",
  error: {
    lv: "Link yang kamu berikan tidak valid",
    api: "Maaf terjadi kesalahan"
  }
}

//Payment
global.payment = {
  qris: {
    link: "https://telegra.ph/file/2057ade1991eef083c82b.jpg", //Link foto qris
    an: "KASIHSTORE111" //Atas nama qris
  },
  dana: {
    nope: "082192465791", //Nomor akun dana
    an: "T**O" //Atas nama akun dana
}

let fs = require('fs')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})