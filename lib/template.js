module.exports = {
    html: function (title, tags, control, body) {
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB2 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB2</a></h1>
        ${tags}
        ${control}
        ${body}
        </body>
        </html>
        `;
    },
    list: function (filelist) {
        let tags = '<ul>';
        for (let i = 0; i < filelist.length; i++) {
            tags += `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        }
        tags += '</ul>';
        return tags;
    }
}