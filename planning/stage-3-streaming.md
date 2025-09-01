### Stage 3: Align streaming indicators

Todos:

-  [ ] Review `@ai-sdk/react` `useCompletion` API for a streaming flag or `onResponse` callbacks.
-  [ ] Track streaming state locally: set `isStreaming=true` on request start, `false` on done/error.
-  [ ] Replace `isStreaming={isLoading}` with the dedicated streaming state.
-  [ ] Ensure typing cursor/blink only appears while streaming.


