
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');
require('dotenv').config();
const client = new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages,GatewayIntentBits.MessageContent,GatewayIntentBits.GuildMembers,GatewayIntentBits.GuildVoiceStates],partials:[Partials.Channel]});
const prefix="!";
client.once("ready",()=>console.log(`${client.user.tag} מחובר בהצלחה`));
client.on("messageCreate", async message=>{
 if(message.author.bot||!message.content.startsWith(prefix)) return;
 const args=message.content.slice(prefix.length).trim().split(/ +/); const cmd=args.shift().toLowerCase();
 if(cmd==="h"){
   const voice=message.member.voice.channel?`נמצא בוויס: ${message.member.voice.channel.name}`:"לא נמצא בוויס";
   const embed=new EmbedBuilder().setColor("Gold").setTitle("🚨 משתמש צריך עזרה").setDescription(`${message.author}\n${voice}`);
   const row=new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId("take_help").setLabel("אני לוקח").setStyle(ButtonStyle.Success));
   return message.channel.send({embeds:[embed],components:[row]});
 }
 if(cmd==="clear"){ if(message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) await message.channel.bulkDelete(parseInt(args[0])||1); }
 if(cmd==="kick"){ const u=message.mentions.members.first(); if(u&&message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) await u.kick(); }
 if(cmd==="ban"){ const u=message.mentions.members.first(); if(u&&message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) await u.ban(); }
 if(cmd==="warn"){ const u=message.mentions.users.first(); const reason=args.slice(1).join(" ")||"ללא סיבה"; if(u) message.channel.send(`${u} קיבלת אזהרה: ${reason}`); }
 if(cmd==="mute"){ const u=message.mentions.members.first(); const mins=parseInt(args[1])||1; const reason=args.slice(2).join(" ")||"ללא סיבה"; if(u) {await u.timeout(mins*60000,reason); message.channel.send(`${u} קיבל מיוט ל-${mins} דקות`);} }
});
client.on("interactionCreate", async i=>{
 if(!i.isButton()) return;
 if(i.customId==="take_help"){
   const role=i.guild.roles.cache.find(r=>r.name==="Staff");
   if(!role || !i.member.roles.cache.has(role.id)) return i.reply({content:"אין לך הרשאה",ephemeral:true});
   return i.reply({content:`${i.user} לקח את הקריאה`});
 }
});
client.login(process.env.TOKEN);
