import React from 'react';
import { handleError } from "../../helpers/api";

/**
 * With this function one can add validation functionality to a form skeleton. 
 * The validation functionality includes the field validation and error handling, the
 * server error handling and the input value changed handling
 * 
 * @see  this function relies on the high order components design pattern
 * @link https://reactjs.org/docs/higher-order-components.html
 * 
 * @param {Object}          initialValues    initial values for form skeleton input fields
 * @param {Object}          rules            validation rules for form skeleton input fields
 * @param {Object}          handlers         onFormSubmit function
 * @param {React Component} FormSkeleton     the rough form component without any validation funcionality
 *
 * @return Returns the form skeleton with validation functionality.
 */
export const withFormValidation = (initialValues, rules, handlers, FormSkeleton) => {

  return class FormComponentWithValidation extends React.Component {

    constructor() {
      super()

      this.state = {
        values: initialValues,
        fieldErrors: {},
        serverError: null,
        isSubmitting: false
      }

      this.onFormValueChange = this.onFormValueChange.bind(this)
      this.onFormSubmit = this.onFormSubmit.bind(this)
      this.validate = this.validate.bind(this)
      this.validations = rules
    }

    async validateAllFields() {
      await Promise.all(Object.keys(this.state.values).map(async (fieldName) => {
        await this.validate(fieldName, this.state.values[fieldName])
      }));
    }

    /**
     * Will be called with key/value pairs from state. The key is the name
     * attribute of the input field (event.target.name) and the value the input value
     * (event.target.value)
     */
    validate(name, newValue) {
      return new Promise((resolve, reject) => {

        // abort if there is no validation rule for this field
        if (!this.validations[name]) {
          reject()
        }

        // validate the field value and update the field error state
        this.setState((currentState, props) => {
          const nextState = {...currentState}
          const fieldErrors = []
          delete nextState.fieldErrors[name]

          this.validations[name].forEach(checkAndMessage => {
            if (!checkAndMessage[0](newValue)) {
              fieldErrors.push(checkAndMessage[1])
            }
          })

          if (fieldErrors.length) {
            nextState.fieldErrors[name] = fieldErrors
          }

          return nextState

        }, resolve());
      });
    }

    onFormValueChange(event) {
      this.setState((currentState, props) => {
        const nextState = {...currentState}
        nextState.values[event.target.name] = event.target.value
        return nextState
      })

      // if there is an error, check if it is fixed
      if (this.state.fieldErrors[event.target.name]) {
        this.validate(event.target.name, event.target.value)
      }
    }

    async onFormSubmit() {
      // reset server error
      this.setState({ serverError: null })
      
      // wait until all fields have been validated
      await this.validateAllFields();

      // if there is no remaining field error call onFormSubmit from the passed handlers object
      let hasFieldErrors = Object.keys(this.state.fieldErrors).length != 0;
      if(!hasFieldErrors) {
        this.setState({ isSubmitting: true })
        let serverError = await handlers.onFormSubmit(this.state.values);
        this.setState({ isSubmitting: false })
        if(serverError) {
          this.setState({ serverError: handleError(serverError) })
        } else {
          this.props.history.push(handlers.routeOnSuccess);
        }
      }
    }

    render() {
      return (
        <FormSkeleton 
          {...this.state} 
          onFormSubmit={this.onFormSubmit} 
          onFormValueChange={this.onFormValueChange} 
        />
      )
    }
  }
}