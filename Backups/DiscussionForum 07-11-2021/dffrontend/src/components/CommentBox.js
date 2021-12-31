import React, {useState, useEffect, useContext} from 'react'
import axios from 'axios'
import Modal from 'react-bootstrap/Modal';

function CommentBox(props) {
    const [show, setShow] = useState(true);
    const [comment, setComment] = useState();

    useEffect(() => {
      getComments()
      
    }, []);
    
    async function getComments() {
      try 
      {
          
          await axios.get(`http://localhost:3001/comment/get/${props.answerId}`)
          .then(response => {
              setComment(response.data);
              console.log(response.data);
          })
      } 
      catch (err) {
          console.error(err);
      }
  }

    return (
        <Modal
          show={show}
          size="lg"
          onHide={() => setShow(false)}
          dialogClassName="modal-90w"
          centered
          aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Answers over here
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Hi
            </p>
          </Modal.Body>
        </Modal>
    )
}

export default CommentBox
