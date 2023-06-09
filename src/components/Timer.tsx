import { Show, createSignal, onCleanup } from "solid-js";
import { useUserContext } from "~/routes";
import { TimerState } from "~/types";
import { autoStartNextTimer, getNextStage } from "~/utils";

function IconSkipForward(props: any) {
    return (
        <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style="overflow: visible;"
            {...props}
        >
            <path d="m5 4 10 8-10 8V4zM19 5v14"></path>
        </svg>
    );
}

function IconPause(props: any) {
    return (
        <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style="overflow: visible;"
            {...props}
        >
            <path d="M6 4h4v16H6zM14 4h4v16h-4z"></path>
        </svg>
    );
}

function IconPlay(props: any) {
    return (
        <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style="overflow: visible;"
            {...props}
        >
            <path d="m5 3 14 9-14 9V3z"></path>
        </svg>
    );
}

function IconRefresh(props: any) {
    return (
        <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            style="overflow: visible;"
            {...props}
        >
            <path d="M23 4v6h-6M1 20v-6h6"></path>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
        </svg>
    );
}

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

    const [activeTab, setActiveTab] = createSignal("focus");
    const tabClasses = {
        active: " text-white bg-blue-600",
        inactive:
            " hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white",
        default: "inline-block px-2 py-3 rounded-lg",
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
        <div class="flex flex-col max-w-screen-sm w-[-webkit-fill-available] mx-auto my-10 bg-white rounded-lg shadow-lg dark:bg-gray-800 p-4 gap-8 items-center">
            <div class="rounded-md shadow-sm w-fit" role="group">
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
                    class={
                        "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 transition-opacity" +
                        (!ctx.timerState().isRunning ? " opacity-50" : "")
                    }
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
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() => {
                        ctx.setTimerState({
                            ...ctx.timerState(),
                            isRunning: !ctx.timerState().isRunning,
                        });
                    }}
                    disabled={ctx.timerState().timeRemaining <= 0}
                >
                    {ctx.timerState().isRunning ? (
                        <IconPause class="h-6 w-6" />
                    ) : (
                        <IconPlay class="h-6 w-6" />
                    )}
                </button>
                <button
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-4 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() => {
                        handleStageChange(
                            getNextStage(ctx.timerState(), ctx.timerSettings())
                        );
                    }}
                >
                    <IconSkipForward class="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
