import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useAuth } from "../../Auth/Auth"
import { Link, useHistory } from "react-router-dom"
export default function UpdatePassword() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const { resetPassword, currentUser } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    async function handleSubmit(e) {
        e.preventDefault()
        try {
            setError("")
            setLoading(true)
            await resetPassword(emailRef.current.value)
            setMessage('Reset Message delivered to Email')
            //history.push("/login")
        } catch {
            setError("Failed to reset password enter valid details!")
        }

        setLoading(false)
    }

    return (
        <body>
        <div className="row">
            <div className="col-md-4 mx-auto p-0">
                <div className="card shadow-lg">
                    <div className="card-header text-center">Reset Password</div>
                    <div className="card-body">
                        {error && <Alert variant="danger">{error}</Alert>}
                        {message && <Alert variant="success">{message}</Alert>}
                        <Form onSubmit={handleSubmit}>
                        
                            <Form.Group id="email">
                                <div style={{width:"70%",margin:"auto"}}>
                                    <Form.Label className="label">Email</Form.Label>
                                </div>
                                <Form.Control type="email" ref={emailRef} style={{width:"70%",margin:"auto"}} required />
                            </Form.Group>
                            
                            <Form.Group className="text-center">
                                <Button disabled={loading} style={{width:"70%",margin:"auto"}} type="submit">
                                Reset Password
                                </Button>
                            </Form.Group>
                            <div className="mt-2 new" style={{width:"70%",margin:"auto"}}>
                            <Link to="/login" className="label">Login!</Link>
                            </div>
                        </Form>
                       
                    </div>
                </div>
                
            </div>
        </div>
        </body>
        
    )
}