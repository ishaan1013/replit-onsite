import React, { useCallback, useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import { githubDark } from "@uiw/codemirror-theme-github";

interface InputProps {
  evaluate: (code: string) => void;
  userMessageHistory: string[];
}

export default function Input({ evaluate, userMessageHistory }: InputProps) {
  const [inputValue, setInputValue] = useState("");
  // We do indirectly use the value of historyIndex in the setter with (prev => ...), but eslint doesn't recognize
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setHistoryIndex] = useState(-1);
  const [tempInput, setTempInput] = useState("");

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          if (prev === -1) {
            setTempInput(inputValue);
          }
          const newIndex =
            prev < userMessageHistory.length - 1 ? prev + 1 : prev;
          setInputValue(userMessageHistory[newIndex]?.trim() || "");
          return newIndex;
        });
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setHistoryIndex((prev) => {
          const newIndex = prev > -1 ? prev - 1 : -1;
          setInputValue(
            newIndex === -1
              ? tempInput
              : userMessageHistory[newIndex]?.trim() || "",
          );
          return newIndex;
        });
      } else if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (inputValue.trim()) {
          evaluate(inputValue);
          setInputValue("");
          setHistoryIndex(-1);
          setTempInput("");
        }
      }
    },
    [userMessageHistory, inputValue, tempInput, evaluate],
  );

  useEffect(() => {
    setHistoryIndex(-1);
    setTempInput("");
  }, [userMessageHistory]);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="flex h-10 w-full shrink-0 cursor-text items-center space-x-2 border-t border-neutral-600 px-3"
    >
      <div className="select-none text-neutral-500">{">"}</div>
      <div className="w-full">
        <CodeMirror
          value={inputValue}
          theme={githubDark}
          extensions={[
            javascript({ jsx: true }),
            EditorView.theme({
              "&": { backgroundColor: "transparent !important" },
              ".cm-content": { caretColor: "white", whiteSpace: "nowrap" },
              "&.cm-focused .cm-cursor": { borderLeftColor: "white" },
            }),
          ]}
          onChange={(value) => setInputValue(value)}
          onKeyDown={handleKeyDown}
          className="cm-theme-dark"
          basicSetup={{
            lineNumbers: false,
            foldGutter: false,
            dropCursor: false,
            allowMultipleSelections: false,
            indentOnInput: false,
            bracketMatching: false,
            closeBrackets: false,
            autocompletion: false,
            rectangularSelection: false,
            crosshairCursor: false,
            highlightActiveLine: false,
            highlightSelectionMatches: false,
            closeBracketsKeymap: false,
            searchKeymap: false,
            foldKeymap: false,
            completionKeymap: false,
            lintKeymap: false,
          }}
        />
      </div>
    </div>
  );
}
