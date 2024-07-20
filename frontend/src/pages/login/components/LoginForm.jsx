import { useState } from "react";
import TextField from "../../../components/TextField";
import useAxiosPost from "../../../hooks/useAxiosPost";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const post = useAxiosPost();
  const url = "http://localhost:3000/login";

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlePostData = () => {
    post(
      url,
      {
        username: username,
        password: password,
      },
      (data) => {
        if (data.status === 200) {
          navigate("/home");
        }
      }
    );
  };
  return (
    <div className="bg-teal-600 w-3/5 h-80 rounded-2xl flex justify-center items-start flex-wrap p-4 content-start pt-12">
      <div className="flex justify-center items-center flex-wrap">
        <TextField
          placeholder="Username"
          value={username}
          setValue={setUsername}
        />
        <TextField
          placeholder="Password"
          value={password}
          setValue={setPassword}
        />

        <button
          className="h-12 w-24 bg-teal-800 rounded-lg text-white font-bold"
          onClick={() => {
            handlePostData();
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
