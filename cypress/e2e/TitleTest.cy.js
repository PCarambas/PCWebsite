
describe('Title Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify title-positive', () => {
        cy.title().should('eq', 'Student Management Application')
    })

    it('verify title-negative', () => {
        cy.title().should('eq', 'Student Management Application123')
    })
})
        
        

    
