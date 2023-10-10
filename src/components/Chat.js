import React, { useRef, useState } from "react";
import styled from "styled-components";

const ChatContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  grid-gap: 1rem;

  padding: 1rem;

  ul {
    list-style: none;
    padding: 0;
  }
`;

const Channels = styled.div``;

const ChatWindow = styled.div`
  input {
    background-color: black;
    color: white;
    padding: 0.25rem;
    font-size: 1rem;
    border: 1px solid white;
    width: 100%;
    font-family: Menlo, Courier, monospace;
  }
`;

const Messages = styled.div``;

const MessageInput = styled.input``;

const Users = styled.div``;

const Chat = () => {
  const [messages, setMessages] = useState([
    "11:41 rick - Hello world!",
    "11:42 dave - What's up?",
    "11:46 rick has quit",
    "12:00 hal - How's it going gamers?",
  ]);
  const [selectedChannel, setSelectedChannel] = useState(0);
  const messageRef = useRef();

  return (
    <div>
      <ChatContainer>
        <Channels>
          <ul>
            <li style={{ fontWeight: "bold" }}>#newbs</li>
            <li>#coffee</li>
            <li>#football</li>
          </ul>
        </Channels>
        <ChatWindow>
          <Messages>
            <ul>
              {messages.map((message) => (
                // TODO: this key will not work in the long run
                <li key={message}>{message}</li>
              ))}
            </ul>
          </Messages>
          <form
            onSubmit={(event) => {
              event.preventDefault();

              const now = new Date();
              setMessages([
                ...messages,
                `${now.getHours()}:${now.getMinutes()} You - ${
                  messageRef.current.value
                }`,
              ]);
              messageRef.current.value = "";
            }}
          >
            <MessageInput ref={messageRef} name="message" type="text" />
          </form>
        </ChatWindow>
        <Users>
          <ul>
            <li>dave</li>
            <li>hal</li>
            <li>You</li>
          </ul>
        </Users>
      </ChatContainer>
    </div>
  );
};

export default Chat;
