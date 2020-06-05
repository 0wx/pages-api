const nhentai = require('./controller/nhentai');
const express = require('express');
const app = new express();
const banner = 'https://image-mirror.herokuapp.com/https://banner-hentai.glitch.me';


app.set('views', './views');
app.set('view engine', 'pug');
app.use(express.static('public'));
app.listen(process.env.PORT || 3000);



app.get('/' || '/page/:page', (req, res) => {
    let page = req.params.page && req.params.page > 0 ? req.params.page : 1;
    nhentai.getHomepage(page)
    .then(result => {

        let renderData = {
            ...{
                title: "nHentai",
                pageNum: page > 1 ? page : false
            }, ...result
        };

        res.render('index', renderData);
    })
    .catch(res.send);
});


app.get('/g/:id', (req, res) => {
    nhentai.exists(req.params.id)
    .then(status => {
        if(!status) throw new Error(`Cannot Find Doujin with id = ${req.params.id}`)
        nhentai.getDoujin(req.params.id)
        .then(data => {
            let {pages, title} = data;
            let pagesWithBanner = [];
            let insert = true;
            pages.forEach(e => {
                pagesWithBanner.push(e);
                if(insert) pagesWithBanner.push(banner);
                insert = false;
            });
            res.render('page', {pages: pagesWithBanner, title: title, banner: banner});
        })
        .catch(res.send)
    })
    .catch(res.send)
})