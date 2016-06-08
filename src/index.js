/**
 * App ID for the skill
 */

var APP_ID = "amzn1.echo-sdk-ams.app.23ed8a00-90ef-4ba5-b418-a1d4d8ec5e32";

var AlexaSkill = require('./AlexaSkill');



var ReverseGeek = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
ReverseGeek.prototype = Object.create(AlexaSkill.prototype);
ReverseGeek.prototype.constructor = ReverseGeek;

ReverseGeek.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {

  console.log("ReverseGeek onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
  var speechOutput = "Hi there! I'm reverse geek. What word do you want me to reverse?";
  var repromptSpeech = "What word would you like me to reverse? If you're done here just say \"quit\".";
  response.ask(speechOutput);
};

ReverseGeek.prototype.intentHandlers = {

    "ReverseWord": function(intent, session, response) {
      if(intent.slots.Word.value) {
        var speechOutput = "The reverse of "+ intent.slots.Word.value + " is: "+ reverseMe(intent.slots.Word.value);
      } else {
        var speechOutput = "Sorry. I didn't understand the word you want to reverse. Please try again.";
      }
      response.ask(speechOutput);
    },

    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("You can ask reverse me to give you the reverse of a word.");
    },

    "AMAZON.StopIntent": function (intent, session, response) {
        var speechOutput = "Okay.";
        response.tell(speechOutput);
    },

    "AMAZON.CancelIntent": function (intent, session, response) {
        var speechOutput = "Goodbye";
        response.tell(speechOutput);
    }
};

var reverseMe = function(string) {
  if(string) {
    var splitString = string.split("");
    var reverseArray = splitString.reverse();
    return reverseArray.join("");
  }
};

exports.handler = function (event, context) {

    var reverseGeek = new ReverseGeek();
    reverseGeek.execute(event, context);
};
