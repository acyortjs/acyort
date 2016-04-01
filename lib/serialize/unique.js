
// array unique

module.exports = function(array) {

    return array.filter(function(item, index, inputArray) {
        return inputArray.indexOf(item) == index
    })

}
