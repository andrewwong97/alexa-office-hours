// Author: Andrew Wong wongandrew97@gmail.com
// 
// 
// Schema:
// hours["Monday"][0]["course"], startTime, endTime, CA, location

var APP_ID = "amzn1.ask.skill.a66f6bc0-2f42-4558-8058-eed00857ea41";

var hours = {
    "Monday": [
        {
            "course": "CSF",
            "startTime": "4:30 PM",
            "endTime": "5:30 PM",
            "CA": "Guoye Zhang",
            "location": "u-grad"
        }
    ],
    "Tuesday": [
        {
            "course": "CSF",
            "startTime": "1:00 PM",
            "endTime": "2:30 PM",
            "CA": "Dan Smillie",
            "location": "u-grad"
        },
        {
            "course": "CSF",
            "startTime": "3:00 PM",
            "endTime": "4:30 PM",
            "CA": "Steven Shearing",
            "location": "u-grad"
        },
        {
            "course": "Linear Algebra",
            "startTime": "5:00 PM",
            "endTime": "6:00 PM",
            "CA": "Clingman",
            "location": "Krieger 211"
        },
        {
            "course": "Linear Algebra",
            "startTime": "6:00 PM",
            "endTime": "7:00 PM",
            "CA": "Ethan Lee",
            "location": "Krieger 207"
        }
    ],
    "Wednesday": [
        {
            "course": "CSF",
            "startTime": "10:00 AM",
            "endTime": "11:00 AM",
            "CA": "Christy Lee",
            "location": "u-grad"
        },
        {
            "course": "Linear Algebra",
            "startTime": "11:00 AM",
            "endTime": "12:30 PM",
            "CA": "Harrop",
            "location": "Krieger 207"
        },
        {
            "course": "Linear Algebra",
            "startTime": "12:30 PM",
            "endTime": "2:30 PM",
            "CA": "Bernstein",
            "location": "Krieger 408"
        },
        {
            "course": "Linear Algebra",
            "startTime": "3:00 PM",
            "endTime": "5:00 PM",
            "CA": "Zhang and Koh",
            "location": "Krieger 211"
        },
        {
            "course": "CSF",
            "startTime": "8:00 PM",
            "endTime": "9:00 PM",
            "CA": "Patrick Skeba",
            "location": "u-grad"
        }
    ],
    "Thursday": [
        {
            "course": "CSF",
            "startTime": "1:00 PM",
            "endTime": "2:30 PM",
            "CA": "Dan Smillie",
            "location": "u-grad"
        },
        {
            "course": "Linear Algebra",
            "startTime": "1:30 PM",
            "endTime": "2:30 PM",
            "CA": "Tzolova",
            "location": "Krieger 207"
        },
        {
            "course": "Linear Algebra",
            "startTime": "3:00 PM",
            "endTime": "4:00 PM",
            "CA": "Ren",
            "location": "Krieger 201"
        },
        {
            "course": "CSF",
            "startTime": "4:00 PM",
            "endTime": "5:30 PM",
            "CA": "Steven Shearing",
            "location": "u-grad"
        },
        {
            "course": "CSF",
            "startTime": "6:00 PM",
            "endTime": "7:00 PM",
            "CA": "Christy Lee",
            "location": "u-grad"
        },
        {
            "course": "CSF",
            "startTime": "7:00 PM",
            "endTime": "8:00 PM",
            "CA": "Patrick Skeba",
            "location": "u-grad"
        },
    ],
    "Friday": [
        {
            "course": "CSF",
            "startTime": "5:00 PM",
            "endTime": "6:30 PM",
            "CA": "Guoye Zhang",
            "location": "u-grad"
        }
    ]
}

exports.handler = (event, context, callback) => {
    if (event.session.new) { 
        console.log("New session");
    }
    
    
    switch (event.request.type) {
        case "LaunchRequest":
            console.log("LaunchRequest");
            context.succeed(generateResponse(buildSpeechletResponse("Welcome to my lair.",true), {}));
            break;
        case "IntentRequest":
            switch (event.request.intent.name) {
                case "GetTodayHours":
                    var dow = new Date();
                    var result = getHoursByDay(dow.getDay());
                    context.succeed(generateResponse(buildSpeechletResponse(result,true), {}));
                    break;
                case "GetTmrwHours":
                    var dow = new Date();
                    var result = getHoursByDay((dow.getDay()+1)%6);
                    context.succeed(generateResponse(buildSpeechletResponse(result,true), {}));
                    break;
                case "GetDOWHours":
                    var dow = new Date(event.request.intent.slots["DayOfWeek"]["value"]);
                    var result = getHoursByDay(dow.getDay());
                    context.succeed(generateResponse(buildSpeechletResponse(result,true), {}));
                    break;
                default:
                    throw "Invalid intent";
                    break;
            }
            break;
        case "SessionEndedRequest":
            console.log("SessionEndedRequest");
            context.succeed();
            break;
        default:
            context.fail(`INVALID REQUEST TYPE: ${event.request.type}`)
            break;
    }
};

buildSpeechletResponse = (outputText, shouldEndSession) => {
  return {
    outputSpeech: {
      type: "PlainText",
      text: outputText
    },
    shouldEndSession: shouldEndSession
  }

}

generateResponse = (speechletResponse, sessionAttributes) => {

  return {
    version: "1.0",
    sessionAttributes: sessionAttributes,
    response: speechletResponse
  }

}

getHoursByDay = (day) => {
	var x = hours["Monday"];
    var result = "";
    switch(day) {
        case 0: // Sunday
        case 6: // Saturday
            result = "You fuh-king try-hard no one goes to office hours on \
            the weekends."
            break;
        case 1: // Monday
            x = hours["Monday"];
            break;
        case 2:
            x = hours["Tuesday"];
            break;
        case 3:
            x = hours["Wednesday"];
            break;
        case 4:
            x = hours["Thursday"];
            break;
        case 5:
            x = hours["Friday"];
            break;
        default:
            break;
            
    }
    if (day != 6) {
        result = "There are office hours for ";
        for (var i = 0; i < x.length; i++) {
            result += x[i]["course"];
            result += " with " + x[i]["CA"];
            result += " at " + x[i]["location"];
            result += " from " + x[i]["startTime"] + " to " + x[i]["endTime"] + ", ";
        }
        return result ? result.substring(0, result.length - 2) : "No data found";
    } else {
        return result;
    }
}

