import Layout from '../components/Layout'
import Login from '../components/Login'
import withData from '../lib/withData'

export default withData((props) => (
  <Layout title='Login'>
    <div className="container">
    <Login />
    </div>
  </Layout>
))
