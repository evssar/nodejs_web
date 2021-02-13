const path = require('path')
const fs = require('fs')
const http = require('http');
const querystring = require('querystring');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-type': 'text/html; charset=utf-8',
    })

    if (req.method === 'GET') {
        if (req.url === '/') {
            fs.readFile(
                path.join(__dirname, 'views', 'index.html'),
                'utf-8',
                (err, data) => {
                    if (err) throw err
                    res.end(data)
                }
            )
        } else if (req.url === '/catalog') {
            fs.readFile(
                path.join(__dirname, 'views', 'goodses.html'),
                'utf-8',
                (err, data) => {
                    if (err) throw err
                    res.end(data)
                }
            )
        } else {
            res.writeHead(404, {
                'Content-Type': 'text/plain; charset=utf-8',
            })
            res.end('404 error')
        }
    } else if (req.method === 'POST') {
        const body = []

        console.log('POST');

        req.on('data', (data) => {
            console.log(Buffer);
            body.push(Buffer.from(data));
        }).on('end', () => {
            console.log("End");
            res.writeHead(200, {
                'Content-Type': 'application/json; charset=utf-8',
            })
            const message = JSON.stringify(querystring.parse(body.toString()));
            res.end(message);
        })
    }
});

server.listen(port, hostname, () => {
    console.log(`Server running at ${hostname}:${port}/`)
});