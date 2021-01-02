//modules
var http = require('http');
var fs = require('fs');
var url = require('url');
let qs = require('querystring');
let template =require('./lib/template.js');
let path = require('path');
let senitizehtml = require('sanitize-html');
const sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    let parsedURL = url.parse(_url, true);
    var queryData = parsedURL.query;
    let pathname = parsedURL.pathname;
    // console.log(parsedURL.pathname);

    if (pathname === '/') {
        if (queryData.id === undefined) {
            fs.readdir('data', function (err, filelist) {
                let tags = template.list(filelist);
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let body = `<h2>${title}</h2><p>${description}</p>`;
                let control = `<a href="/create">create</a>`
                let html = template.html(title, tags, control, body);
                response.writeHead(200);
                response.end(html);
            });
        } else {
            fs.readdir('data', function (err, filelist) {
                let filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                    let title = filteredId;
                    let sanitizedTitle = sanitizeHtml(title);
                    let sanitizedDescription = sanitizeHtml(description);
                    let tags = template.list(filelist);
                    let body = `<h2>${sanitizedTitle}</h2><p>${sanitizedDescription}</p>`;
                    let control =
                        `   <a href="/create">create</a> 
                        <a href="/update?id=${sanitizedTitle}">update</a>
                        <form action="/process_delete" method="post" onsubmit="alert('you wanna delete ${title}?');">
                            <input type="hidden" name="id" value="${sanitizedTitle}">
                            <input type="submit" value="delete">
                        </form>
                    `
                    let html = template.html(sanitizedTitle, tags, control, body);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    } else if (pathname === '/create') {
        fs.readdir('data', function (err, filelist) {
            let title = 'WEB - create';
            let tags = template.list(filelist);
            let body = `
                <form action="http://localhost:3000/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description" rows="4" cols="50"></textarea></p>
                <p><input type="submit" value="submit"></p>
                </form>
            `;
            let html = template.html(title, tags, '', body);
            response.writeHead(200);
            response.end(html);
        });
    } else if (pathname === '/process_create') {
        //create file in data directory with a FormData posted from ./create
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let title = post.title;
            let description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                // redirection in Nodejs
                response.writeHead(302, { Location: `/?id=${title}` });
                response.end();
            })
        });
    } else if (pathname === '/update') {
        fs.readdir('data', function (err, filelist) {
            let filteredId = path.parse(queryData.id).base;
            let tags = template.list(filelist);
            fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
                let title = filteredId;
                let body = `
                <form action="/process_update" method="post">
                <input type="hidden" name="id" value="${title}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p><textarea name="description" placeholder="description" rows="4" cols="50">${description}</textarea></p>
                <p><input type="submit" value="submit"></p>
                </form>
                `;
                let control = `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
                let html = template.html(title, tags, control, body);
                response.writeHead(200);
                response.end(html);
            });
        });
    } else if (pathname === '/process_update') {
        //create file in data directory with a FormData posted from ./create
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            let title = post.title;
            let description = post.description;
            // syntax: fs.rename(oldPath, newPath, callback)
            fs.rename(`data/${id}`, `data/${title}`, function (error) {
                fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
                    // redirection in Nodejs
                    response.writeHead(302, { Location: `/?id=${title}` });
                    response.end();
                })
            })
        });
    } else if (pathname === '/process_delete') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });
        request.on('end', function () {
            let post = qs.parse(body);
            let id = post.id;
            console.log(id);
            fs.unlink(`data/${id}`, function (error) {
                response.writeHead(302, { Location: `/` });
                response.end();
            })

        });
    } else {
        response.writeHead(404);
        response.end('Not found');
    }
});
app.listen(3000);