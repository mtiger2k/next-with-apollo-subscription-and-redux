import Layout from '../components/Layout'
import withData from '../lib/withData'
import Jumbotron from 'react-bootstrap/lib/Jumbotron'
import Button from 'react-bootstrap/lib/Button'
import { authenticate } from '../utils/AuthService'

const Page = (props) => (
  <Layout user={props.user} title='Home'>
    <div className="container">
      <Jumbotron>
	    <h1>Hello, world!</h1>
	    <p>This is a simple demo of using next.js with apollo/subscription and redux.</p>
	    <p><Button bsStyle="primary">Learn more</Button></p>
	  </Jumbotron>
    </div>
  </Layout>
)

Page.getInitialProps = async ({ req, res }) => {
  const user = await authenticate(req, res);
  return { user };
}

export default withData(Page)