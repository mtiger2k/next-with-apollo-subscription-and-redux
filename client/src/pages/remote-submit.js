import React from 'react'
import Layout from '../components/Layout'
import RemoteSubmitButton from '../components/RemoteSubmitButton'
import RemoteSubmitForm from '../components/RemoteSubmitForm'
import withData from '../lib/withData'
import { authenticate } from '../utils/AuthService'

class PostPage extends React.Component {

  static async getInitialProps({ req, res }) {
    const user = await authenticate(req, res);
    return { user };
  }

  render() {
	return (
	  <Layout user={this.props.user} title='Remote submit'>
	    <div className="container">
	    <RemoteSubmitForm />
	    <RemoteSubmitButton />
	    </div>
	  </Layout>
	)
  }
}

export default withData(PostPage)
