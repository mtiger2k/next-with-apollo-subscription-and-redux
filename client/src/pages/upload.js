import withData from '../lib/withData'
import Upload from '../components/Upload'
import Layout from '../components/Layout'

export default withData(props => (
  <Layout title='Upload demo'>
    <div className="container">
    <h1>Apollo upload examples</h1>
    <p>Select an file to upload and view the response in the console.</p>
    <Upload />
    </div>
  </Layout>
))
