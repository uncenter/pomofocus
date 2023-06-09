type TimerState = {
    timeRemaining: number;
    isRunning: boolean;
    currentStage: "focus" | "short" | "long";
    currentTask: string | null;
    session: {
        count: {
            focus: number;
            short: number;
            long: number;
        };
        elapsedTimes: {
            focus: number;
            short: number;
            long: number;
        };
    };
};

type TimerSettings = {
    stageDurations: {
        focus: number;
        short: number;
        long: number;
    };
    autoStart: {
        focus: boolean;
        short: boolean;
        long: boolean;
    };
    longBreakInterval: number;
};

type Data = {
    tasks: Task[];
    projects: {
        [key: string]: Project;
    };
};

type Task = {
    id: number;
    title: string;
    body: string;
    priority: number;
    time: {
        value: number;
        unit: "pomodoro" | "hour";
    };
    project: string;
};

type Project = {
    color: string;
};

type User = {
    name: string;
    uuid: string;
    theme: "light" | "dark";
    timerSettings: TimerSettings;
    timerState: TimerState;
    data: Data;
};

export type { TimerSettings, TimerState, Data, Task, Project, User };
