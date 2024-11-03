import React, { useState } from "react";
import Layout from "../../components/Layout/Layout";
import toast from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const navigate = useNavigate();

    const [answer, setAnswer] = useState();

    // Form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, newPassword);

        try {
            const res = await axios.post('/api/v1/auth/forgot-password',
                { email, newPassword, answer }
            );

            if (res && res.data.success) {
                toast.success(res.data.message);

                if (res && res.data.success) {
                    toast.success(res.data.message);

                navigate("/login");
                } else {
                    toast.error(res.data.message);
                }
                navigate('/');
            } else {
                toast.error(res.data.message);
            }
        } catch (error) {
            console.error('Error during reset password:', error);
            toast.error('An error occurred during reset password.');
        }
    }
    return (
        <Layout title="Reset-Password">
             <div className="register">
                <h1>Reset Password</h1>

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control"
                            id="exampleInputEmail1"
                            placeholder="Enter Your email"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="form-control"
                            id="exampleInputPassword1"
                            placeholder="Enter Your Password"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="form-control"
                            id="answer"
                            placeholder="Enter Your Secret Answer"
                            required
                        />
                    </div>

                    <div className="d-grid gap-2">
                        <button className="btn btn-secondary bg-primary" type="submit">Reset</button>
                    </div>
                </form>
            </div> 


        </Layout>
    )
}

export default ForgotPassword;