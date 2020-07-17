const utils = require('../src/utils');

describe('db return ohm', () => {
    test('returns Ohm object', async () => {
        expect((await utils.getOhmById('1'))).toBeDefined();
    });

    test('has a valid history', async () => {
        const ohm = await utils.getOhmById('0');
        const statuses = [ 'CREATED', 'PREPARING', 'READY', 'IN_DELIVERY','DELIVERED', 'REFUSED']
        const isValidStatus = statuses.some(status => status == ohm.history[0].state)
        expect(isValidStatus).toBe(true);
    });

    test('has an updated status', async () => {
        utils.updateOhmStatus('1e62adfe', 'DELIVERED');
        const ohm = await utils.getOhmByTrackingId('1e62adfe');
        expect(ohm.status).toBe('DELIVERED');
    });
})
