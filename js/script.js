/* start the external action and say hello */
console.log("App is alive");


/** #7 #whereami #var create global variable */
var currentChannel;

/** #7 #star #fix: We simply initialize it with the channel selected by default - sevencontinents */
currentChannel = sevencontinents;

/** #whereami #loc: Store my current (sender) location
 */
var currentLocation = {
    latitude: 48.249586,
    longitude: 11.634431,
    what3words: "shelf.jetted.purple"
};

var channels =[yummy,sevencontinents,killerapp,firstpersononmars,octoberfest];
/**
 * Switch channels name in the right app bar
 * @param channelObject
 */
function switchChannel(channelObject) {
    //Log the channel switch
    console.log("Tuning in to channel", channelObject);

    // #7 #clob #dgst Write the new channel to the right app bar using object property
    document.getElementById('channel-name').innerHTML = channelObject.name;

    //#7 #clob #dgst change the channel location using object property
    document.getElementById('channel-location').innerHTML = 'by <a href="http://w3w.co/'
        + channelObject.createdBy
        + '" target="_blank"><strong>'
        + channelObject.createdBy
        + '</strong></a>';

    /* #7 #clob #trn remove either class */
    $('#chat h1 i').removeClass('fa-star fa-star-o');

    /* #7 #clob #trn set class according to object property */
    $('#chat h1 i').addClass(channelObject.starred ? 'fa-star' : 'fa-star-o');


    /* highlight the selected #channel.
       This is inefficient (jQuery has to search all channel list items), but we'll change it later on */
    $('#channels li').removeClass('selected');
    $('#channels li:contains(' + channelObject.name + ')').addClass('selected');

    /* #7 #whereami #var store selected channel in global variable */
    currentChannel = channelObject;
}

/* liking a channel on #click */
function star() {
    // Toggling star
    // #7 #icns #str: replace image with icon
    $('#chat h1 i').toggleClass('fa-star');
    $('#chat h1 i').toggleClass('fa-star-o');

    // #7 #star #tgl: toggle star also in data model
    currentChannel.starred = !currentChannel.starred;

    // #7 #star #lst: toggle star also in list
    $('#channels li:contains(' + currentChannel.name + ') .fa').removeClass('fa-star fa-star-o');
    $('#channels li:contains(' + currentChannel.name + ') .fa').addClass(currentChannel.starred ? 'fa-star' : 'fa-star-o');
}

/**
 * Function to select the given tab
 * @param tabId #id of the tab
 */
function selectTab(tabId) {
    $('#tab-bar button').removeClass('selected');
    console.log('Changing to tab', tabId);
    $(tabId).addClass('selected');
}

/**
 * toggle (show/hide) the emojis menu
 */
function toggleEmojis() {
    $('#emojis').toggle(); // #toggle
}

/**
 * #8 This #constructor function creates a new chat #message.
 * @param text `String` a message text
 * @constructor
 */
function Message(text) {
    // copy my location
    this.createdBy = currentLocation.what3words;
    this.latitude = currentLocation.latitude;
    this.longitude = currentLocation.longitude;
    // set dates
    this.createdOn = new Date() //now
    this.expiresOn = new Date(Date.now() + 15 * 60 * 1000); // mins * secs * msecs
    // set text
    this.text = text;
    // own message
    this.own = true;
}
function Channel(name){
  this.name=name;
  this.createdOn = new Date();
  this.createdBy = currentLocation.what3words;
  this.starred = false;
  this.messages = [];
  this.messageCount = 0;
  this.expiresIn = 60;
}

function sendMessage() {
    // #8 Create a new #message to #send and log it.
    //var message = new Message("Hello chatter");
    var info = $('#message').val();
    if (info.length==0){
        alert("No text input,please input some text!");
        return;
    }

    // #8 let's now use the #real message #input
    var message = new Message(info);

    
    console.log("New message:", message);

    
    currentChannel.messages.push(message);
    currentChannel.messageCount+=1;
    // #8 nicer #message #append with jQuery:
    $('#messages').append(createMessageElement(message));
    // #8 #messages will #scroll to a certain point if we apply a certain height, in this case the overall scrollHeight of the messages-div that increases with every message;
    // it would also #scroll to the bottom when using a very high number (e.g. 1000000000);
    $('#messages').scrollTop($('#messages').prop('scrollHeight'));

    // #8 #clear the #message input
    $('#message').val('');
}

/**
 * #8 This function makes an html #element out of message objects' #properties.
 * @param messageObject a chat message object
 * @returns html element
 */
function createMessageElement(messageObject) {
    // #8 #message #properties
    var expiresIn = Math.round((messageObject.expiresOn - Date.now()) / 1000 / 60);

    // #8 #message #element
    return '<div class="message'+
        //this dynamically adds the class 'own' (#own) to the #message, based on the
        //ternary operator. We need () in order to not disrupt the return.
        (messageObject.own ? ' own' : '') +
        '">' +
        '<h3><a href="http://w3w.co/' + messageObject.createdBy + '" target="_blank">'+
        '<strong>' + messageObject.createdBy + '</strong></a>' +
        messageObject.createdOn.toLocaleString() +
        '<em>' + expiresIn+ ' min. left</em></h3>' +
        '<p>' + messageObject.text + '</p>' +
        '<button class="accent">+5 min.</button>' +
        '</div>';
}
function compare_new(channel1, channel2){
  return channel2.createdOn-channel1.createdOn;
}
function compare_trending(channel1,channel2){
    return channel2.messageCount-channel1.messageCount;
}
function compare_favortites(channel){
    return channel.starred? -1:1;
}

function listChannels(criteria) {
    // #8 #channel #onload
    //$('#channels ul').append("<li>New Channel</li>")


     channels.sort(criteria);
     $('#channels ul').empty();

    // #8 #channels make five #new channels
    for(i=0;i<channels.length;i++) {
        $('#channels ul').append(createChannelElement(channels[i]));
    }
    // $('#channels ul').append(createChannelElement(yummy));
    // $('#channels ul').append(createChannelElement(sevencontinents));
    // $('#channels ul').append(createChannelElement(killerapp));
    // $('#channels ul').append(createChannelElement(firstpersononmars));
    // $('#channels ul').append(createChannelElement(octoberfest));
}

function loademojibox(){
    var emojis = require('emojis-list');
    $('#emojis').empty();
    for (emoji in emojis) {
        $('#emojis').append(emojis[emoji] + " ");
    }
}
/**
 * #8 This function makes a #new jQuery #channel <li> element out of a given object
 * @param channelObject a channel object
 * @returns {HTMLElement}
 */
function swap_appbar(){
    $('#messages').empty();
    $('#app_bar_static').hide();
    $('#app_bar_swap').addClass('show');
    $('#button_send_message').hide();
    $('#button_create').show();
}
function abortion(){
     $('#app_bar_static').show();
     $('#app_bar_swap').removeClass('show');
     $('#button_send_message').show();
     $('#button_create').hide();
}
function createNewChannel()
{     
var name = $('#newchannel').val();

var text = $('#message').val();

if (name.length==0|| name.search(" ")> -1||name.search("#")== -1){

    alert('Please give a valid channel name!"#" at the beginning with no space inbetween!');
    return;
} else if(!text){
    alert('Please input some message!');
    return;
} else {
    var channel = new Channel(name);
    currentChannel = channel;
    channels.push(channel);
    $('#channels ul').append(createChannelElement(channel));

    sendMessage();
    $('#newchannel').val('');
    abortion();
    $('#channel-name').html(channel.name);
    $('#channel-location').html('by <a href="http://w3w.co/'
    + channel.createdBy
    + '" target="_blank"><strong>'
    + channel.createdBy
    + '</strong></a>');
}

}
function createChannelElement(channelObject) {
    /* this HTML is build in jQuery below:
     <li>
     {{ name }}
        <span class="channel-meta">
            <i class="fa fa-star-o"></i>
            <i class="fa fa-chevron-right"></i>
        </span>
     </li>
     */

    // create a channel
    var channel = $('<li>').text(channelObject.name);

    // create and append channel meta
    var meta = $('<span>').addClass('channel-meta').appendTo(channel);

    // The star including #star functionality.
    // Since we don't want to append child elements to this element, we don't need to 'wrap' it into a variable as the elements above.
    $('<i>').addClass('fa').addClass(channelObject.starred ? 'fa-star' : 'fa-star-o').appendTo(meta);

    // #8 #channel #boxes for some additional meta data
    $('<span>').text(channelObject.expiresIn + ' min').appendTo(meta);
    $('<span>').text(channelObject.messageCount + ' new').appendTo(meta);

    // The chevron
    $('<i>').addClass('fa').addClass('fa-chevron-right').appendTo(meta);

    // return the complete channel
    return channel;
}