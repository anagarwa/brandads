/*
* <license header>
*/

/**
 * This is a sample action showcasing how to access an external API
 *
 * Note:
 * You might want to disable authentication and authorization checks against Adobe Identity Management System for a generic action. In that case:
 *   - Remove the require-adobe-auth annotation for this action in the manifest.yml of your application
 *   - Remove the Authorization header from the array passed in checkMissingRequestInputs
 *   - The two steps above imply that every client knowing the URL to this deployed action will be able to invoke it without any authentication and authorization checks against Adobe Identity Management System
 *   - Make sure to validate these changes against your security requirements before deploying the action
 */


const fetch = require('node-fetch')
const { Core } = require('@adobe/aio-sdk')
const { errorResponse, getBearerToken, stringParameters, checkMissingRequestInputs } = require('../utils')

// main function that will be executed by Adobe I/O Runtime
async function main (params) {
  // create a Logger
  const logger = Core.Logger('main', { level: params.LOG_LEVEL || 'info' })

  try {
    // 'info' is the default level if not set
    logger.info('Calling the main action')

    // log parameters, only if params.LOG_LEVEL === 'debug'
    logger.debug(stringParameters(params))

    // check for missing request input parameters and headers
    const requiredParams = [/* add required params */]
    const requiredHeaders = []
    const errorMessage = checkMissingRequestInputs(params, requiredParams, requiredHeaders)
    if (errorMessage) {
      // return and log client errors
      return errorResponse(400, errorMessage, logger)
    }

    // extract the user Bearer token from the Authorization header
    const token = getBearerToken(params)

    // replace this with the api you want to access
    const apiEndpoint = 'https://adobeioruntime.net/api/v1'

    // fetch content from external api endpoint
    const res = await fetch(apiEndpoint)
    if (!res.ok) {
      throw new Error('request to ' + apiEndpoint + ' failed with status code ' + res.status)
    }

    const football = {
      "ad1": {
        "liveurl": "https://www.adidas.co.in/x-crazyfast.1-fg/HQ4516.html",
        "extractImages":["https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad1/1.png?raw=true",
                        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad1/2.png?raw=true",
                        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad1/3.png?raw=true"],
        "adurl":"https://main--adobe-screens-brandads--anagarwa.hlx.live/content/screens/ads/ad1.html"
      },
      "ad2":{
        "liveurl": "https://www.adidas.co.in/valentines-day-ultraboost-1.0-shoes/HQ3857.html",
        "extractImages":["https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad2/1.png?raw=true",
          "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad2/2.png?raw=true",
          "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad2/3.png?raw=true"],
        "adurl":"https://main--adobe-screens-brandads--anagarwa.hlx.live/content/screens/ads/ad2.html"
      }
    }

    const merchandise  = {
      "ad1": {
        "liveurl":"https://www.adidas.co.in/club-tennis-graphic-polo-shirt/HT7174.html",
        "extractImages":["https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad3/1.png?raw=true",
        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad3/2.png?raw=true",
        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad3/3.png?raw=true"],
        "adurl":"https://main--adobe-screens-brandads--anagarwa.hlx.live/content/screens/ads/ad3.html"
      },
      "ad2": {
        "liveurl":"https://www.adidas.co.in/tennis-freelift-polo-shirt/HB9133.html",
        "extractImages":["https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad4/1.png?raw=true",
        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad4/2.png?raw=true",
        "https://github.com/anagarwa/adobe-screens-brandads/blob/main/content/dam/ads/adidas/ad4/3.png?raw=true"],
        "adurl":"https://main--adobe-screens-brandads--anagarwa.hlx.live/content/screens/ads/ad4.html"}
    }

    let content = {}
    if (params.keyword.includes("football")) {
      content = football;
    } else if (params.keyword.includes("merchandise")) {
      content = merchandise;
    }

    // const content = {
    //   "ad1":"https://example.com",
    //   "ad2":params.url,
    // }//await res.json()

    const response = {
      statusCode: 200,
      body: content
    }

    // log the response status code
    logger.info(`${response.statusCode}: successful request`)
    await sleep(3000);
    return response
  } catch (error) {
    // log any server errors
    logger.error(error)
    // return with 500
    return errorResponse(500, 'server error', logger)
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

exports.main = main
