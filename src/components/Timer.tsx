import { createSignal, onCleanup } from "solid-js";
import { Title } from "solid-start";
import { useUserContext } from "~/routes";
import { TimerState } from "~/types";
import { autoStartNextTimer, getNextStage } from "~/utils";
import { IconPause, IconPlay, IconRefresh, IconSkipForward } from "./Icons";

export default function Timer() {
    const ctx = useUserContext()!;
    ctx.setTimerState({
        ...ctx.timerState(),
        session: {
            ...ctx.timerState().session,
            count: {
                ...ctx.timerState().session.count,
                [ctx.timerState().currentStage]:
                    ctx.timerState().session.count[
                        ctx.timerState().currentStage
                    ] + 1,
            },
        },
    });

    const [activeTab, setActiveTab] = createSignal(
        ctx.timerState().currentStage
    );

    const tabClasses = {
        active: " text-white bg-blue-600",
        inactive: " hover:text-gray-900 dark:hover:text-white",
        default: "inline-block p-2 rounded-lg",
    };

    function handleStageChange(stage: TimerState["currentStage"]) {
        console.log(ctx.timerState().session.elapsedTimes);
        setActiveTab(stage);
        ctx.setTimerState({
            ...ctx.timerState(),
            timeRemaining: ctx.timerSettings().stageDurations[stage],
            isRunning: autoStartNextTimer(
                ctx.timerState(),
                ctx.timerSettings()
            ),
            currentStage: stage,
            session: {
                ...ctx.timerState().session,
                count: {
                    ...ctx.timerState().session.count,
                    [stage]: ctx.timerState().session.count[stage] + 1,
                },
            },
        });
    }

    function getTime(duration: number) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60);

        minutes = minutes < 10 && minutes > 0 ? 0 + minutes : minutes;
        seconds = seconds < 10 && seconds > 0 ? 0 + seconds : seconds;
        return {
            minutes,
            seconds,
        };
    }

    function getTimeFormatted(duration: number) {
        return (
            getTime(duration).minutes +
            ":" +
            getTime(duration).seconds.toString().padStart(2, "0")
        );
    }

    const TIMER_INTERVAL = 10;
    const timer = setInterval(() => {
        if (ctx.timerState().isRunning) {
            ctx.setTimerState({
                ...ctx.timerState(),
                timeRemaining: ctx.timerState().timeRemaining - TIMER_INTERVAL,
                session: {
                    ...ctx.timerState().session,
                    elapsedTimes: {
                        ...ctx.timerState().session.elapsedTimes,
                        [ctx.timerState().currentStage]:
                            ctx.timerState().session.elapsedTimes[
                                ctx.timerState().currentStage
                            ] + TIMER_INTERVAL,
                    },
                },
            });
        }
        if (ctx.timerState().timeRemaining <= 0) {
            ctx.setTimerState({
                ...ctx.timerState(),
                isRunning: false,
                timeRemaining: 0,
            });
        }
    }, TIMER_INTERVAL);

    onCleanup(() => clearInterval(timer));

    return (
        <>
            <Title>
                {getTimeFormatted(ctx.timerState().timeRemaining) +
                    " - Pomodoro"}
            </Title>
            <div class="flex flex-col w-full sm:w-5/6 mx-auto gap-8 items-center p-5 rounded-lg shadow-[rgba(99,99,99,0.2)_0px_2px_8px_0px]">
                <div class="rounded-md w-fit" role="group">
                    <ul class="flex flex-row text-sm font-medium text-center text-gray-500 dark:text-gray-400 gap-2">
                        <li>
                            <button
                                class={
                                    tabClasses.default +
                                    (activeTab() === "focus"
                                        ? tabClasses.active
                                        : tabClasses.inactive)
                                }
                                onClick={() => handleStageChange("focus")}
                            >
                                Pomodoro
                            </button>
                        </li>
                        <li>
                            <button
                                class={
                                    tabClasses.default +
                                    (activeTab() === "short"
                                        ? tabClasses.active
                                        : tabClasses.inactive)
                                }
                                onClick={() => handleStageChange("short")}
                            >
                                Short Break
                            </button>
                        </li>
                        <li>
                            <button
                                class={
                                    tabClasses.default +
                                    (activeTab() === "long"
                                        ? tabClasses.active
                                        : tabClasses.inactive)
                                }
                                onClick={() => handleStageChange("long")}
                            >
                                Long Break
                            </button>
                        </li>
                    </ul>
                </div>
                <div>
                    <div class="flex flex-row text-6xl font-bold text-center text-gray-900 dark:text-white">
                        <div class="flex flex-col">
                            <span class="countdown">
                                <span
                                    style={{
                                        "--value": getTime(
                                            ctx.timerState().timeRemaining
                                        ).minutes,
                                    }}
                                ></span>
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                {" min"}
                            </span>
                        </div>
                        <span class="mx-2">:</span>
                        <div class="flex flex-col">
                            <span class="countdown">
                                <span
                                    style={{
                                        "--value": getTime(
                                            ctx.timerState().timeRemaining
                                        ).seconds,
                                    }}
                                ></span>
                            </span>
                            <span class="text-sm text-gray-500 dark:text-gray-400">
                                {" sec"}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="flex flex-row gap-1 items-center">
                    <button
                        class="p-3"
                        onClick={() => {
                            ctx.setTimerState({
                                ...ctx.timerState(),
                                timeRemaining:
                                    ctx.timerSettings().stageDurations[
                                        ctx.timerState().currentStage
                                    ],
                                isRunning: false,
                            });
                        }}
                    >
                        <IconRefresh class="h-4 w-4" />
                    </button>
                    <button
                        class="p-3"
                        onClick={() => {
                            ctx.setTimerState({
                                ...ctx.timerState(),
                                isRunning: !ctx.timerState().isRunning,
                            });
                        }}
                        disabled={ctx.timerState().timeRemaining <= 0}
                    >
                        {ctx.timerState().isRunning ? (
                            <IconPause class="h-8 w-8" />
                        ) : (
                            <IconPlay class="h-8 w-8" />
                        )}
                    </button>
                    <button
                        class="p-3"
                        onClick={() => {
                            handleStageChange(
                                getNextStage(
                                    ctx.timerState(),
                                    ctx.timerSettings()
                                )
                            );
                        }}
                    >
                        <IconSkipForward class="h-4 w-4" />
                    </button>
                </div>
            </div>
        </>
    );
}
