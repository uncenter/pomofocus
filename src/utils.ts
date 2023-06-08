import { TimerSettings, TimerState } from "./types";

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
            if (timerSettings.longBreakInterval === timerState.session.focus) {
                return "long";
            } else {
                return "short";
            }
        case "short" || "long":
            return "focus";
    }
}
