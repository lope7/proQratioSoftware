# Loan

## Methods

<!-- @vuese:Loan:methods:start -->
|Method|Description|Parameters|
|---|---|---|
|pdfCreator|Method that creates a PDF document based on the properties of the Loan object.|-|
|selectBank|Method that selects the bank which the loan is requested from a query to the API from the database and store the categories in an array.|-|
|list|Method that outputs a list of all the loans in the database by means of a request to the API.|-|
|clean|Method that clears all selected fields.|-|
|validator|Method used to validate all the selected fields.|-|
|save|Method that saves loans in the database or edits them through an API request.|-|
|editItem|Method that assigns the properties of the Article object so that they can be edited.|item:Object|
|activateDeactivateShow|Method that displays the modal window when the user clicks on the enable or disable method.|action:Number item: Object|
|activateDeactivateClose|Method that close the modal window when the user clicks on the enable or disable method.|-|
|activate|Method that approbes a Loan through an API query.|-|
|deactivate|Method that cancels a Loan through an API query.|-|
|removeLoans|Method that deletes cancelled loans.|-|
|close|Method to close the modal window.|-|

<!-- @vuese:Loan:methods:end -->


