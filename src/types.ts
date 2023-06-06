type TimerSettings = {
    timeRemaining: number;
    currentBlock: "focus" | "short" | "long";
    currentTask: string;
};

type TimerState = {
    blockDurations: {
        focus: number;
        short: number;
        long: number;
    };
    autoStart: {
        breaks: boolean;
        focus: boolean;
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
    order: number;
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
    title: string;
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
