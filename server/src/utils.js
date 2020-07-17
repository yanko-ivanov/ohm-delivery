const low = require('lowdb');
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

module.exports = {getOhmById, getOhmByTrackingId, updateOhmStatus, updateOhmHistory, updateComment}