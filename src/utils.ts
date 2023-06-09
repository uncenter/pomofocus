import { Task, TimerSettings, TimerState } from "./types";

export function autoStartNextTimer(
    timerState: TimerState,
    timerSettings: TimerSettings
) {
    return timerSettings.autoStart[timerState.currentStage];
}

export function getNextStage(
    timerState: TimerState,
    timerSettings: TimerSettings
): TimerState["currentStage"] {
    switch (timerState.currentStage) {
        case "focus":
            if (
                timerState.session.count.focus %
                    timerSettings.longBreakInterval ===
                    0 &&
                timerState.session.count.focus !== 0
            ) {
                return "long";
            } else {
                return "short";
            }
        case "short":
            return "focus";
        case "long":
            return "focus";
    }
}

export function getTaskTime(task: Task, timerSettings: TimerSettings) {
    switch (task.time.unit) {
        case "pomodoro":
            return task.time.value * timerSettings.stageDurations.focus;
        case "minute":
            return task.time.value * 60;
        case "hour":
            return task.time.value * 60 * 60;
    }
}
