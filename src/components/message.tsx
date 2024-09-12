import {
  RequestError,
  EvalResponseBody,
  SerializedType,
  Serialized,
  UserMessage,
} from "../lib/types";
import React, { useState } from "react";

export default function Message({
  message,
  index,
}: {
  message: EvalResponseBody | RequestError | UserMessage;
  index: number;
}) {
  const baseClassName = `${index > 0 ? "border-b border-neutral-800" : ""} p-3`;

  if ("type" in message) {
    if (message.type === "request-error") {
      return (
        <div
          className={`${baseClassName} border-l-2 border-l-red-500 bg-red-500/10 text-red-500`}
        >
          {message.message}
        </div>
      );
    }

    return (
      <div className={`${baseClassName}`}>
        <span className="mr-2 inline-block select-none text-neutral-500">
          {">"}
        </span>
        {message.message}
      </div>
    );
  }

  const result = message.serialized[message.root];
  const component = outputMap[result.type];

  if (!component) return null;

  return component(message, baseClassName);
}

const outputMap: Record<
  SerializedType,
  ((message: EvalResponseBody, baseClassName: string) => React.ReactNode) | null
> = {
  string: (message, baseClassName) => (
    <PlainOutput message={message} baseClassName={baseClassName} />
  ),
  number: (message, baseClassName) => (
    <PlainOutput message={message} baseClassName={baseClassName} />
  ),
  boolean: (message, baseClassName) => (
    <PlainOutput message={message} baseClassName={baseClassName} />
  ),
  error: (message, baseClassName) => (
    <ErrorOutput message={message} baseClassName={baseClassName} />
  ),
  undefined: (message, baseClassName) => (
    <UndefinedNullOutput message={message} baseClassName={baseClassName} />
  ),
  null: (message, baseClassName) => (
    <UndefinedNullOutput message={message} baseClassName={baseClassName} />
  ),
  object: (message, baseClassName) => (
    <ObjectOutput message={message} baseClassName={baseClassName} />
  ),
  array: (message, baseClassName) => (
    <ArrayOutput message={message} baseClassName={baseClassName} />
  ),
};

function PlainOutput({
  message,
  baseClassName,
}: {
  message: EvalResponseBody;
  baseClassName: string;
}) {
  const result = message.serialized[message.root];

  if (
    result.type !== "string" &&
    result.type !== "number" &&
    result.type !== "boolean"
  )
    return null;

  if (result.type === "string") {
    const value = result.value.toString();
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };
    if (isValidUrl(value)) {
      if (/\.(png|jpe?g)$/i.test(value)) {
        return (
          <div className={baseClassName}>
            <img src={value} alt="Output image" className="h-auto max-w-64" />
          </div>
        );
      } else {
        return (
          <div className={baseClassName}>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              {value}
            </a>
          </div>
        );
      }
    }
  }

  return <div className={baseClassName}>{result.value.toString()}</div>;
}

function ErrorOutput({
  message,
  baseClassName,
}: {
  message: EvalResponseBody;
  baseClassName: string;
}) {
  const result = message.serialized[message.root];
  const [showStack, setShowStack] = useState(false);

  if (result.type !== "error") return null;
  return (
    <div
      className={`border-l-2 border-l-red-500 bg-red-500/10 text-red-500 ${baseClassName} cursor-pointer`}
      onClick={() => setShowStack(!showStack)}
    >
      <div>
        {showStack ? "▼" : "▶"} {result.value.name}: {result.value.message}
      </div>
      {showStack && (
        <pre className="ml-2 mt-2 whitespace-pre-wrap text-xs">
          {result.value.stack}
        </pre>
      )}
    </div>
  );
}

function UndefinedNullOutput({
  message,
  baseClassName,
}: {
  message: EvalResponseBody;
  baseClassName: string;
}) {
  const result = message.serialized[message.root];

  if (result.type !== "undefined" && result.type !== "null") return null;
  return (
    <div className={`${baseClassName} text-neutral-500`}>{result.type}</div>
  );
}

function ObjectOutput({
  message,
  baseClassName,
}: {
  message: EvalResponseBody;
  baseClassName: string;
}) {
  const result = message.serialized[message.root];
  if (result.type !== "object") return null;

  return (
    <div className={baseClassName}>
      <ExpandableValue value={result} serialized={message.serialized} />
    </div>
  );
}

function ArrayOutput({
  message,
  baseClassName,
}: {
  message: EvalResponseBody;
  baseClassName: string;
}) {
  const result = message.serialized[message.root];
  if (result.type !== "array") return null;

  return (
    <div className={baseClassName}>
      <ExpandableValue value={result} serialized={message.serialized} />
    </div>
  );
}

function ExpandableValue({
  value,
  serialized,
  depth = 0,
}: {
  value: Serialized;
  serialized: Record<string, Serialized>;
  depth?: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const indent = "  ".repeat(depth);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  if (value.type === "object") {
    return (
      <div>
        <span onClick={toggleExpand} className="cursor-pointer">
          {isExpanded ? "▼" : "▶"}{" "}
          {isExpanded ? (
            "{"
          ) : (
            <>
              {"{ "}
              <span className="text-neutral-500">...</span>
              {" }"}
            </>
          )}
        </span>
        {isExpanded && (
          <div className="ml-4">
            {value.value.map(({ key, value: valueId }, index) => (
              <div key={index}>
                {indent}
                <ExpandableValue
                  value={serialized[key]}
                  serialized={serialized}
                  depth={depth + 1}
                />
                {": "}
                <ExpandableValue
                  value={serialized[valueId]}
                  serialized={serialized}
                  depth={depth + 1}
                />
                {index < value.value.length - 1 && ","}
              </div>
            ))}
          </div>
        )}
        {isExpanded && (
          <>
            {indent}
            {"}"}
          </>
        )}
      </div>
    );
  }

  if (value.type === "array") {
    return (
      <div>
        <span onClick={toggleExpand} className="cursor-pointer">
          {isExpanded ? "▼" : "▶"}{" "}
          {isExpanded ? (
            "["
          ) : (
            <>
              [{" "}
              <span className="text-neutral-500">
                Array({value.value.length})
              </span>{" "}
              ]
            </>
          )}
        </span>
        {isExpanded && (
          <div className="ml-4">
            {value.value.map((itemId, index) => (
              <div key={index}>
                {indent}
                <ExpandableValue
                  value={serialized[itemId]}
                  serialized={serialized}
                  depth={depth + 1}
                />
                {index < value.value.length - 1 && ","}
              </div>
            ))}
          </div>
        )}
        {isExpanded && (
          <>
            {indent}
            {"]"}
          </>
        )}
      </div>
    );
  }

  // For primitive types
  return <span>{JSON.stringify(value.value)}</span>;
}
