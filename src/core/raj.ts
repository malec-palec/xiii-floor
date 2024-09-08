export namespace raj {
  export type Dispatch<T> = (message: T) => void;

  export type Effect<T> = (dispatch: Dispatch<T>) => void;

  export interface Program<State, Message> {
    init: [State, Effect<Message>?];
    update: (message: Message, state: State) => [State, Effect<Message>?];
    view: (state: State, dispatch: Dispatch<Message>) => void;
    done?: (state: State) => void;
  }
}

export function runtime<State, Message>(program: raj.Program<State, Message>) {
  const { init, update, view, done } = program;
  let state: State;
  let isRunning = true;

  function dispatch(message: Message) {
    if (isRunning) {
      change(update(message, state));
    }
  }

  function change(change: [State, raj.Effect<Message>?]) {
    state = change[0];
    const effect = change[1];
    if (effect) effect(dispatch);
    view(state, dispatch);
  }

  change(init);

  return function end(): void {
    if (isRunning) {
      isRunning = false;
      if (done) done(state);
    }
  };
}
