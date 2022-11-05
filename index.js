//require("dotenv").config()
const Discord = require("discord.js");
const axios = require("axios");
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  //password: 'insertPassword',
  port: 5432,
  url:'jdbc:postgresql://localhost:5432/postgres',
});
const client = new Discord.Client();
const search = require('youtube-search');
const config = require('./config.json');
const repeat = require('repeat-string');


//TODO: Add no connection check
client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`)
  client.channels.get(`692104999454376029`).send(`I'm online once again!`)//bot-debugging
  //client.channels.get(`658433735263256600`).send(`I'm online once again!`)
  
  /*//this does work
  //counting
  var optionsreadwrite = {encoding:'utf-8', flag:'r+'};
  var counting = fs.readFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\counting.txt', optionsreadwrite);
  console.log('Counting from ' + counting);
  
setInterval(() => {
	client.channels.get('817051463666630657').send(counting);//817051463666630657 - #counting
	counting++;
	fs.writeFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\counting.txt', counting, optionsreadwrite);
}, 5000);
  */
  
  
  
 /*
 let channel = client.channels.get('817051463666630657');
 console.log(channel.name);
 console.log(channel.messages.fetch('818252800932577290'));
channel.messages.fetch({ limit: 1 }).then(messages => 
	console.log(messages)).catch(console.error);
  
  */
  //channel.messages.get
  /*
  var wait = 1;
  while(true){
	while(wait){
		wait = 0;
		setTimeout(() => {  
		client.channels.get('817051463666630657').send(counting);//817051463666630657 - #counting
		counting++;
		fs.writeFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\counting.txt', counting, optionsreadwrite);
		wait = 1;
		}, 1000);
	}
  }
  */
  
  
  //console.log('database');
  /*
  pool.query('SELECT message_cnt FROM messages WHERE nick = \'toms\'',(err, res) => {
	if (err) {
		console.log('db is fuccd');
		console.log(err);
	}
	console.log("Messages: " + res.rows[0].message_cnt);
  })
  */

})

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client.', err);
})


client.on("messageDelete", async msg => {
	if(annoy){
		msg.channel.send(msg.author + "'s message: **" + msg + "** was just deleted.");
		console.log('annoyed');
	}
	
});

client.on("messageReactionAdd", function(messageReaction, user){
    if(annoy){
		messageReaction.message.channel.send(user + " just added reaction " + messageReaction.emoji + ".");
		console.log('annoyed');
	}
	
});

client.on("messageReactionRemove", function(messageReaction, user){
    if(annoy){
		messageReaction.message.channel.send(user + " just removed reaction " + messageReaction.emoji + ".");
		console.log('annoyed');
	}
	
});

client.on("messageUpdate", function(oldMessage, newMessage){
	if(annoy){
		oldMessage.channel.send(oldMessage.author + " just updated **" + oldMessage + "** to **" + newMessage + "**.");
		console.log('annoyed');
	}
});

client.on("typingStart", function(channel, user){
    if(annoy){
		channel.send(user + " just started typing!");
		console.log('annoyed');
	}
});

client.on("typingStop", function(channel, user){
	if(annoy){
		channel.send(user + " just stopped typing!");
		console.log('annoyed');
	}
});

client.on("disconnect", function(event){
    console.log("Disconnect, shutting down.");
	client.channels.get("692104999454376029").send("Disconnected, shutting down.");
	client.destroy();
});



const opts = {
    maxResults: 25,
    key: config.YOUTUBE_API,
    type: 'video'
};

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min) + min
  )
}
/*
function getNickname(){
	var nick;
client.on("message", nickname => {
		nick = nickname;
	})
	console.log(nick);
	return nick;
}
*/
function checkDB(userID){
	//console.log("CHECK DB " + userID);
	pool.query(`SELECT id_user FROM messages`,(err, res) => {
		if (err) {
			console.log('db is fuccd');
			console.log(err);
		}
		var i;
		//console.log("res rowcount = " + res.rowCount);
		//console.log("USERID : " + userID);
		for(i = 0; i < res.rowCount; i++){
			//console.log("i = " + i);
			//console.log("i = " + i);
			console.log("DB = " + res.rows[i].id_user);
			//console.log("userID = " + userID);
			//console.log("compare : " + userID.localeCompare(res.rows[i].id_user));
			if(userID.localeCompare(res.rows[i].id_user) == 0){
				//console.log("STRING COMPARE?");
				return 1;
			}
			if(i == res.rowcount - 1){
				return 0;
			}
		}
		
		//console.log(res);
		//console.log(res.rows.count);
		//console.log("Messages: " + res.rows[0].message_cnt);
		//msg.channel.send(member.user.username + " has sent **" + res.rows[0].message_cnt + "** messages so far.");
	})
}
function msgAdd(msg){
	console.log("WHAT is udefined? " + msg.author.id);
	if(checkDB(msg.author.id) == 0){
		//console.log("bruh how");
		pool.query(`INSERT INTO messages VALUES ('${msg.author.id}', '${msg.author.username}', 1);`,(err, res) => {
			if (err) {
				console.log('db is fuccd');
				console.log(err);
			}
			//console.log("Messages: " + res.rows[0].message_cnt);
			//msg.channel.send(member.user.username + " has sent **" + res.rows[0].message_cnt + "** messages so far.");
			console.log("ADDED");
		})
	}else {
		var count;
		pool.query(`SELECT message_cnt FROM messages WHERE id_user = '${msg.author.id}'`,(err, res) => {
			if (err) {
				console.log('db is fuccd');
				console.log(err);
			}
			count = res.rows[0].message_cnt;
		})
		console.log(count);
		count += 1;
		console.log(count);
		pool.query(`UPDATE messages SET message_cnt = ${count} WHERE id_user = '${msg.author.id}'`,(err, res) => {
			if (err) {
				console.log('db is fuccd');
				console.log(err);
			}
			console.log("-----------------------------------------------------------------------------------------MSG ADDED");
		})
	}
}

function readMsgCount(){
	var optionsr = {encoding:'utf-8', flag:'r'};
	var x = fs.readFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\messages.txt', optionsr);
	//console.log("Num of Messages : " + numOfMessages);
	console.log("msgcount " + x);
	return x;
}
 function writeMsgCount(numOfWritten){
	var optionsw = {encoding:'utf-8', flag:'w'};
	fs.writeFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\messages.txt', numOfWritten, optionsw);
	//console.log('Write file data complete. ' + numOfMessages);
	//console.log("write");
}
function readMsgCountToms(){
	var optionsr = {encoding:'utf-8', flag:'r'};
	var x = fs.readFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\tomsmessages.txt', optionsr);
	//console.log("Num of Messages : " + numOfMessages);
	console.log("mscounttoms " + x);
	return x;
}
 function writeMsgCountToms(numOfWritten){
	var optionsw = {encoding:'utf-8', flag:'w'};
	fs.writeFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\tomsmessages.txt', numOfWritten, optionsw);
	//console.log('Write file data complete. ' + numOfMessages);
	//console.log("write");
}
function readMsgCountLukoslav(){
	var optionsr = {encoding:'utf-8', flag:'r'};
	var x = fs.readFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\lukoslavmessages.txt', optionsr);
	//console.log("Num of Messages : " + numOfMessages);
	console.log("mscountlukoslav " + x);
	return x;
}
 function writeMsgCountLukoslav(numOfWritten){
	var optionsw = {encoding:'utf-8', flag:'w'};
	fs.writeFileSync('C:\\Users\\admin\\Desktop\\DiscordBotV2\\lukoslavmessages.txt', numOfWritten, optionsw);
	//console.log('Write file data complete. ' + numOfMessages);
	//console.log("write");
}
function search69(msg) {
	if(msg.search(/^69$/g) != -1 || msg.search(" 69 ") != -1 || msg.search(/^69 /g) != -1 || msg.search(/ 69$/g) != -1 ){
		return 1;
	}
	return 0;
}
//var fd = fs.openSync(C:\Users\admin\Desktop\DiscordBotV2\messages.txt, 'r+');
//console.log(numOfMessages);
//var regex69 = /^69$/g;
var balance;
var annoy = 0;
var tragedy = 0
var calc = 0
//var msgcount = 0
var msgcount = readMsgCount();
var msgcounttoms = readMsgCountToms();
var msgcountlukoslav = readMsgCountLukoslav();
//console.log("msgcount = " + msgcount);
//console.log("msgcounttoms = " + msgcounttoms);

client.on("message", async msg => {
	if(msg.author.bot) {
		if (search69(msg.content)){
			//console.log("nice DEBUG:" + msg.content);
			msg.channel.send("nice");
			console.log("BOT nice");
			return;
		}
		return;
	}
	//msgAdd(msg);//msg adder and database reader
	/*
  if(msg.content.startsWith("db")){
	    console.log("DATABASE CALL");
	    const member = msg.mentions.members.first();
    if (!member) {
		return msg.reply(`You must mention a user.`);
    }
	console.log("user: " + member.user.id);
	let dbcall = new Promise(function(err, res) => {
		if (err) {
			console.log('db is fuccd');
			console.log(err);
		}
		console.log("Messages: " + res.rows[0].message_cnt);
		msg.channel.send(member.user.username + " has sent **" + res.rows[0].message_cnt + "** messages so far.");
	})
	
  }
  */
  
//BROKEN
if (msg.content.startsWith("query:")){
	var parse = msg.content.split(':');
	var cmd = parse[1];
	console.log(cmd);
	/*
	await pool.query(`${parse[1]}`).then => {
		console.log("DONE");
	}
	.catch(e => console.log(e));
	*/
	pool.query(`${cmd}`,(err, res) => {
		if (err) {
			console.log('db is fuccd');
			console.log(err);
		}
	})
}


  if (msg.content === "ping") {
    msg.reply("Pong!")
  }
  
  if(annoy){
	 var message = msg.content;
	msg.channel.send(msg.author + ": " + message);
	msg.delete();
	console.log('annoyed');
  }
  
  if(msg.content === "annoy"){
	if( annoy === 0){
		annoy = 1;
		msg.channel.send("I will be **anoying** now haha");
		console.log('annoy on');
	}else{
		annoy = 0;
		msg.channel.send("I won't be anoying anymore, sorry.");
		console.log('annoy off');
	}
  }
  /*
  //console.log("Author: " + msg.author);
  console.log(msg.author.id);
  console.log('<@282449464969658370>');
  */
  if(msg.author.id === '282449464969658370'){
	msgcounttoms++;
	writeMsgCountToms(msgcounttoms);
  }
  if(msg.author.id === '658420360764457001'){
	msgcountlukoslav++;
	writeMsgCountLukoslav(msgcountlukoslav);
  }
  
  if(msg.content === "msg count toms"){
	msg.channel.send("Toms has sent " + msgcounttoms + " messages.");
  }
  if(msg.content === "msg count lukoslav"){
	msg.channel.send("Lukoslav has sent " + msgcountlukoslav + " messages.");
  }
  
  if (msg.content === "online") {
    msg.channel.send("I am ALIVE")
  }
  
  if (msg.content.startsWith("*kick ")) {
    const member = msg.mentions.members.first()
    if (!member) {
      return msg.reply(
        `Who are you trying to kick? You must mention a user.`
      )
    }
    if (!member.kickable) {
      return msg.reply(`I can't kick this user. Sorry!`)
    }
    return member
      .kick()
      .then(() => msg.reply(`${member.user.tag} was kicked.`))
      .catch(error => msg.reply(`Sorry, an error occured.`))
  }
  
  if (msg.content === "hello there") {
    msg.channel.send("General Kenobi!")
  }
  
  if (msg.content === "u stupid") {
    msg.reply("no u")
  }
  
  if (msg.content === "no u") {
    msg.reply("no u")
  }
  
  if (msg.content === "damn you got me") {
    msg.reply("haha gotchu")
  }
  
  if (msg.content === "damn you") {
	msg.reply("haha, loser")
  }
  
  if (msg.content === "turn off") {
    msg.reply("Okay, you win, I'm loser, please let me live")
  }
  
  if (msg.content === "thats right") {
    msg.reply("Yes. You are so wise, Sir! And beautiful!! I will be always in your debt.");
  }
  
  if (msg.content === "call tom") {
	msg.channel.send("Sure!")
    msg.channel.send("Hey <@282449464969658370>, we want you here!")
  }
  
  if (msg.content === "call luky") {
	msg.channel.send("Sure!")
    msg.channel.send("Hey <@658420360764457001>, we want you here!")
  }
  
  if (msg.content === "count") {
    msg.channel.send(`Count is ${calc}.`)
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	console.log("count");
  }
  
  if (msg.content === "clear count" || msg.content === "count clear" || msg.content === "reset count" || msg.content === "count reset") {
	calc = 0;
    msg.channel.send(`Count was reset to zero.`)
	console.log("clear count");
  }
  
  if (msg.content.startsWith("set count ") || msg.content.startsWith("count set ")) {
	var parse = msg.content;
	var num = parse.match(/\d+/g);
	//console.log(calc)
	//console.log(num[0])
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	//console.log(number)
	msg.channel.send(`Count was set to ${number}.`)
	calc = number
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	}
	console.log("set count");
  }
  
  if (msg.content.startsWith("+")) {
	var parse = msg.content;
	var num = parse.match(/\d+/g);
	//console.log(calc)
	//console.log(num[0])
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	//console.log(number)
	msg.channel.send(`${calc} + ${number} = ${calc + number}`)
	calc = calc + number
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	}
	console.log("+ count");
  }
  
  if (msg.content.startsWith("--")) {
	var parse = msg.content;
	var num = parse.match(/\d+/g);
	//console.log(calc)
	//console.log(num[0])
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	//console.log(number)
	msg.channel.send(`${calc} - ${number} = ${calc - number}`)
	calc = calc - number
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	}
	console.log("- count");
  }
  
  if (msg.content.startsWith("*")) {
	var parse = msg.content;
	var num = parse.match(/\d+/g);
	//console.log(calc)
	//console.log(num[0])
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	//console.log(number)
	msg.channel.send(`${calc} * ${number} = ${calc * number}`)
	calc = calc * number
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	}
	console.log("* count");
  }
  
  if (msg.content.startsWith("/")) {
	var parse = msg.content;
	var num = parse.match(/\d+/g);
	//console.log(calc)
	//console.log(num[0])
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	//console.log(number)
	msg.channel.send(`${calc} / ${number} = ${calc / number}`)
	calc = calc / number
	if(calc === 69){
		msg.channel.send(`Nice`);
	}
	}
	console.log("/ count");
  }
  
  if (msg.content === "gn") {
    msg.channel.send("Good night.")
	console.log("gn");
  }
  
  if (msg.content === "flip a coin") {
    var yesno = Math.round(Math.random())
	//console.log(yesno)
	if(yesno){
		msg.channel.send("Yes!")
	}else{
		msg.channel.send("No!")
	}
	console.log("flip a coin");
  }
  
  if (msg.content === "no" && tragedy === 1) {
    msg.channel.send("I thought not. It's not a story the Jedi would tell you. It's a Sith legend.")
	tragedy--
  }else {tragedy--}
  if(tragedy <= -100){tragedy = 0}
  if (msg.content === "tell me something") {
    msg.channel.send("Did you ever hear the Tragedy of Darth Plagueis the Wise?")
	tragedy = 1
  }

  if (msg.content === "c" && msg.author.id === '282449464969658370') {
    msg.reply("check")
	//msg.reply(msgcount);
	console.log("check");
  }
  
  msgcount++;
  writeMsgCount(msgcount);
  if(msgcount === 69){
	  msg.channel.send(`We've sent ${msgcount} messages.`);
	  msg.channel.send(`NICE.`);
	  console.log("nice");
  }else if(between(0,9)%10 === 1){
	msg.channel.send(`We've sent ${msgcount} messages.`)
	console.log("random message count");
  }
  
  if (msg.content === "message count") {
    msg.channel.send(`We've sent ${msgcount} messages.`)
	if(msgcount === 69){
		msg.channel.send(`Nice`);
	}
	console.log("message count");
  }
  
  if (msg.content.startsWith("count to ")) {
	//var parse = msg.content;
	var num = msg.content.match(/\d+/g);
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
	var number = parseInt(num[0])
	var sum = 0
	var i = 1
	for(i = 1; i < number + 1; i++){
		//console.log(i)
		//msg.channel.send(`${i}`)
		sum += i
	}
	msg.channel.send(`The sum of all the numbers is ${sum}.`)
	console.log("count to");
	}
	if(sum === 69){
		msg.channel.send(`Nice`);
	}
  }
  
  if (msg.content === "DOI") {
	msg.channel.send("**THE GLORIOUS DECLARATION OF INDEPENDENCE**")
	msg.channel.send("The unanimous Declaration of the thirteen united States of America, When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation. We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed, --That whenever any Form of Government becomes destructive of these ends, it is the Right of the People to alter or to abolish it, and to institute new Government, laying its foundation on such principles and organizing its powers in such form, as to them shall seem most likely to effect their Safety and Happiness. Prudence, indeed, will dictate that Governments long established should not be changed for light and transient causes; and accordingly all experience hath shewn, that mankind are more disposed to suffer, while evils are sufferable, than to right themselves by abolishing the forms to which they are accustomed. But when a long train of abuses and usurpations, pursuing invariably the same Object evinces a design to reduce them under absolute Despotism, it is their right, it is their duty, to throw off such Government, and to provide new Guards for their future security.--Such has been the patient sufferance of these Colonies; and such is now the necessity which constrains them to alter their former Systems of Government. The history of the present King of Great Britain is a history of repeated injuries and usurpations, all having in direct object ")
	msg.channel.send("the establishment of an absolute Tyranny over these States. To prove this, let Facts be submitted to a candid world. He has refused his Assent to Laws, the most wholesome and necessary for the public good. He has forbidden his Governors to pass Laws of immediate and pressing importance, unless suspended in their operation till his Assent should be obtained; and when so suspended, he has utterly neglected to attend to them. He has refused to pass other Laws for the accommodation of large districts of people, unless those people would relinquish the right of Representation in the Legislature, a right inestimable to them and formidable to tyrants only. He has called together legislative bodies at places unusual, uncomfortable, and distant from the depository of their public Records, for the sole purpose of fatiguing them into compliance with his measures. He has dissolved Representative Houses repeatedly, for opposing with manly firmness his invasions on the rights of the people. He has refused for a long time, after such dissolutions, to cause others to be elected; whereby the Legislative powers, incapable of Annihilation, have returned to the People at large for their exercise; the State remaining in the mean time exposed to all the dangers of invasion from without, and convulsions within. He has endeavoured to prevent the population of these States; for that purpose obstructing the Laws for Naturalization of Foreigners; refusing to pass others to encourage their migrations hither, and raising the conditions of new Appropriations of Lands. He has obstructed the Administration of Justice, by refusing his Assent to Laws for establishing Judiciary powers. He has made Judges dependent on his Will alone, for the tenure of their offices, and the amount and payment of their salaries. He has erected a multitude of New Offices, and sent hither swarms of Officers to harrass our people, and eat out their substance. He has kept among us, in times of peace, ")
    msg.channel.send("Standing Armies without the Consent of our legislatures. He has affected to render the Military independent of and superior to the Civil power. He has combined with others to subject us to a jurisdiction foreign to our constitution, and unacknowledged by our laws; giving his Assent to their Acts of pretended Legislation: For Quartering large bodies of armed troops among us: For protecting them, by a mock Trial, from punishment for any Murders which they should commit on the Inhabitants of these States: For cutting off our Trade with all parts of the world: For imposing Taxes on us without our Consent: For depriving us in many cases, of the benefits of Trial by Jury: For transporting us beyond Seas to be tried for pretended offences For abolishing the free System of English Laws in a neighbouring Province, establishing therein an Arbitrary government, and enlarging its Boundaries so as to render it at once an example and fit instrument for introducing the same absolute rule into these Colonies: For taking away our Charters, abolishing our most valuable Laws, and altering fundamentally the Forms of our Governments: For suspending our own Legislatures, and declaring themselves invested with power to legislate for us in all cases whatsoever. He has abdicated Government here, by declaring us out of his Protection and waging War against us. He has plundered our seas, ravaged our Coasts, burnt our towns, and destroyed the lives of our people. He is at this time transporting large Armies of foreign Mercenaries to compleat the works of death, desolation and tyranny, already begun with circumstances of Cruelty & perfidy scarcely paralleled in the most barbarous ages, and totally unworthy the Head of a civilized nation. He has constrained our fellow Citizens taken Captive on the high Seas to bear Arms against their Country, to become the executioners of their friends and Brethren, or to fall themselves by their Hands. He has excited domestic insurrections amongst us, and ")
	msg.channel.send("has endeavoured to bring on the inhabitants of our frontiers, the merciless Indian Savages, whose known rule of warfare, is an undistinguished destruction of all ages, sexes and conditions. In every stage of these Oppressions We have Petitioned for Redress in the most humble terms: Our repeated Petitions have been answered only by repeated injury. A Prince whose character is thus marked by every act which may define a Tyrant, is unfit to be the ruler of a free people. Nor have We been wanting in attentions to our Brittish brethren. We have warned them from time to time of attempts by their legislature to extend an unwarrantable jurisdiction over us. We have reminded them of the circumstances of our emigration and settlement here. We have appealed to their native justice and magnanimity, and we have conjured them by the ties of our common kindred to disavow these usurpations, which, would inevitably interrupt our connections and correspondence. They too have been deaf to the voice of justice and of consanguinity. We must, therefore, acquiesce in the necessity, which denounces our Separation, and hold them, as we hold the rest of mankind, Enemies in War, in Peace Friends. We, therefore, the Representatives of the united States of America, in General Congress, Assembled, appealing to the Supreme Judge of the world for the rectitude of our intentions, do, in the Name, and by Authority of the good People of these Colonies, solemnly publish and declare, That these United Colonies are, and of Right ought to be Free and Independent States; that they are Absolved from all Allegiance to the British Crown, and that all political connection between them and the State of Great Britain, is and ought to be totally dissolved; and that as Free and Independent States, they have full Power to levy War, conclude Peace, contract Alliances, establish Commerce, and to do all other Acts and Things which Independent States may of right do. And for the support ")
	msg.channel.send("of this Declaration, with a firm reliance on the protection of divine Providence, we mutually pledge to each other our Lives, our Fortunes and our sacred Honor.")
	console.log("DOI");
  }

	/*if(msg.content === 'youtube') {
       msg.channel.send("Enter search keywords:");
        let filter = m => m.author.id === msg.author.id;
        let query = await msg.channel.awaitMessages(filter, { max: 1 });
        let results = await search(query.first().content, opts).catch(err => console.log(err));
        if(results) {
            let youtubeResults = results.results;
            let i  =0;
            let titles = youtubeResults.map(result => {
                i++;
                return i + ") " + result.title;
            });
            console.log(titles);
            msg.channel.send({
                embed: {
                    title: 'Select which song you want by typing the number',
                    description: titles.join("\n")
                }
            }).catch(err => console.log(err));
            
            filter = m => (m.author.id === msg.author.id) && m.content >= 1 && m.content <= youtubeResults.length;
            let collected = msg.channel.awaitMessages(filter, { maxMatches: 1 });
            let selected = youtubeResults[collected.first().content - 1];

            embed = new discord.RichEmbed()
                .setTitle(`${selected.title}`)
                .setURL(`${selected.link}`)
                .setDescription(`${selected.description}`)
                .setThumbnail(`${selected.thumbnails.default.url}`);

            msg.channel.send(embed);
        }
    }
*/

  if (msg.content === "miner start") {
	msg.channel.send("m!start")
  }
  
  if (msg.content.startsWith("set timer")) {
	//var parse = msg.content;
	var num = msg.content.match(/\d+/g);
	if(!num){
		msg.channel.send(`You must write a number.`)
	}else{
		var number = parseInt(num[0])
		var sum = 0
		if(number === 69){
			msg.channel.send(`Nice`);
		}
		msg.delete();
		var message = await msg.channel.send("**START**");
		var interval = setInterval(() => {
                message.edit("**" + number + "**");

                // clear timer when it gets to 0
                if (number === 0) {
					message.edit("**END**");
                    clearInterval(interval);
                }
				number--;
            }, 1200);
	
		
		
		//setTimeout(() => {  msg.channel.send("Countdown of " + number + "s ended."); }, number * 1000);
		/*
		while(number > 0){
			number--;
			sleep(1);
		}
		msg.channel.send(`Countdown ended`);
		*/
	}
	
	console.log("set timer");
  }
  
  
  
  
/*
if (msg.content === "add user") {

    msg.channel.send(`We've sent ${msgcount} messages since last restart.`)
	if(msgcount === 69){
		msg.channel.send(`Nice`);
	}
  }
*/

if (msg.content.startsWith("votes ")) {
	//console.log("works");
	var nick = msg.content;
	//console.log(msg.content);
	//console.log(nick);
	var nickname = nick.split(" ");
	//console.log(nickname);
	nick = nickname[1];
	//console.log(nick);
	//msg.channel.send("Which username should I check?");
	//var nick = getNickname();
	
	//var nick = "Lifeofbenn";
	//console.log($nick);
	
	let getVotes = async () => {
		var url = "https://czech-craft.eu/api/server/warfaremc/player/" + nick;
		console.log(url);
		let response = await axios.get(url);
		//let votes = response.data;
		return response.data;
	}
	let voteValue = await getVotes();
	console.log(voteValue);
	var time = voteValue.next_vote.split(" ");
	msg.channel.send(`Your current vote count is **${voteValue.vote_count}**. \n\n You can vote again in **${time[1]}**.`);
	
	console.log("votes");
}

if (msg.content.startsWith("warfarevotes ")) {
	var leaderboardnum = msg.content.split(" ");
	if(isNaN(leaderboardnum[1]) || leaderboardnum[1] < 1 || leaderboardnum[1] > 50){
		msg.channel.send("It must be number between 1 - 50.");
		return;
	}
	var i = 0;
	var modecheck = 0;
	if(leaderboardnum[2] === '-' && !isNaN(leaderboardnum[3])){
		i = leaderboardnum[1] - 1;
		if(leaderboardnum[3] < i || leaderboardnum[3] > 50){
			msg.channel.send("The second number you entered is too big, or smaller than the first number.");
			return;
		}
		leaderboardnum[1] = leaderboardnum[3];
		var pos = i + 1;
		msg.channel.send("**Top " + pos + ". to " + leaderboardnum[1] + ". voting players.**");
		if(leaderboardnum[1] - i <= 20){
			modecheck = 1;
		}
	}else {
		msg.channel.send("**Top " + leaderboardnum[1] + " players with most votes:**");
	}
	//console.log(leaderboardnum[1]);
	let getLeaderboard = async () => {
		var url = "https://api.warfaremc.eu/public/v1/votes/list/" + leaderboardnum[1];
		console.log("Get votes request on: " + url);
		let response = await axios.get(url);
		//let votes = response.data;
		return response.data;
	}
	let voteValue = await getLeaderboard();
	
	//var zkouska = voteValue[1];
	//console.log("zkouska repeat:" + repeat("zkouska", 20));
	//console.log(voteValue[0].nick);
	
	var leaderboardmsg = "\n"; //= "**Top " + leaderboardnum[1] + " players with most votes:** \n";
	
	for (; i < leaderboardnum[1]; i++){
		//console.log(voteValue[i].nick);
		var position = i+1;
		var space = ' ';
		if (position > 9){
			space = '';
		}
		leaderboardmsg = leaderboardmsg + position + ". " + space + voteValue[i].nick + repeat('.', 78 - voteValue[i].nick.length - toString(voteValue[i].voteCount).length) + voteValue[i].voteCount + "\n";
		if(i%20 == 0 && i > 0 && !modecheck){
			msg.channel.send('```' + leaderboardmsg + '```');
			//console.log(leaderboardmsg);
			leaderboardmsg = '';
			continue;
		}
	}
	//msg.channel.send(`Your current vote count is **${voteValue.vote_count}**. \n\n You can vote again in **${time[1]}**.`);
	msg.channel.send('```' + leaderboardmsg + '```');
	console.log("show votes completed");
	//console.log(leaderboardmsg);
}

if (msg.content.startsWith("poll ")) {
		//msg.channel.send("Huh")
		//console.log(huh)
		//msg.react('😄');
		var message = msg.content;
		//console.log(message);
		message = message.replace("poll ", "");
		//console.log(message);
		msg.delete();
		//msg.channel.send(message);
		//msg.channel.react('👍');
		//msg.channel.react('👎');
		msg.channel.send(message).then(sentEmbed => {
			sentEmbed.react("👍");
			setTimeout(() => {
				sentEmbed.react("👎");
			}, 500)
		})
		console.log("poll");
  }

if (msg.content.startsWith("reverse ")) {
	var message = msg.content;
	message = message.replace("reverse ", "");
	var revmessage = message.split("").reverse().join("");
	//msg.delete();
	msg.channel.send(revmessage);
}

if (search69(msg.content)) {
	msg.channel.send("nice");
	console.log("nice");
}
 
  /*
if(msg.content.startsWith("hero "){
	if(msg.content.startsWith("hero start"){
		
	}
}
  */
  /*
  if (msg.content === "dbahoj") {
	let dbcall = new Promise(function(resolve,reject)){
		
	}
  }
  */
  
  
  
  
  
  
})


client.login(config.TOKEN);