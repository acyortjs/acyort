
// string format

module.exports = function() {

    // todo
    // chinese to english
    // pingyin

    String.prototype.format = function() {
        return this.trim().toLowerCase().replace(/\s/g, '_')
    }

}
