
describe('Select Specific Student Test', () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

    it('verify select h3', () => {
        cy.get('.select fieldset h3').should('have.text', 'View A Specific Student')
    })

    it('verify select label tags', () => {
        cy.get('.insert fieldset label').should('have.text', 'First NameLast Name')
    })

    it('verify select buttons', () => {
        cy.get('.select fieldset button').should('have.text', 'ResetSubmit')
    })
})

