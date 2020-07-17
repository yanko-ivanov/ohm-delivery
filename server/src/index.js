
var express = require('express');
var app = express();
const bodyParser = require('body-parser')
const Utils = require('./utils');
const statuses = require('./options')
const mountReorderRoute = require('./routes/reorder')
app.use(bodyParser.json())

function serve() {

    mountReorderRoute(app);

    /**
     * Handles comment updates
     */
    app.post('/ohms/comment/:id', async (req, res) => {

        if(req.params.id.trim() == '') {
            res.status(400).send("No input specified")
        }

        let ohm = await Utils.getOhmByTrackingId(req.params.id);
        if( ! ohm) {
            res.status(404).send("Sorry can't find that!")
        }

        Utils.updateComment(req.params.id, req.body.comment)

        ohm = await Utils.getOhmByTrackingId(req.params.id);
        return res.json(ohm);
    })

    /**
     * Handles package status updates.
     * Technically this should be a PATCH instead of a GET.
     * @TODO: Update Angular to utilize patch if you've the time.
     */
    app.get('/ohms/forward/:id/:option', async (req, res) => {

        if(req.params.id.trim() == '') {
            res.status(400).send("No input specified")
        }

        let ohm = await Utils.getOhmByTrackingId(req.params.id);
        if( ! ohm) {
            res.status(404).send("Sorry can't find that!")
        }

        // Usually this will point us which is our next available status
        let action = statuses[ohm.status];

        if( ! action) {
            res.status(400).send("You can't do that. Contact our support.")
        }

        // ... Except for in delivery. Which we handle by an additional parameter
        if(Array.isArray(action)) {

            // If the option input is invalid, the status remains 0.
            let userChoice = 0;
            if(parseInt(req.params.option) > 0) {
                userChoice = parseInt(req.params.option)-1
            }

            action = action[userChoice];
        }

        Utils.updateOhmStatus(req.params.id, action);
        // We're emitting a new history state object every time, as the db can't update the object in one go.
        Utils.updateOhmHistory(req.params.id, [...ohm.history, {
            state: action,

            // Using UNIX timestamp
            at: Math.floor(new Date() / 1000)
        }]);

        ohm = await Utils.getOhmByTrackingId(req.params.id);

        return res.json(ohm);
    });

    /**
     * Handles finding  packages by id.
     */
    app.get('/ohms/:id', async (req, res) => {
        const ohm = await Utils.getOhmById(req.params.id);

        return res.json(ohm);
    });

    /**
     * Handles finding packages by tracking id
     */
    app.get('/ohms/tracking/:id', async (req, res) => {

        if( req.params.id.trim() == '') {
            res.status(400).send("What are you looking for again...?")
        }

        const ohm = await Utils.getOhmByTrackingId(req.params.id);
        if( ! ohm) {
            res.status(404).send("Sorry can't find that!")
        }
        return res.json(ohm);
    })



    app.listen(3000, () => console.log('listening on port 3000'));
}

serve();