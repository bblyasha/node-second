const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../routes/index')

chai.should()
chai.use(chaiHttp)
describe('Todos API', () => {
    /**
     * Test GET route
     */
    describe("GET /api/todos/", () => {
        it('It should get all the tasks', (done) => {
            chai.request(app)
            .get('/api/todos/')
            .end((err,res) => {
                res.should.have.status(200)
                res.body.should.be.a('array')
            done()
            })
        })
    })
})