import { createContextProvider } from "@solid-primitives/context";
import { createSignal } from "solid-js";
import { User } from "../types";

import Header from "~/components/Header";
import Timer from "~/components/Timer";

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
                        blockDurations: {
                            focus: 1500000,
                            short: 300000,
                            long: 900000,
                        },
                        autoStart: {
                            breaks: false,
                            focus: false,
                        },
                        longBreakInterval: 4,
                    },
                    timerState: {
                        currentBlock: "focus",
                        currentTask: null,
                        timeRemaining: 10000,
                        isRunning: false,
                    },
                    data: {
                        tasks: [],
                        projects: {},
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
            </div>
        </UserContextProvider>
    );
}
