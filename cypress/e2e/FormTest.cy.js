
describe('Form Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify fieldsets-positive', () => {
        cy.get('.body fieldset').should('have.length', 6)
    })

    it('verify fieldsets-negative', () => {
        cy.get('.body fieldset').should('not.have.length', 600)
    })
})
        
        