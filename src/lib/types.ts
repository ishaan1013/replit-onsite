// All the API types

export type SerializedType =
  | "object"
  | "array"
  | "error"
  | "undefined"
  | "null"
  | "string"
  | "number"
  | "boolean";

export interface ObjectSerialized {
  type: "object";
  value: Array<{ key: string; value: string }>;
}

export interface ArraySerialized {
  type: "array";
  value: string[];
}

export interface ErrorSerialized {
  type: "error";
  value: {
    name: string;
    message: string;
    stack: string;
  };
}

export interface UndefinedSerialized {
  type: "undefined";
  value: string;
}

export interface NullSerialized {
  type: "null";
  value: string;
}

export interface StringSerialized {
  type: "string";
  value: string;
}

export interface NumberSerialized {
  type: "number";
  value: number;
}

export interface BooleanSerialized {
  type: "boolean";
  value: boolean;
}

export type Serialized =
  | ObjectSerialized
  | ArraySerialized
  | ErrorSerialized
  | UndefinedSerialized
  | StringSerialized
  | NumberSerialized
  | BooleanSerialized
  | NullSerialized;

export interface EvalRequestBody {
  code: string;
  sessionId: string;
}

export interface EvalResponseBody {
  root: string;
  serialized: Record<string, Serialized>;
}

// ------------------------------------------------------------------

// For errors from the request to Flatval itself
export interface RequestError {
  root: string;
  type: "request-error";
  message: string;
}

// For user messages
export interface UserMessage {
  type: "user-message";
  message: string;
  root: string;
}
