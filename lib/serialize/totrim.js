
// string trim

module.exports = function() {

    // todo
    // chinese to english
    // pingyin

    String.prototype.totrim = function() {
        return this.trim().replace(/\s/g, '_')
    }

}
