import { useState, useRef, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import CircularProgress from "@mui/material/CircularProgress";
import Header from "./components/header";
import { getCookie } from "cookies-next";
import { backend_url } from "./api/_healper";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";

export default function Home() {
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const token = getCookie("token");
  const [messages, setMessages] = useState([
    { role: "start", content: "Hi there! How can I help?" },
  ]);

  const messageListRef = useRef(null);
  const textAreaRef = useRef(null);

  // Auto scroll chat to bottom
  useEffect(() => {
    const messageList = messageListRef.current;
    messageList.scrollTop = messageList.scrollHeight;
  }, [messages]);

  // Focus on text field on load
  useEffect(() => {
    textAreaRef.current.focus();
  }, []);

  // Handle errors
  const handleError = () => {
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "error",
        content: "Oops! There seems to be an error. Please try again.",
      },
    ]);
    setLoading(false);
    setUserInput("");
  };

  const handleLike = async (id) => {
    let headersList = {
      Accept: "*/*",
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(`${backend_url}/chat/like/${id}/`, {
      method: "POST",
      headers: headersList,
    });

    const data = await response.json();

    setMessages(
      messages.map((message) => {
        if (message.id === id) {
          message.is_helpful = data.data;
        }
        return message;
      })
    );
  };

  const handleDislike = async (id) => {
    let headersList = {
      Accept: "*/*",
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };
    const response = await fetch(`${backend_url}/chat/dislike/${id}/`, {
      method: "POST",
      headers: headersList,
    });

    const data = await response.json();
    setMessages(
      messages.map((message) => {
        if (message.id === id) {
          message.is_helpful = data.data;
        }
        return message;
      })
    );
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userInput.trim() === "") {
      return;
    }

    setLoading(true);
    const context = [...messages, { role: "user", content: userInput }];
    setMessages(context);
    let headersList = {
      Accept: "*/*",
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    // Send chat history to API
    const response = await fetch(`${backend_url}/chat/`, {
      method: "POST",
      headers: headersList,
      body: JSON.stringify({ question: userInput }),
    });
    // Reset user input
    setUserInput("");

    if (!response.ok) {
      handleError();
      return;
    }

    const data = await response.json();

    if (!data) {
      handleError();
      return;
    }

    setMessages((prevMessages) => [
      ...prevMessages,
      {
        role: "assistant",
        content: data.data,
        id: data.id,
        is_helpful: data.is_helpful,
      },
    ]);
    setLoading(false);
  };

  // Prevent blank submissions and allow for multiline input
  const handleEnter = (e) => {
    if (e.key === "Enter" && userInput) {
      if (!e.shiftKey && userInput) {
        handleSubmit(e);
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
    }
  };

  return (
    <>
      <Head>
        <title>Legal Assistant</title>
        <meta name="description" content="Legal Assistant" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      <main className={styles.main}>
        <div className={styles.cloud}>
          <div ref={messageListRef} className={styles.messagelist}>
            {messages.map((message, index) => {
              return (
                // The latest message sent by the user will be animated while waiting for a response
                <div
                  key={index}
                  className={
                    message.role === "user" &&
                    loading &&
                    index === messages.length - 1
                      ? styles.usermessagewaiting
                      : message.role === "assistant" || message.role === "error"
                      ? styles.apimessage
                      : styles.usermessage
                  }
                >
                  <div className={styles.flex}>
                    {/* Display the correct icon depending on the message type */}
                    {message.role === "assistant" ||
                    message.role === "error" ||
                    message.role === "start" ? (
                      <Image
                        src="/quensulting_symbol.png"
                        alt="AI"
                        width="30"
                        height="30"
                        className={styles.boticon}
                        priority={true}
                      />
                    ) : (
                      <Image
                        src="/usericon.png"
                        alt="Me"
                        width="30"
                        height="30"
                        className={styles.usericon}
                        priority={true}
                      />
                    )}
                    <div className={styles.markdownanswer}>
                      {/* Messages are being rendered in Markdown format */}
                      <ReactMarkdown linkTarget={"_blank"}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  </div>

                  {message.role === "assistant" ? (
                    <div className={styles.rate_message}>
                      Was this Helpful
                      {message.is_helpful === true ? (
                        <AiFillLike
                          className={styles.like_dislike}
                          onClick={() => handleLike(message.id)}
                        />
                      ) : (
                        <AiOutlineLike
                          className={styles.like_dislike}
                          onClick={() => handleLike(message.id)}
                        />
                      )}
                      {message.is_helpful === false ? (
                        <AiFillDislike
                          className={styles.like_dislike}
                          onClick={() => handleDislike(message.id)}
                        />
                      ) : (
                        <AiOutlineDislike
                          className={styles.like_dislike}
                          onClick={() => handleDislike(message.id)}
                        />
                      )}
                    </div>
                  ) : (
                    <></>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className={styles.center}>
          <div className={styles.cloudform}>
            <form onSubmit={handleSubmit}>
              <textarea
                disabled={loading}
                onKeyDown={handleEnter}
                ref={textAreaRef}
                autoFocus={false}
                rows={1}
                maxLength={512}
                type="text"
                id="userInput"
                name="userInput"
                placeholder={
                  loading ? "Waiting for response..." : "Type your question..."
                }
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className={styles.textarea}
              />
              <button
                type="submit"
                disabled={loading}
                className={styles.generatebutton}
              >
                {loading ? (
                  <div className={styles.loadingwheel}>
                    <CircularProgress color="inherit" size={20} />{" "}
                  </div>
                ) : (
                  // Send icon SVG in input field
                  <svg
                    viewBox="0 0 20 20"
                    className={styles.svgicon}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
                  </svg>
                )}
              </button>
            </form>
          </div>
          <div className={styles.footer}>Made with love in India</div>
        </div>
      </main>
    </>
  );
}
