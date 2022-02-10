import axios from 'axios'

export const likeAnswer = async (ansId, answeredById) => {
    try {
        const notificationData = {answeredById}

        const answerId = ansId

        await axios.post(`http://localhost:${process.env.REACT_APP_BEPORT}/answer/like/${answerId}`, notificationData)
        .then(res => {
            return getAnswers
        })

    }
    catch (err) {
        return alert("Login or Register first")
        console.error(err);
    }
};

export const getAnswers = async() => {
    try 
    {
        await axios.get(`http://localhost:${process.env.REACT_APP_BEPORT}/answer/getAnswered`)
        .then(response => {
            return response.data;
        })
    }
    catch (err) {
        console.error(err);
    }
}