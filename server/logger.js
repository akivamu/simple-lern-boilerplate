"use strict";

const winston = require('winston');
require('winston-daily-rotate-file');
const moment = require('moment');
const _ = require('lodash');
const config = require('config');
const LABEL_LENGTH = 30;
const LEVEL_LENGTH = 7;

function paddingText(text, length) {
    if (length > text.length) {
        let processedText = text + _.repeat(' ', length);
        return processedText.substring(0, length);
    }
    return text;
}

function processLevel(options) {
    let levelForDisplay = paddingText(options.level.toUpperCase(), LEVEL_LENGTH);
    return options.colorize ? winston.config.colorize(options.level, levelForDisplay) : levelForDisplay;
}

function timestamp() {
    return moment().format('YYYY-MM-DD_HH:mm:ss');
}

function formatter(options) {
    return options.timestamp()
        + ' ' + processLevel(options)
        + ' ' + (options.label ? paddingText(options.label, LABEL_LENGTH) : '')
        + ' ' + (options.message ? options.message : '')
        + (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '' );
}

function getLabel(callingModule) {
    const parts = callingModule.filename.split('/');
    return parts[parts.length - 2] + '/' + parts.pop();
}

module.exports = function (callingModule) {
    return new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                level: config.server.log.level,
                colorize: true,
                timestamp: timestamp,
                formatter: formatter,
                label: getLabel(callingModule)
            }),
            new winston.transports.DailyRotateFile({
                level: config.server.log.level,
                filename: '.log',
                datePattern: 'yyyy-MM-dd',
                json: false,
                prepend: true,
                timestamp: timestamp,
                formatter: formatter,
                label: getLabel(callingModule)
            })
        ]
    });
};