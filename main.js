//modules
var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, tags, body){
    return `
    <!doctype html>
    <html>
    <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
    </head>
    <body>
    <h1><a href="/">WEB2</a></h1>
    ${tags}
    <a href="/create">create</a>
    ${body}
    </body>
    </html>
    `;
}
function makelist(filelist){
    let tags = '<ul>';
    for(let i=0; i<filelist.length; i++){
        tags += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    }
    tags += '</ul>';
    return tags;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    let parsedURL = url.parse(_url, true);
    var queryData = parsedURL.query;
    let pathname = parsedURL.pathname;
    // console.log(parsedURL.pathname);
    
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('data',function(err,filelist){
                let tags = makelist(filelist);
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let body = `<h2>${title}</h2><p>${description}</p>`;
                let template = templateHTML(title, tags, body);
                response.writeHead(200);
                response.end(template);  
            });                      
        } else{
            fs.readdir('data',function(err,filelist){
                let tags = makelist(filelist);
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){        
                    let title = queryData.id;
                    let body = `<h2>${title}</h2><p>${description}</p>`;
                    let template = templateHTML(title, tags, body);
                    response.writeHead(200);
                    response.end(template);
                });
            });            
        }        
    } else if(pathname === '/create'){
        fs.readdir('data',function(err,filelist){
            let title = 'WEB - create';            
            let tags = makelist(filelist);
            let body = `
                <form action="http://localhost:3000/process_create" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description" rows="4" cols="50"></textarea></p>
                <p><input type="submit" value="submit"></p>
                </form>
            `;
            let template = templateHTML(title, tags, body);
            response.writeHead(200);
            response.end(template);  
        });  
    } else{
        response.writeHead(404);
        response.end('Not found');
    } 
});
app.listen(3000);