


describe('Students Insert Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify insert h3', () => {
        cy.get('.insert fieldset h3').should('have.text', 'Insert New Student')
    })

    it('verify insert label tags', () => {
        cy.get('.insert fieldset label').should('have.text', 'First NameLast Name')
    })


    it('verify insert buttons', () => {
        cy.get('.insert fieldset button').should('have.text', 'ResetSubmit')
    })

})