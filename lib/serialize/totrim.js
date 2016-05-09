
// string trim

module.exports = function() {

    // todo
    // chinese to english
    // pingyin

    String.prototype.totrim = function() {
        return this.trim().toLowerCase().replace(/\s/g, '_')
    }

}
