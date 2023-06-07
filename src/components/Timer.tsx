import { createSignal } from "solid-js";
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

    function handleBlockChange(block: "focus" | "short" | "long") {
        setActiveTab(block);
        ctx.setTimerState({
            ...ctx.timerState(),
            currentBlock: block,
        });
    }

    function msToTime(duration: number) {
        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = hours < 10 && hours > 0 ? 0 + hours : hours;
        minutes = minutes < 10 && minutes > 0 ? 0 + minutes : minutes;
        seconds = seconds < 10 && seconds > 0 ? 0 + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds;
    }

    return (
        <div class="flex flex-col w-1/2 max-w-2xl mx-auto my-10 bg-white rounded-lg shadow-lg dark:bg-gray-800 p-5 gap-5 items-center">
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
                            onClick={() => handleBlockChange("focus")}
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
                            onClick={() => handleBlockChange("short")}
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
                            onClick={() => handleBlockChange("long")}
                        >
                            Long Break
                        </button>
                    </li>
                </ul>
            </div>
            <div>
                <span class="text-6xl font-bold text-center text-gray-900 dark:text-white">
                    {msToTime(ctx.timerState().timeRemaining)}
                </span>
            </div>
            <div>
                <button class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                    Start
                </button>
            </div>
        </div>
    );
}
