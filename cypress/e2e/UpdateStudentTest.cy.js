
describe('Update Student Test',  () => {
    beforeEach(() => {
        cy.visit("http://localhost:3000")
    })

   it('verify update h3', () => {
    cy.get('.update fieldset h3').should('have.text', 'Update A Students Record By ID')
   })

   it('verify update label tags', () => {
    cy.get('.update fieldset label').should('have.text', 'Student IDFirst NameLast NameEmailAgeOther Contact Details')
   })

   it('verify update buttons', () => {
    cy.get('.update fieldset button').should('have.text', 'ResetSubmit')
   })
})

