'use client';
import { createContext, useCallback, useContext, useMemo, useReducer, useRef, type ReactNode } from 'react';
import { tasks } from './data';

export type TaskId = (typeof tasks)[number]['id'];

type State = {
  /** Task id → when it was completed this session. Completed order is newest first. */
  done: Partial<Record<TaskId, number>>;
  /** The card payment has cleared (it shows as processing for a few seconds first). */
  settled: boolean;
  snoozed: TaskId | null;
};

type Action =
  | { type: 'complete'; id: TaskId; at: number }
  | { type: 'undo'; id: TaskId }
  | { type: 'settle' }
  | { type: 'snooze'; id: TaskId | null };

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'complete':
      return { ...s, done: { ...s.done, [a.id]: a.at } };
    case 'undo': {
      const done = { ...s.done };
      delete done[a.id];
      return { ...s, done, settled: a.id === 'pay' ? false : s.settled };
    }
    case 'settle':
      return { ...s, settled: true };
    case 'snooze':
      return { ...s, snoozed: a.id };
  }
}

const SETTLE_MS = 3200;

type Api = State & {
  isDone: (id: TaskId) => boolean;
  completeTask: (id: TaskId) => void;
  undo: (id: TaskId) => void;
  pay: () => void;
  setAutopay: () => void;
  submitDispute: () => void;
  startUpload: () => void;
  snooze: (id: TaskId | null) => void;
  openCount: number;
};

const Ctx = createContext<Api | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [s, dispatch] = useReducer(reducer, { done: {}, settled: false, snoozed: null });
  const settleT = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const completeTask = useCallback((id: TaskId) => {
    dispatch({ type: 'complete', id, at: Date.now() });
    if (id === 'pay') {
      clearTimeout(settleT.current);
      settleT.current = setTimeout(() => dispatch({ type: 'settle' }), SETTLE_MS);
    }
  }, []);
  const undo = useCallback((id: TaskId) => {
    if (id === 'pay') clearTimeout(settleT.current);
    dispatch({ type: 'undo', id });
  }, []);

  const api = useMemo<Api>(() => ({
    ...s,
    isDone: (id) => !!s.done[id],
    completeTask,
    undo,
    pay: () => completeTask('pay'),
    setAutopay: () => completeTask('autopay'),
    submitDispute: () => completeTask('dispute'),
    startUpload: () => completeTask('upload'),
    snooze: (id) => dispatch({ type: 'snooze', id }),
    openCount: tasks.filter((t) => !s.done[t.id]).length,
  }), [s, completeTask, undo]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useApp() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useApp outside AppProvider');
  return c;
}
