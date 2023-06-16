const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');


const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`,'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`,'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`,'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map(el => slugify(el.productName, { lower: true}));
console.log(slugs);
const server=http.createServer(function(req, res){
    // console.log(req.url);
    const { query, pathname } = url.parse(req.url, true);
    // const pathname= req.url;
    if(pathname === '/' || pathname ==='/overview'){
        res.writeHead(200,{'Content-Type' : 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}',cardsHtml)
        res.end(output);
    }
    else if(pathname==='/product'){
        console.log(query)
        res.writeHead(200,{ 'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);
    }
    else if(pathname==='/api'){
        fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err,data)=>{
        const productData = JSON.parse(data);
        // console.log(productData);
        res.writeHead(200,{'Content-Type' : 'application/json'});
        res.end(data);
    })  
        // res.end('This is API');
    }
    else{
    res.writeHead(404, {
        'Content-Type': 'text/html'
    })
    res.end("<h1>Page Not Found</h1");
    }
});
server.listen(3000,()=>{
    console.log("Listening on port 3000");
});