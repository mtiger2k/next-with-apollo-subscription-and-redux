import Layout from '../components/Layout'
import Register from '../components/Register'
import withData from '../lib/withData'

export default withData((props) => (
  <Layout>
    <div className="container">
    <Register />
    </div>
  </Layout>
))
