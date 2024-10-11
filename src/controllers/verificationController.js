exports.verifyWebhook = (req, res) => {
    // Parse os parâmetros da query string
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (token) {
        if (mode === 'subscribe' && token === process.env.GRAPH_API_TOKEN) {
            console.log("WEBHOOK_VERIFIED");
            res.status(200).send(challenge);
        } else {
            res.sendStatus(403);
        }
    } else {
        res.sendStatus(400);
    }
};
