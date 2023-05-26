describe('Students View Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify view h3', () => {
        cy.get('.view fieldset h3').should('have.text', 'View All Students')
    })

    it('verify view button', () => {
        cy.get('.view fieldset button').should('have.text', 'View')
    })
})


