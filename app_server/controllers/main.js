const index = (req, res) => {
    res.resnder('index', {title: 'Travlr Getaways'});
};

module.exports = {
    index
}