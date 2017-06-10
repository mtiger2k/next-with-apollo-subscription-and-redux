import { gql, graphql } from 'react-apollo'
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import { reduxForm, Field, SubmissionError } from 'redux-form';

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }
  if (!values.dispName) {
    errors.dispName = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

const submit = async (values, dispatch, props) => {
  try {
    props.register(values.username, values.password, values.dispName)
  } catch(e) {
    return Promise.reject(new SubmissionError({_error: e.toString()}));
  }
}

const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
    <FormGroup validationState={(touched && error)?"error" : ""}>
        <FormControl placeholder={placeholder} type={type} {...input}/>
        {touched && error && <span className="help-block">{error}</span>}
    </FormGroup>
)

function Submit ({ handleSubmit, resetForm, submitting, error }) {

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h1>Register</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Field name="username" type="text" component={renderField} placeholder="usernanme"/>
      <Field name="password" type="password" component={renderField} placeholder="password"/>
      <Field name="dispName" type="text" component={renderField} placeholder="display name"/>
      <Button type='submit'>Submit</Button>
    </form>
  )
}

const register = gql`
  mutation register($username: String!, $password: String!, $dispName: String!) {
    register(username: $username, password: $password, dispName: $dispName) {
      id
      username
      dispName
    }
  }
`

export default graphql(register, {
  props: ({ mutate }) => ({
    register: (username, password, dispName) => mutate({
      variables: { username, password, dispName }
    })
  })
})(reduxForm({
    form: 'registerForm',
    validate
})(Submit))
