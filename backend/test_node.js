const http = require('http');

http.get('http://127.0.0.1:8001/api/auth/login', (res) => {
    console.log('STATUS:', res.statusCode);
}).on('error', (e) => {
    console.error('ERROR:', e.message);
});
