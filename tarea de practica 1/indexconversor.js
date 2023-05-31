/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
// i18n dependencies. i18n is the main module, sprintf allows us to include variables with '%s'.
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to the Unit Converter. You can tell me something like: convert twenty centimeters to inches. I can also convert to feet, yards, and miles.',
            respuesta: 'the answer is: ',
            no_existe: 'that unit of measurement does not exist',
            nocm: 'centimeters must be greater than 0',
            hlp: 'I can convert from centimeters to yards, miles, feet, and inches. You can say something like: convert twenty centimeters to inches',
            cance: 'Ok, see you later'
        }
    },
    es:{
        translation: {
            WELCOME_MESSAGE: 'Bienvenido a Conversor de unidades, puedes decirme algo como: convierte veinte centimetros a pulgadas, tambien puedo convertir a pies, yardas y millas',
            respuesta: 'la respuesta es: ',
            no_existe: 'esas unidad de medida no existe',
            nocm: 'los centimetros deben mayores a 0',
            hlp: 'Puedo converti de cm a yardas, millas, pies y pulgadas, puedes decirme algo como: convierte veinte centimetros a pulgadas',
            cance: 'Hasta luego'
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const conversorIntenHandler = {
    canHandle(handlerInput){
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'conversorIntent';
    },
    handle(handlerInput){
        
        function convertirCmAYardas(centimetros) {
            const yardas = centimetros / 91.44;
            return yardas; // Redondea el resultado a 2 decimales
        }

        function convertirCmAPulgadas(centimetros) {
          const pulgadas = centimetros / 2.54;
          return pulgadas; // Redondea el resultado a 2 decimales
        }
        
        function convertirCmAPies(centimetros) {
          const pies = centimetros / 30.48;
          return pies; // Redondea el resultado a 2 decimales
        }
        
        function convertirCmAMillas(centimetros) {
          const millas = centimetros / 160934;
          return millas; // Redondea el resultado a 2 decimales
        }
        
        
        let res;
        let respuesta ;
        const cm = handlerInput.requestEnvelope.request.intent.slots.cm.value;
        const unidad_inglesa = handlerInput.requestEnvelope.request.intent.slots.unidad_inglesa.value;
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        if(cm > 0){
            if (unidad_inglesa === 'yarda' || unidad_inglesa === 'yardas' || unidad_inglesa === 'yard' || unidad_inglesa === 'yards' ){
                res = convertirCmAYardas(cm)
                respuesta = requestAttributes.t('respuesta');
                respuesta =  `${respuesta} ${res}`;
                        
            }else if(unidad_inglesa === 'pie' || unidad_inglesa === 'pies' || unidad_inglesa === 'foot' || unidad_inglesa === 'foots'){
                res = convertirCmAPies(cm)
                respuesta = requestAttributes.t('respuesta');
                respuesta =  `${respuesta} ${res}`;
                
            }else if(unidad_inglesa === 'pulgada' || unidad_inglesa === 'pulgadas' || unidad_inglesa === 'inch' || unidad_inglesa === 'inches'){
                res = convertirCmAPulgadas(cm)
                respuesta = requestAttributes.t('respuesta');
                respuesta =  `${respuesta} ${res}`;
                
            }else if(unidad_inglesa === 'milla' || unidad_inglesa === 'millas' || unidad_inglesa === 'mile' || unidad_inglesa === 'miles'){
                res = convertirCmAMillas(cm)
                respuesta = requestAttributes.t('respuesta');
                respuesta =  `${respuesta} ${res}`;
            }else{
                respuesta = requestAttributes.t('no_existe')
            }
        }else{
            respuesta = requestAttributes.t('nocm')
        }
        
        
        return handlerInput.responseBuilder
            .speak(respuesta)
            .reprompt(respuesta)
            .getResponse();
    }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('hlp');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('cance');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput){
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const LocalizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });
        
        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function(...args){
            return LocalizationClient.t(...args);
        }
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        conversorIntenHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(LoggingRequestInterceptor, LocalizationInterceptor)
    .addResponseInterceptors(LoggingResponseInterceptor)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();