import axios from "axios";
import { useEffect, useState } from "react";

export default function useAxiosPost() {
  const [input, setInput] = useState({
    data: null,
    url: null,
    callback: null,
  });
  useEffect(() => {
    const postData = () => {
      axios
        .post(input.url, input.data)
        .then((res) => input.callback(res))
        .catch((err) => console.error(err));
    };

    if (input.data && input.url && input.callback) {
      postData();
    } else {
      console.log("Invalid arguments provided to post method");
    }
  }, [input]);
  const post = (url, data, callback) => {
    setInput({ url, data, callback });
  };
  return post;
}
