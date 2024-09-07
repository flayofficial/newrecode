
const { default: makeWASocket, DisconnectReason, makeInMemoryStore, jidDecode, proto, getContentType, useMultiFileAuthState, downloadContentFromMessage } = require("@whiskeysockets/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const readline = require("readline");
const PhoneNumber = require('awesome-phonenumber')

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

const question = (text) => { const rl = readline.createInterface({ input: process.stdin, output: process.stdout }); return new Promise((resolve) => { rl.question(text, resolve) }) };

async function startBotz() {
const { state, saveCreds } = await useMultiFileAuthState("session")
const ptz = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
connectTimeoutMs: 60000,
defaultQueryTimeoutMs: 0,
keepAliveIntervalMs: 10000,
emitOwnEvents: true,
fireInitQueries: true,
generateHighQualityLinkPreview: true,
syncFullHistory: true,
markOnlineOnConnect: true,
browser: ["Ubuntu", "Chrome", "20.0.04"],
});

if (!ptz.authState.creds.registered) {
const phoneNumber = await question('Enter Phone Number :\n');
let code = await ptz.requestPairingCode(phoneNumber);
code = code?.match(/.{1,4}/g)?.join("-") || code;
console.log(`Pairing Code :`, code);
}

store.bind(ptz.ev)

ptz.ev.on('messages.upsert', async chatUpdate => {
try {
mek = chatUpdate.messages[0]
if (!mek.message) return
mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
if (mek.key && mek.key.remoteJid === 'status@broadcast') return
if (!ptz.public && !mek.key.fromMe && chatUpdate.type === 'notify') return
if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return
m = smsg(ptz, mek, store)
require("./case")(ptz, m, chatUpdate, store)
} catch (err) {
console.log(err)
}
})

// Setting
ptz.decodeJid = (jid) => {
if (!jid) return jid
if (/:\d+@/gi.test(jid)) {
let decode = jidDecode(jid) || {}
return decode.user && decode.server && decode.user + '@' + decode.server || jid
} else return jid
}

ptz.getName = (jid, withoutContact= false) => {
id = ptz.decodeJid(jid)
withoutContact = ptz.withoutContact || withoutContact 
let v
if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
v = store.contacts[id] || {}
if (!(v.name || v.subject)) v = ptz.groupMetadata(id) || {}
resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))
})
else v = id === '0@s.whatsapp.net' ? {
id,
name: 'WhatsApp'
} : id === ptz.decodeJid(ptz.user.id) ?
ptz.user :
(store.contacts[id] || {})
return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')
}

ptz.public = true

ptz.serializeM = (m) => smsg(ptz, m, store);
ptz.ev.on('connection.update', (update) => {
const { connection, lastDisconnect } = update;
if (connection === 'close') {
let reason = new Boom(lastDisconnect?.error)?.output.statusCode;
if (reason === DisconnectReason.badSession || reason === DisconnectReason.connectionClosed || reason === DisconnectReason.connectionLost || reason === DisconnectReason.connectionReplaced || reason === DisconnectReason.restartRequired || reason === DisconnectReason.timedOut) {
startBotz();
} else if (reason === DisconnectReason.loggedOut) {
} else {
ptz.end(`Unknown DisconnectReason: ${reason}|${connection}`);
}
} else if (connection === 'open') {
console.log('[Connected] ' + JSON.stringify(ptz.user.id, null, 2));
}
});

ptz.ev.on('creds.update', saveCreds)

ptz.sendText = (jid, text, quoted = '', options) => ptz.sendMessage(jid, { text: text, ...options }, { quoted })

ptz.downloadMediaMessage = async (message) => {
let mime = (message.msg || message).mimetype || ''
let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
const stream = await downloadContentFromMessage(message, messageType)
let buffer = Buffer.from([])
for await(const chunk of stream) {
buffer = Buffer.concat([buffer, chunk])
}
return buffer
}

return ptz
}

startBotz()

function smsg(ptz, m, store) {
if (!m) return m
let M = proto.WebMessageInfo
if (ronzz.key) {
ronzz.id = ronzz.key.id
ronzz.isBaileys = ronzz.id.startsWith('BAE5') && ronzz.id.length === 16
ronzz.chat = ronzz.key.remoteJid
ronzz.fromMe = ronzz.key.fromMe
ronzz.isGroup = ronzz.chat.endsWith('@g.us')
ronzz.sender = ptz.decodeJid(ronzz.fromMe && ptz.user.id || ronzz.participant || ronzz.key.participant || ronzz.chat || '')
if (ronzz.isGroup) ronzz.participant = ptz.decodeJid(ronzz.key.participant) || ''
}
if (ronzz.message) {
ronzz.mtype = getContentType(ronzz.message)
ronzz.msg = (ronzz.mtype == 'viewOnceMessage' ? ronzz.message[ronzz.mtype].message[getContentType(ronzz.message[ronzz.mtype].message)] : ronzz.message[ronzz.mtype])
ronzz.body = ronzz.message.conversation || ronzz.msg.caption || ronzz.msg.text || (ronzz.mtype == 'listResponseMessage') && ronzz.msg.singleSelectReply.selectedRowId || (ronzz.mtype == 'buttonsResponseMessage') && ronzz.msg.selectedButtonId || (ronzz.mtype == 'viewOnceMessage') && ronzz.msg.caption || ronzz.text
let quoted = ronzz.quoted = ronzz.msg.contextInfo ? ronzz.msg.contextInfo.quotedMessage : null
ronzz.mentionedJid = ronzz.msg.contextInfo ? ronzz.msg.contextInfo.mentionedJid : []
if (ronzz.quoted) {
let type = getContentType(quoted)
ronzz.quoted = ronzz.quoted[type]
if (['productMessage'].includes(type)) {
type = getContentType(ronzz.quoted)
ronzz.quoted = ronzz.quoted[type]
}
if (typeof ronzz.quoted === 'string') ronzz.quoted = {
text: ronzz.quoted
}
ronzz.quoted.mtype = type
ronzz.quoted.id = ronzz.msg.contextInfo.stanzaId
ronzz.quoted.chat = ronzz.msg.contextInfo.remoteJid || ronzz.chat
ronzz.quoted.isBaileys = ronzz.quoted.id ? ronzz.quoted.id.startsWith('BAE5') && ronzz.quoted.id.length === 16 : false
ronzz.quoted.sender = ptz.decodeJid(ronzz.msg.contextInfo.participant)
ronzz.quoted.fromMe = ronzz.quoted.sender === ptz.decodeJid(ptz.user.id)
ronzz.quoted.text = ronzz.quoted.text || ronzz.quoted.caption || ronzz.quoted.conversation || ronzz.quoted.contentText || ronzz.quoted.selectedDisplayText || ronzz.quoted.title || ''
ronzz.quoted.mentionedJid = ronzz.msg.contextInfo ? ronzz.msg.contextInfo.mentionedJid : []
ronzz.getQuotedObj = ronzz.getQuotedMessage = async () => {
if (!ronzz.quoted.id) return false
let q = await store.loadMessage(ronzz.chat, ronzz.quoted.id, conn)
 return exports.smsg(conn, q, store)
}
let vM = ronzz.quoted.fakeObj = ronzz.fromObject({
key: {
remoteJid: ronzz.quoted.chat,
fromMe: ronzz.quoted.fromMe,
id: ronzz.quoted.id
},
message: quoted,
...(ronzz.isGroup ? { participant: ronzz.quoted.sender } : {})
})
ronzz.quoted.delete = () => ptz.sendMessage(ronzz.quoted.chat, { delete: vronzz.key })
ronzz.quoted.copyNForward = (jid, forceForward = false, options = {}) => ptz.copyNForward(jid, vM, forceForward, options)
ronzz.quoted.download = () => ptz.downloadMediaMessage(ronzz.quoted)
}
}
if (ronzz.msg.url) ronzz.download = () => ptz.downloadMediaMessage(ronzz.msg)
ronzz.text = ronzz.msg.text || ronzz.msg.caption || ronzz.message.conversation || ronzz.msg.contentText || ronzz.msg.selectedDisplayText || ronzz.msg.title || ''
ronzz.reply = (text, chatId = ronzz.chat, options = {}) => Buffer.isBuffer(text) ? ptz.sendMedia(chatId, text, 'file', '', m, { ...options }) : ptz.sendText(chatId, text, m, { ...options })
ronzz.copy = () => exports.smsg(conn, ronzz.fromObject(ronzz.toObject(m)))
ronzz.copyNForward = (jid = ronzz.chat, forceForward = false, options = {}) => ptz.copyNForward(jid, m, forceForward, options)

return m
}


let file = require.resolve(__filename)
fs.watchFile(file, () => {
fs.unwatchFile(file)
console.log(`Update ${__filename}`)
delete require.cache[file]
require(file)
})
