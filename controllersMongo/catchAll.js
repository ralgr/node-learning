exports.catchAll = (req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

    // For use with templating engines
    res.status(404).render('404', {path: '', docTitle: '404'});
};