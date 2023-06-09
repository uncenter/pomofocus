import { createContextProvider } from "@solid-primitives/context";
import { createSignal } from "solid-js";
import { User } from "../types";

import Header from "~/components/Header";
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
                                id: 1,
                                title: "Example Task",
                                body: "Veniam eu veniam velit culpa.",
                                priority: 0,
                                project: "Test Project",
                                time: {
                                    value: 1,
                                    unit: "hour",
                                },
                            },
                            {
                                id: 2,
                                title: "Example Task 2",
                                body: "Veniam eu veniam velit culpa.",
                                priority: 0,
                                project: "Test Project",
                                time: {
                                    value: 1,
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
                    name: "Test User",
                    uuid: "test",
                } as User
            }
        >
            <div class=" bg-white text-black flex flex-col h-screen dark:bg-gray-900 dark:text-white p-5">
                <Header />
                <Timer />
                <Todo />
            </div>
        </UserContextProvider>
    );
}
