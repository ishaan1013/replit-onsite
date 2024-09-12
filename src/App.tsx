import { useMemo, useState } from "react";
import Message from "./components/message";
import Input from "./components/input";
import { RequestError, EvalResponseBody, UserMessage } from "./lib/types";
import evaluate from "./lib/evaluate";
import { Plus, RotateCw, X } from "lucide-react";

function App() {
  const [tabs, setTabs] = useState<string[]>([crypto.randomUUID()]);
  const [currentTab, setCurrentTab] = useState(0);
  const sessionId = tabs[currentTab];

  const [messages, setMessages] = useState<
    Record<string, (EvalResponseBody | RequestError | UserMessage)[]>
  >({});

  const userMessageHistory = useMemo(() => {
    return (messages[sessionId] || [])
      .filter(
        (message): message is UserMessage =>
          "type" in message && message.type === "user-message",
      )
      .map((message) => message.message);
  }, [messages, sessionId]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center overscroll-none">
      <div className="z-10 flex h-10 w-full max-w-screen-md overflow-x-auto rounded-t-md border border-b-0 border-neutral-800 bg-neutral-900">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={`border-r border-neutral-800 ${
              index === currentTab ? "bg-neutral-800" : ""
            } flex h-full w-32 items-center justify-between px-3 outline-none transition-all hover:bg-neutral-800/50`}
            onClick={() => setCurrentTab(index)}
          >
            <div
              className={`${index === currentTab ? "w-16" : "w-20"} overflow-hidden text-ellipsis whitespace-nowrap font-mono text-sm`}
            >
              {tab}
            </div>
            <div className="flex items-center space-x-1">
              {index === currentTab && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMessages((prevMessages) => {
                      const newMessages = { ...prevMessages };
                      delete newMessages[tabs[index]];
                      return newMessages;
                    });
                    const newSessionId = crypto.randomUUID();
                    setTabs(
                      tabs.map((t, i) => (i === index ? newSessionId : t)),
                    );
                  }}
                  className="mr-1 text-neutral-500 hover:text-white"
                >
                  <RotateCw className="h-3 w-3" />
                </button>
              )}

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (tabs.length === 1) {
                    setCurrentTab(-1);
                  } else if (
                    index === currentTab &&
                    index === tabs.length - 1
                  ) {
                    setCurrentTab(tabs.length - 2);
                  }

                  setTabs(tabs.filter((_, i) => i !== index));
                  setMessages((prevMessages) => {
                    const newMessages = { ...prevMessages };
                    delete newMessages[tabs[index]];
                    return newMessages;
                  });
                }}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          </button>
        ))}
        <button
          onClick={() => {
            const newTabId = crypto.randomUUID();
            setTabs([...tabs, newTabId]);
            setCurrentTab(tabs.length);
          }}
          className="flex h-full w-10 items-center justify-center text-neutral-500 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div className="flex h-2/3 w-full max-w-screen-md flex-col justify-between overflow-hidden rounded-b-md border border-neutral-800 bg-neutral-900 font-mono text-sm shadow-2xl shadow-neutral-800">
        <div className="flex w-full flex-col-reverse overflow-y-auto">
          {currentTab === -1
            ? null
            : messages[sessionId]?.map((message, index) => {
                return (
                  <Message key={message.root} message={message} index={index} />
                );
              })}
        </div>

        {currentTab !== -1 && (
          <Input
            evaluate={(code) => evaluate(sessionId, code, setMessages)}
            userMessageHistory={userMessageHistory}
          />
        )}
      </div>
    </div>
  );
}

export default App;
