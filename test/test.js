require('should')

const { convert } = require('../lib/util')

describe('transform text', () => {
    it('should get "zhong_wen"', () => {
        convert('中文').should.be.eql('zhong_wen')
    })
})
