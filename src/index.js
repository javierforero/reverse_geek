
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);


        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.23ed8a00-90ef-4ba5-b418-a1d4d8ec5e32") {
             context.fail("Invalid Application ID");
        }

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

     getWelcomeResponse(callback);
}

function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    if ("ReverseWord" === intentName) {
        setWordInSession(intent, session, callback);
    } else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else if ("AMAZON.StopIntent" === intentName || "AMAZON.CancelIntent" === intentName) {
        handleSessionEndRequest(callback);
    } else {
        throw "Invalid intent";
    }
}

function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);

}

function getWelcomeResponse(callback) {
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Hi there! I'm reverse geek. " +
        "What word do you want me to reverse?";
    var repromptText = "What word do you want to reverse? You can say \"reverse carwheel\".";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function handleSessionEndRequest(callback) {
    var cardTitle = "Session Ended";
    var speechOutput = "Thank you for trying reverse geek. Have a nice day!";
    var shouldEndSession = true;

    callback({}, buildSpeechletResponse(cardTitle, speechOutput, null, shouldEndSession));
}

function setWordInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var wordSlot = intent.slots.Word;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";

    if (wordSlot.value) {
        var word = wordSlot.value;
        speechOutput = "The reverse of " + word + " is: " + reverseWord(word);

    } else {
        speechOutput = "Sorry. I didn't understand your word. Please try again";
        repromptText = "Sorry. I didn't understand your word. You can tell me to reverse a word by saying, reverse cartwheel";
        shouldEndSession = false;
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

var reverseWord = function(string) {
  if(string) {
    var splitString = string.split("");
    var reverseArray = splitString.reverse();
    return reverseArray.join("");
  }
};

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}
