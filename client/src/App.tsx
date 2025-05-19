import { useState } from "react";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Send } from "lucide-react";
import clsx from "clsx";
import { useAsk } from "./hooks/use-ask";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

interface Chat {
  role: "user" | "assistant";
  content: string;
}

function App() {
  const { ask, loading, error } = useAsk();

  const [question, setQuestion] = useState("");
  const [chat, setChat] = useState<Chat[]>([]);

  const disabled = loading || !question.trim();

  const handleSend = async () => {
    setQuestion("");

    setChat((prev) => [...prev, { role: "user", content: question }]);

    const answer = await ask(question);

    if (error) {
      toast.error(error);
    }

    setChat((prev) => [
      ...prev,
      {
        role: "assistant",
        content: answer || "Sorry, no response received.",
      },
    ]);
  };
  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-10 border-b bg-white p-4">
        <img src="/timedoor-logo-10-years.svg" alt="" className="w-80" />
      </header>
      <main className="mx-auto mt-24 w-full max-w-3xl px-4 pb-42 lg:px-0">
        <div className="chat flex w-full flex-col gap-4">
          {chat.map((c, i) => (
            <div
              key={i}
              className={clsx(
                "chat-bubble min-w-0 rounded-xl border p-4",
                c.role === "user" && "self-end rounded-br-none",
                c.role === "assistant" && "self-start rounded-bl-none",
              )}
            >
              <div className="prose">
                <ReactMarkdown
                  rehypePlugins={[rehypeSanitize]}
                  remarkPlugins={[remarkGfm]}
                >
                  {c.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
        </div>
        <div className="prompt fixed right-0 bottom-0 left-0 z-10 px-4 lg:px-0">
          <div className="bg-base-10 border-base-300 mx-auto mb-4 flex w-full max-w-3xl justify-between gap-4 rounded-xl border bg-white p-4">
            <Input
              placeholder="Ask a question here ..."
              className="border-none pl-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />
            <Button size="icon" onClick={handleSend} disabled={disabled}>
              <Send />
            </Button>
          </div>
        </div>
      </main>
      <footer className="fixed right-0 bottom-0 left-0 bg-white p-4"></footer>
      <Toaster position="top-right" toastOptions={{ className: "mt-20" }} />
    </>
  );
}

export default App;
