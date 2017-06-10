import { gql, graphql } from 'react-apollo'
import FormGroup from 'react-bootstrap/lib/FormGroup';
import FormControl from 'react-bootstrap/lib/FormControl';
import Button from 'react-bootstrap/lib/Button';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { login } from '../utils/AuthService';

const validate = values => {
  const errors = {}
  if (!values.username) {
    errors.username = 'Required'
  }
  if (!values.password) {
    errors.password = 'Required'
  }
  return errors
}

const submit = async (values, dispatch, props) => {
  try {
    const result = await props.login(values.username, values.password)
    login(result.data.login.token, result.data.login.user);
  } catch(e) {
    return Promise.reject(new SubmissionError({_error: e.toString()}));
  }
}

const renderField = ({ input, label, type, placeholder, meta: { touched, error, warning } }) => (
    <FormGroup validationState={(touched && error)?"error" : null}>
        <FormControl placeholder={placeholder} type={type} {...input}/>
        {touched && error && <span className="help-block">{error}</span>}
    </FormGroup>
)

function Submit ({ handleSubmit, resetForm, submitting, error }) {

  return (
    <form onSubmit={handleSubmit(submit)}>
      <h1>Login</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <Field name="username" type="text" component={renderField} placeholder="usernanme"/>
      <Field name="password" type="password" component={renderField} placeholder="password"/>
      <Button type='submit'>Submit</Button>
    </form>
  )
}

const loginGQL = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
        dispName
      }
    }
  }
`

export default graphql(loginGQL, {
  props: ({ mutate }) => ({
    login: (username, password) => mutate({
      variables: { username, password }
    })
  })
})(reduxForm({
    form: 'loginForm',
    validate
})(Submit))
