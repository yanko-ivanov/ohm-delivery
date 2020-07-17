const Utils = require('../utils');


module.exports = app => {
    app.get('/ohms/reorder/:id', async (req, res) => {
        if (req.params.id.trim() == '') {
            res.status(400).send("No input specified")
        }


        let ohm = await Utils.getOhmByTrackingId(req.params.id);
        if (!ohm) {
            res.status(404).send("Sorry can't find such an OHM!")
        }

        // Clone the object so that the db doesn't modify the actual ohm we pass
        ohm = await Utils.reorder({...ohm});

        return res.json(ohm);
    })
}