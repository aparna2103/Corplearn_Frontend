import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { BACKEND_API_URL } from '../constants'
import React, { useState } from 'react';
import { setCookie } from '../utils/utils'
import CorpLearnContainer from '../ui_utils/corplearn_container';
import Alert from 'react-bootstrap/Alert';
import CorpLearnClose from '../ui_utils/closebutton';

function CorpLearnLogin({ login }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationAlert, setValidationAlert] = useState(false);
  console.log(BACKEND_API_URL);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if(email == "" || password == ""){
      setValidationAlert(true);
      return;
    }

    await fetch(BACKEND_API_URL + '/corpLearn/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify({ email, password }),
    }).then(response => response.json())
    .then(data => {
      if(data.access){
        console.log(data)
        const token = data.access;
        setCookie('corplearntoken', token, 10); // set token in cookie
        login(data.user);
      }
    });

    // if (response.ok) {
    //   const { token } = await response.json();
    //   setCookie('token', token, 1); // set token in cookie
    //   onLogin();
    // } else {
    //   // handle error
    // }
    
  };

  // return (
  //   <form onSubmit={handleSubmit}>
  //     <input type="text" value={email} onChange={(e) => setemail(e.target.value)} placeholder="email" />
  //     <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
  //     <button type="submit">Login</button>
  //   </form>
  // );

  return (
    <CorpLearnContainer>
      {validationAlert && 
                <Alert className="validationAlert" key="danger" variant="danger" onClose={() => setValidationAlert(false)}>
                    One or more fields is empty <CorpLearnClose onClick={() => setValidationAlert(false)}/>
                </Alert>
            }
        <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </Form.Group>
        <Button variant="primary" type="submit">
            Submit
        </Button>
        </Form>
    </CorpLearnContainer>
  );
}

export default CorpLearnLogin;
