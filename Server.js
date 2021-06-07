const Discord = require("discord.js");
const fs = require("fs");
const client = new Discord.Client({ disableEveryone: true, disabledEvents: ['TYPING_START'] });

client.login("").catch(console.error); //Eğer Glitch Kullanıyor İseniz Token Kısmına "process.env.Token" Yazınız Ve .env Dosyası Oluşturup Tokeni Oraya Koyunuz.
const prefix = ("")

client.on("ready", ()=> {
  console.log(`[Bilgilendirme] ${client.user.username} Başarıyla Aktifleştirildi!`)
  client.user.setPresence({activity: {name: "Valschion Boş Altyapı ❤️", type:"WATCHING"}, status: "dnd"})
});

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.categories = fs.readdirSync("./Commands/");
["Command"].forEach(handler => { require(`./Handlers/${handler}`)(client); });


client.on('message', async message => {
  const prefixMention = new RegExp(`^<@!?${client.user.id}>( |)$`);
  if (message.content.match(prefixMention)) {
    return message.channel.send(`> **Merhaba <@${message.author.id}>, Benim Prefixim: \`${prefix}\`**`);
  }
  if(message.author.bot || message.channel.type === "dm") return;
  if (!message.content.startsWith(prefix)) return;
  if (!message.guild) return;
  if (!message.member) message.member = await message.guild.fetchMember(message);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  if (cmd.length == 0) return;
  let command = client.commands.get(cmd)
  if (!command) command = client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args)
});
