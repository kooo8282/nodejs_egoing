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
    ${body}
    </body>
    </html>
    `;
}

var app = http.createServer(function(request,response){
    var _url = request.url;
    let parsedURL = url.parse(_url, true);
    var queryData = parsedURL.query;    
    // console.log(parsedURL.pathname);
    
    if(parsedURL.pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('data',function(err,filelist){
                let tags = '<ul>';
                for(let i=0; i<filelist.length; i++){
                    tags += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                }
                tags += '</ul>';
                let title = 'Welcome';
                let description = 'Hello, Node.js';
                let body = `<h2>${title}</h2><p>${description}</p>`;
                let template = templateHTML(title, tags, body);
                response.writeHead(200);
                response.end(template);  
            });                      
        } else{
            fs.readdir('data',function(err,filelist){
                let tags = '<ul>';
                for(let i=0; i<filelist.length; i++){
                    tags += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                }
                tags += '</ul>';
                fs.readFile(`data/${queryData.id}`, 'utf8', function(err,description){        
                    let title = queryData.id;
                    let body = `<h2>${title}</h2><p>${description}</p>`;
                    let template = templateHTML(title, tags, body);
                    response.writeHead(200);
                    response.end(template);
                });
            });            
        }        
    } else{
        response.writeHead(404);
        response.end('Not found');
    }  
 
});
app.listen(3000);