import { createEffect, createSignal, onCleanup } from "solid-js";
import { useUserContext } from "~/routes";

export default function Header() {
    const ctx = useUserContext()!;

    const [activeTab, setActiveTab] = createSignal("focus");
    const tabClasses = {
        active: " text-white bg-blue-600",
        inactive:
            " hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white",
        default: "inline-block px-4 py-3 rounded-lg",
    };

    function handleStageChange(stage: "focus" | "short" | "long") {
        setActiveTab(stage);
        ctx.setTimerState({
            ...ctx.timerState(),
            currentStage: stage,
        });
        ctx.setTimerState({
            ...ctx.timerState(),
            timeRemaining: ctx.timerSettings().stageDurations[stage],
            isRunning:
                ctx.timerSettings().autoStart[
                    ["short", "long"].includes(stage) ? "breaks" : "focus"
                ],
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

    const timer = setInterval(() => {
        if (ctx.timerState().isRunning) {
            ctx.setTimerState({
                ...ctx.timerState(),
                timeRemaining: ctx.timerState().timeRemaining - 10,
            });
        }
        if (ctx.timerState().timeRemaining <= 0) {
            ctx.setTimerState({
                ...ctx.timerState(),
                isRunning: false,
                timeRemaining: 0,
            });
        }
    }, 10);

    onCleanup(() => clearInterval(timer));

    return (
        <div class="flex flex-col max-w-screen-sm w-[-webkit-fill-available] mx-auto my-10 bg-white rounded-lg shadow-lg dark:bg-gray-800 p-6 gap-8 items-center">
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
                            Focus
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
            <div>
                <button
                    class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    onClick={() => {
                        ctx.setTimerState({
                            ...ctx.timerState(),
                            isRunning: !ctx.timerState().isRunning,
                        });
                    }}
                    disabled={ctx.timerState().timeRemaining <= 0}
                >
                    {ctx.timerState().isRunning ? "Pause" : "Start"}
                </button>
            </div>
        </div>
    );
}
