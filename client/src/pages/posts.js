import React from 'react'
import Layout from '../components/Layout'
import Submit from '../components/Submit'
import PostList from '../components/PostList'
import withData from '../lib/withData'
import { authenticate } from '../utils/AuthService'

class PostPage extends React.Component {

  static async getInitialProps({ req, res }) {
    const user = await authenticate(req, res);
    return { user };
  }

  render() {
	return (
	  <Layout user={this.props.user} title='Post List'>
	    <div className="container">
	    <Submit />
	    <hr/>
	    <PostList />
	    </div>
	  </Layout>
	)
  }
}

export default withData(PostPage)
