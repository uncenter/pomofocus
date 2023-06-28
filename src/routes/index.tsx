import { createContextProvider } from "@solid-primitives/context";
import { createSignal } from "solid-js";
import { User } from "../types";

import Timer from "~/components/Timer";
import Todo from "~/components/Todo";

export const [UserContextProvider, useUserContext] = createContextProvider(
    (props: { user: User }) => {
        const [timerSettings, setTimerSettings] = createSignal(
            props.user.timerSettings
        );
        const [timerState, setTimerState] = createSignal(props.user.timerState);
        const [data, setData] = createSignal(props.user.data);
        const [theme, setTheme] = createSignal(props.user.theme);
        return {
            timerSettings,
            setTimerSettings,
            timerState,
            setTimerState,
            data,
            setData,
            theme,
            setTheme,
        };
    }
);

export default function App() {
    return (
        <UserContextProvider
            user={
                {
                    timerSettings: {
                        stageDurations: {
                            focus: 1500000,
                            short: 300000,
                            long: 900000,
                        },
                        autoStart: {
                            focus: false,
                            short: false,
                            long: false,
                        },
                        longBreakInterval: 4,
                    },
                    timerState: {
                        currentStage: "focus",
                        currentTask: null,
                        timeRemaining: 1500000,
                        isRunning: false,
                        session: {
                            count: {
                                focus: 0,
                                short: 0,
                                long: 0,
                            },
                            elapsedTimes: {
                                focus: 0,
                                short: 0,
                                long: 0,
                            },
                        },
                    },
                    data: {
                        tasks: [
                            {
                                id: "0",
                                title: "Example Task 2",
                                description: "Veniam eu veniam velit culpa.",
                                project: "Test Project",
                                completed: false,
                                time: {
                                    value: 1,
                                    unit: "hour",
                                },
                            },
                            {
                                id: "1",
                                title: "Example Task",
                                description: "Veniam eu veniam velit culpa.",
                                project: "Test Project",
                                completed: true,
                                time: {
                                    value: 2,
                                    unit: "hour",
                                },
                            },
                        ],
                        projects: {
                            "Test Project": {
                                color: "#000000",
                            },
                        },
                    },
                    theme: "light",
                } as User
            }
        >
            <div class=" bg-white text-black flex flex-col h-screen dark:bg-gray-900 dark:text-white p-5">
                <div class="flex flex-col max-w-screen-md w-[-webkit-fill-available] mx-auto my-10 p-4 gap-12">
                    <Timer />
                    <Todo />
                </div>
            </div>
        </UserContextProvider>
    );
}
