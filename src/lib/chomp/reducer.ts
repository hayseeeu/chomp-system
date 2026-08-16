import type { TimerAction, TimerState } from "./types";

export const initialState: TimerState = {
  phase: "idle",
  durationSec: 25 * 60,
  remainingSec: 25 * 60,
  isPaused: false,
  endsAt: null,
  activeTaskId: null,
  tasks: [],
  sessionsToday: 0,
  sessionTarget: 4,
  lifetimeSessions: 0,
  streakDays: 0,
  bestStreak: 0,
  lastSessionDate: null,
  today: null,
  preset: { focus: 25, break: 5 },
  sound: { track: "brown", volume: 60, playing: false },
};

export function isoDate(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}

function dayGap(from: string, to: string): number {
  const a = new Date(`${from}T00:00:00`).getTime();
  const b = new Date(`${to}T00:00:00`).getTime();
  return Math.round((b - a) / 86_400_000);
}

/** Seconds left on an absolute deadline, floored at zero. */
export function remainingFrom(endsAt: number | null, now: number): number {
  if (endsAt === null) return 0;
  return Math.max(0, Math.ceil((endsAt - now) / 1000));
}

export function timerReducer(
  state: TimerState,
  action: TimerAction,
): TimerState {
  switch (action.type) {
    case "HYDRATE": {
      const s = action.state;
      // A run that was in flight keeps counting against its original deadline.
      if ((s.phase === "focus" || s.phase === "break") && !s.isPaused) {
        return { ...s, remainingSec: remainingFrom(s.endsAt, action.now) };
      }
      return s;
    }

    case "ROLL_DAY": {
      if (state.today === action.date) return state;
      // A new day zeroes today's count. The streak is only broken by a
      // completed-session gap, which COMPLETE works out for itself.
      return { ...state, today: action.date, sessionsToday: 0 };
    }

    case "SELECT_PRESET": {
      if (state.phase !== "idle") return state;
      return {
        ...state,
        preset: { focus: action.focus, break: action.break },
        durationSec: action.focus * 60,
        remainingSec: action.focus * 60,
      };
    }

    case "SELECT_TASK":
      return { ...state, activeTaskId: action.taskId };

    case "ADD_TASK":
      return {
        ...state,
        tasks: [
          ...state.tasks,
          { id: action.id, title: action.title, done: false, sessions: 0 },
        ],
        activeTaskId: state.activeTaskId ?? action.id,
      };

    case "TOGGLE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.taskId ? { ...t, done: !t.done } : t,
        ),
      };

    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.taskId),
        activeTaskId:
          state.activeTaskId === action.taskId ? null : state.activeTaskId,
      };

    case "START": {
      const durationSec = state.preset.focus * 60;
      return {
        ...state,
        phase: "focus",
        durationSec,
        remainingSec: durationSec,
        isPaused: false,
        endsAt: action.now + durationSec * 1000,
        sound: { ...state.sound, playing: state.sound.track !== "none" },
      };
    }

    case "PAUSE": {
      if (state.phase !== "focus" || state.isPaused) return state;
      return {
        ...state,
        isPaused: true,
        remainingSec: remainingFrom(state.endsAt, action.now),
        endsAt: null,
      };
    }

    case "RESUME": {
      if (state.phase !== "focus" || !state.isPaused) return state;
      return {
        ...state,
        isPaused: false,
        endsAt: action.now + state.remainingSec * 1000,
      };
    }

    case "TICK": {
      if (state.isPaused || state.endsAt === null) return state;
      const remainingSec = remainingFrom(state.endsAt, action.now);
      if (remainingSec === state.remainingSec) return state;
      return { ...state, remainingSec };
    }

    // The no-guilt clause: nothing is logged, nothing is counted, nothing is
    // coloured red. There is no `abandoned` field and there must never be one.
    case "KILL":
      return {
        ...state,
        phase: "idle",
        isPaused: false,
        endsAt: null,
        durationSec: state.preset.focus * 60,
        remainingSec: state.preset.focus * 60,
        sound: { ...state.sound, playing: false },
      };

    case "COMPLETE": {
      if (state.phase !== "focus") return state;
      const rolledOver = state.today !== action.date;
      const sessionsToday = (rolledOver ? 0 : state.sessionsToday) + 1;

      let streakDays: number;
      if (state.lastSessionDate === action.date) {
        streakDays = Math.max(1, state.streakDays);
      } else if (
        state.lastSessionDate &&
        dayGap(state.lastSessionDate, action.date) === 1
      ) {
        streakDays = state.streakDays + 1;
      } else {
        streakDays = 1;
      }

      return {
        ...state,
        phase: "done",
        isPaused: false,
        endsAt: null,
        remainingSec: 0,
        today: action.date,
        sessionsToday,
        lifetimeSessions: state.lifetimeSessions + 1,
        lastSessionDate: action.date,
        streakDays,
        bestStreak: Math.max(state.bestStreak, streakDays),
        tasks: state.tasks.map((t) =>
          t.id === state.activeTaskId ? { ...t, sessions: t.sessions + 1 } : t,
        ),
        sound: { ...state.sound, playing: false },
      };
    }

    case "TAKE_BREAK": {
      if (state.phase !== "done") return state;
      const durationSec = state.preset.break * 60;
      return {
        ...state,
        phase: "break",
        durationSec,
        remainingSec: durationSec,
        isPaused: false,
        endsAt: action.now + durationSec * 1000,
      };
    }

    case "EXTEND_BREAK": {
      if (state.phase !== "break") return state;
      const endsAt = (state.endsAt ?? action.now) + 5 * 60 * 1000;
      return {
        ...state,
        durationSec: state.durationSec + 5 * 60,
        endsAt,
        remainingSec: remainingFrom(endsAt, action.now),
      };
    }

    case "SKIP_BREAK":
    case "BREAK_DONE":
      return {
        ...state,
        phase: "idle",
        endsAt: null,
        isPaused: false,
        durationSec: state.preset.focus * 60,
        remainingSec: state.preset.focus * 60,
      };

    case "SET_TRACK":
      return {
        ...state,
        sound: {
          ...state.sound,
          track: action.track,
          playing: action.track !== "none" && state.phase === "focus",
        },
      };

    case "SET_VOLUME":
      return {
        ...state,
        sound: {
          ...state.sound,
          volume: Math.min(100, Math.max(0, action.volume)),
        },
      };

    case "TOGGLE_SOUND":
      return {
        ...state,
        sound: { ...state.sound, playing: !state.sound.playing },
      };

    default:
      return state;
  }
}
