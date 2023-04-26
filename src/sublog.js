module.exports.server = (message) => {

    var date = new Date()

    // [Date Format] - Format de la date

    var gmonth = date.getMonth()
    var gday = date.getDate()
    var gHour = date.getHours()
    var gMinute = date.getMinutes()
    var gSecondes = date.getSeconds()


    if(date.getMonth() + 1 <= 9) {
        gmonth = "0" + (date.getMonth() + 1)
    }

    if(date.getDate() + 1 <= 9) {
        gday = "0" + date.getDate()
    }

    if(date.getHours() + 1 <= 9) {
        gHour = "0" + date.getHours()
    }

    if(date.getMinutes() + 1 <= 9) {
        gMinute = "0" + date.getMinutes()
    }

    if(date.getSeconds() + 1 <= 9) {
        gSecondes = "0" + date.getSeconds()
    }

    var currentDate = date.getFullYear() + "-" + gmonth + "-" + gday + "-" + gHour + "h"  + "-" + gMinute + "m" + "-" + gSecondes + "s" 

    console.log("[Subsonics-Server] - " + currentDate + " - " + message)
}

module.exports.server.error = (message) => {

    var date = new Date()

    // [Date Format] - Format de la date

    var gmonth = date.getMonth()
    var gday = date.getDate()
    var gHour = date.getHours()
    var gMinute = date.getMinutes()
    var gSecondes = date.getSeconds()


    if(date.getMonth() + 1 <= 9) {
        gmonth = "0" + (date.getMonth() + 1)
    }

    if(date.getDate() + 1 <= 9) {
        gday = "0" + date.getDate()
    }

    if(date.getHours() + 1 <= 9) {
        gHour = "0" + date.getHours()
    }

    if(date.getMinutes() + 1 <= 9) {
        gMinute = "0" + date.getMinutes()
    }

    if(date.getSeconds() + 1 <= 9) {
        gSecondes = "0" + date.getSeconds()
    }

    var currentDate = date.getFullYear() + "-" + gmonth + "-" + gday + "-" + gHour + "h"  + "-" + gMinute + "m" + "-" + gSecondes + "s" 

    console.error("[Subsonics-Server] - [ERROR] - " + currentDate + " - " + message)
}

module.exports.bot = (message) => {

    var date = new Date()

    // [Date Format] - Format de la date

    var gmonth = date.getMonth()
    var gday = date.getDate()
    var gHour = date.getHours()
    var gMinute = date.getMinutes()
    var gSecondes = date.getSeconds()


    if(date.getMonth() + 1 <= 9) {
        gmonth = "0" + (date.getMonth() + 1)
    }

    if(date.getDate() + 1 <= 9) {
        gday = "0" + date.getDate()
    }

    if(date.getHours() + 1 <= 9) {
        gHour = "0" + date.getHours()
    }

    if(date.getMinutes() + 1 <= 9) {
        gMinute = "0" + date.getMinutes()
    }

    if(date.getSeconds() + 1 <= 9) {
        gSecondes = "0" + date.getSeconds()
    }

    var currentDate = date.getFullYear() + "-" + gmonth + "-" + gday + "-" + gHour + "h"  + "-" + gMinute + "m" + "-" + gSecondes + "s" 

    console.log("[Subsonics-Discord] - " + currentDate + " - " + message)
}

module.exports.bot.error = (message) => {

    var date = new Date()

    // [Date Format] - Format de la date

    var gmonth = date.getMonth()
    var gday = date.getDate()
    var gHour = date.getHours()
    var gMinute = date.getMinutes()
    var gSecondes = date.getSeconds()


    if(date.getMonth() + 1 <= 9) {
        gmonth = "0" + (date.getMonth() + 1)
    }

    if(date.getDate() + 1 <= 9) {
        gday = "0" + date.getDate()
    }

    if(date.getHours() + 1 <= 9) {
        gHour = "0" + date.getHours()
    }

    if(date.getMinutes() + 1 <= 9) {
        gMinute = "0" + date.getMinutes()
    }

    if(date.getSeconds() + 1 <= 9) {
        gSecondes = "0" + date.getSeconds()
    }

    var currentDate = date.getFullYear() + "-" + gmonth + "-" + gday + "-" + gHour + "h"  + "-" + gMinute + "m" + "-" + gSecondes + "s" 

    console.error("[Subsonics-Discord] - [ERROR] - " + currentDate + " - ")
    console.error(message)
}