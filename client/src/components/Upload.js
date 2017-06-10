import {graphql, gql} from 'react-apollo'

const SingleUploader = ({mutate}) => {
  const handleChange = ({target}) => {
    if (target.validity.valid) {
      mutate({
        variables: {
          file: target.files[0]
        }
      })
    }
  }

  return <input type='file' required onChange={handleChange} />
}

export default graphql(gql`
  mutation singleUpload ($file: Upload!) {
    singleUpload (file: $file) {
      name
      type
      size
      path
    }
  }
`)(SingleUploader)
