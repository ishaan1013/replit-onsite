# Frontend Implementation Requirements

You have until the demo meeting to build a REPL (Read Eval Print Loop) frontend app.

You're provided a backend implementation that implements what we've just designed. Please fork [the backend](https://replit.com/@replit-interviewing/flatval), run the repl, and read the api docs (`/api-docs`). Let us know if something is broken, or you need something explained.

### Must haves

- The user should be able to write code
- The user should be able to run the code
- The user should be able to see the result in a way that it is readable, it should handle
  - Primitives: numbers, strings, booleans, undefined and null
  - Objects
  - Arrays
  - The recursive (self/circular reference) case for both objects and arrays
- Should maintain state, if `x=1` is defined, later on `x` should be 1
  - The backend endpoint accepts a `sessionId` parameter that you can hardcode for this

If you want a concrete example, it should look and feel something like the browser devtools where you can run code and see the result.

### Bonus

Please prioritize "must haves" and use your time wisely. We mention bonuses to allow you to show off your skills that might not be covered in the "must haves", and stand out.

We are not prescriptive about the specifics of the UI/DX. You can use your time to either show off some of your design & creativity by doing something inventive or polished.

Alternatively, can go off of an existing tool (like Chrome Devtools console) and implement as many features as you can to show off your implementation skills. Some example features you can tackle:

- Input history (i.e. preserving each of the previous statements and being able to toggle between them via the up/down arrows)
- Syntax highlighting in the input field
- The ability to clear a session or switch between sessions
- You can fork the server https://replit.com/@replit-interviewing/flatval and hack on it to provide extra functionality or harden it.
  - Worth noting that the server already supports data structures that are not in must haves, check out the `serialize.js` file in flatval to see some of those.
- Add support for extra visualization (e.g. show an image if you see an external link or a base64 encoded image, or a map if you see and object with `long` and `lat`)

You can also do things like write tests for your code, or write tests for the backend.

If you have design skills, you can design a future UI in Figma (or your favorite design tool) and present it after the demo.

### Tech stack

No requirements on what framework or UI library to use, some of the best implementations used a simple HTML, JavaScript, CSS implementation with, so make sure to use your time wisely. It's your responsibility to manage your time with regards to setting up the environment,

We prefer that you try using Replit, we have ready templates on Replit to for example:

- Basic HTML: https://replit.com/@replit/Vanilla-Vite
- React TypeScript: https://replit.com/@replit/React-TypeScript
- More templates can be found here https://replit.com/templates

If you encounter issues with Replit, or if you feel like it's slowing you down, feel free to use your favorite environment.

External dependencies are fine (e.g. React or axios), but we don’t recommend using an external dependency to solve a core requirement (e.g. displaying the output). When in doubt, ask in slack!

### Quality

We're not expecting production quality (i.e. no need to document everything), but there should be some basic quality:

- It shouldn't crash
- It should be usably fast

We value pragmatism highly, but make sure you're conscious of the corners you cut and decisions to not follow best practices because we will look at the code and expect you to tell us about them, or answer when asked.

## Team

Treat us as your team for the day. We'll be on Slack to answer any questions, so please @ us or start a Slack Huddle. This will give you a feeling for what is like to work with us and vice versa.

Keep us informed about your progress throughout the day. We want to celebrate your wins and help you if you get stuck.
