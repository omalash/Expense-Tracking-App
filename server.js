const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 9000;

app.get('/', (req, res) => {
    res.send('Hello, World!'); // A simple response to test the server
});
  
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});