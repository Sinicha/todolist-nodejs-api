const express = require('express');

const app = express();
const port = process.env.PORT || exit(1);

app.listen(port, function () {
    console.log(`Listening on ${port}!`);
});
