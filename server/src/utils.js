const low = require('lowdb');
const shortid = require('shortid')
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('db.json');
const config = require('../db.config.json');

const db = (async () => {
    const _db = await low(adapter);
    await _db.defaults(config).write();
    return _db;
})()

async function getOhmById(id) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({id})
        .value()

    return ohm;
}

async function getOhmByTrackingId(id) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({trackingId: id})
        .value()

    return ohm;
}

async function updateOhmStatus(id, newStatus) {

    const _db = await db;
    const ohm = _db.get('ohms')
        .find({trackingId: id})
        .assign({status: newStatus})
        .write();

    return ohm;
}

async function updateOhmHistory(id, history) {

    const _db = await db;
    const ohm = _db.get('ohms')
        .find({trackingId: id})
        .assign({history: history})
        .write();

    return ohm;
}

async function updateComment(id, comment) {
    const _db = await db;
    const ohm = _db.get('ohms')
        .find({trackingId: id})
        .assign({comment: comment})
        .write();

    return ohm;
}

/**
 * Handles copying an OHM and its creation as a new order
 * @param ohm
 * @returns {Promise<*>}
 */
async function reorder(ohm) {

    const _db = await db;

    // We have to increment the last id. Lodash methods to the rescue.
    let lastOhms = _db.get('ohms')
        .takeRight(1)
        .value();

    // Clean the entity: New id(probably not ACID though), unique trackingId, clean history and comment.
    ohm.id = parseInt(lastOhms[0].id) + 1;
    ohm.status = 'CREATED';
    ohm.trackingId = shortid.generate();
    ohm.comment = '';
    ohm.history = [
        {
            state: 'CREATED',
            at: Math.floor(new Date() / 1000)
        }
    ];

    _db.get('ohms')
        .push(ohm)
        .write();

    return ohm;
}

module.exports = {getOhmById, getOhmByTrackingId, updateOhmStatus, updateOhmHistory, updateComment, reorder}