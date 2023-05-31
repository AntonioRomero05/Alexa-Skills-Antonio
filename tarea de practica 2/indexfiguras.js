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
            WELCOME_MESSAGE: 'Welcome to the area of shapes. You can say something like: calculate the area of a rectangle with a base of 5 and height of 8. I can calculate the area of triangles, circles, and rectangles.',
            res_tri: 'The area of the triangle is',
            res_cir: 'The area of the circle is',
            res_rec: 'The area of the rectangle is',
            no_figura: 'The provided figure does not exist, please try another one.',
            cancelacion:'ok, see you later',
            no_cir:'The radius must be greater than 0 and a positive number.',
            no_ba: 'The base and height of the figure must be greater than 0 and positive numbers',
            rad_nan:'To calculate the area of a circle, you can say something like calculate the area of a circle with a radius of 5',
            help: 'I can calculate the area of circles, triangles, and rectangles. You can say something like: calculate the area of a triangle with a base of 5 and height of 8',
            res_cua: 'According to the measurements you provided, the figure is a square and it has an area of'
        }
    },
    es:{
        translation: {
            WELCOME_MESSAGE: 'Bienvenido a area de figuras, puedes decir algo como: calcula el area de un rectangulo de base 5 y altura 8, puedo calcular el area de triangulos, circulos y rectangulos',
            res_tri: 'El area del triangulo es de:',
            res_cir: 'El area del circulo es de:',
            res_rec: 'El area del rectangulo es de:',
            no_figura: 'la figura proporcionada no existe, prueba con otra',
            cancelacion:'Hasta luego',
            no_cir:'el radio debe ser mayor a 0 y un numero positivo',
            no_ba: 'la base y la altura de la figura deben ser mayor a 0 y números positivos',
            rad_nan:'para calcular el area de un circulo puedes decir algo como calcula el area de un circulo con radio de 5',
            help: 'Puedo calcular el area de circulos, triangulos y rectangulos, puedes decir algo como: calcula el area de un triangulo de base 5 y altura 8 ',
            res_cua: 'de acuerdo a las medidas que me proporcionaste, la figura es un cuadrado y tiene un area de:'
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

const areadeFigurasHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'calcularAreaIntent';
    },
    handle(handlerInput) {
        
        function calcularAreaRectangulo(base, altura) {
          const area = base * altura;
          return area;
        }
        
        function calcularAreaCirculo(radio) {
          const area = Math.PI * Math.pow(radio, 2);
          return area;
        }
        
        function calcularAreaTriangulo(base, altura) {
          const area = (base * altura) / 2;
          return area;
        }
        
        function calcularAreaCuadrado(lado) {
            return lado * lado;
        }
        
        let res;
        let respuesta ;
        const figura = handlerInput.requestEnvelope.request.intent.slots.figura.value;
        
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        
        if (figura.toLowerCase() === 'circulo' || figura.toLowerCase() === 'circle' || figura.toLowerCase() === 'circles'){
            const radio = handlerInput.requestEnvelope.request.intent.slots.radio.value;
            
            if(radio > 0){
                res = calcularAreaCirculo(radio)
                respuesta = requestAttributes.t('res_cir');
                respuesta =  `${respuesta} ${res}`;
                
            }else{
                if (radio.isNaN){
                    respuesta = requestAttributes.t('rad_nan');
                }else{
                    respuesta = requestAttributes.t('no_cir');
                }
            }
        }else if(figura.toLowerCase() === 'triangulo' || figura.toLowerCase() === 'triangle' || figura.toLowerCase() === 'triangles'){
            const base = parseFloat(handlerInput.requestEnvelope.request.intent.slots.base.value);
            const altura = parseFloat(handlerInput.requestEnvelope.request.intent.slots.altura.value);
            
            if(base > 0 && altura > 0){
                if(base === altura){
                    res = calcularAreaCuadrado(base)
                    respuesta = requestAttributes.t('res_cua')
                    respuesta = `${respuesta} ${res}`;
                    
                }else{
                    res = calcularAreaTriangulo(base,altura)
                    respuesta = requestAttributes.t('res_tri');
                    respuesta =  `${respuesta} ${res}`;
                }

                
            }else{
                respuesta = requestAttributes.t('no_ba');
            }
        }else if(figura.toLowerCase() === 'rectangulo' || figura.toLowerCase() === 'rectangle' || figura.toLowerCase() === 'rectangles'){
            const base = parseFloat(handlerInput.requestEnvelope.request.intent.slots.base.value);
            const altura = parseFloat(handlerInput.requestEnvelope.request.intent.slots.altura.value);
            
            if(base > 0 && altura > 0){
                if(base === altura){
                    res = calcularAreaCuadrado(base)
                    respuesta = requestAttributes.t('res_cua')
                    respuesta = `${respuesta} ${res}`;
                    
                }else{
                    res = calcularAreaRectangulo(base,altura)
                    respuesta = requestAttributes.t('res_rec');
                    respuesta =  `${respuesta} ${res}`;
                }

                
            }else{
                respuesta = requestAttributes.t('no_ba');
            }
        }else{
            respuesta = requestAttributes.t('no_figura');
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
        const speakOutput = requestAttributes.t('help');

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
        const speakOutput = requestAttributes.t('cancelacion');

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
        areadeFigurasHandler,
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