
describe('Delete Student Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify delete h3', () => {
        cy.get('.delete fieldset h3').should('have.text', 'Delete A Student By Their ID')
    })

    it('verify delete label', () => {
        cy.get('.delete fieldset label').should('have.text', 'Student ID')
    })

    it('verify delete buttons', () => {
        cy.get('.delete fieldset button').should('have.text', 'ResetSubmit')
    })
})
