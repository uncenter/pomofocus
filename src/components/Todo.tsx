import { For, Show, createSignal } from "solid-js";
import { useUserContext } from "~/routes";
import {
    dndzone,
    overrideItemIdKeyNameBeforeInitialisingDndZones,
} from "solid-dnd-directive";
overrideItemIdKeyNameBeforeInitialisingDndZones("order");
import type { Task } from "~/types";
import { getTaskTime } from "~/utils";
import { button } from "~/styles";
import { twMerge } from "tailwind-merge";

/**
 * Typescript removes dndzone because it thinks that it is not being used.
 * This trick prevents that from happening.
 * https://github.com/solidjs/solid/issues/1005#issuecomment-1134778606
 */
0 && dndzone;

function IconPlus(props: any) {
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
            <path d="M12 5v14M5 12h14"></path>
        </svg>
    );
}

function IconTrash(props: any) {
    return (
        <svg
            fill="none"
            stroke-width="2"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            style="overflow: visible;"
            {...props}
        >
            <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M10 11v6M14 11v6"></path>
        </svg>
    );
}

function IconEdit(props: any) {
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
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
    );
}

export default function Todo() {
    const ctx = useUserContext()!;
    const [items, setItems] = createSignal(ctx.data().tasks);

    function setNewTasks(newTasks: any) {
        newTasks = newTasks.map((task: Task, i: number) => {
            return {
                ...task,
                id: i,
            };
        });
        ctx.setData({
            ...ctx.data(),
            tasks: newTasks,
        });
        setItems(newTasks);
    }

    function handleDndEvent(e: CustomEvent<{ items: Task[] }>) {
        const { items: newTasks } = e.detail;
        setNewTasks(newTasks);
    }

    return (
        <div class="flex flex-col w-full">
            <div class="flex flex-row justify-between items-center mb-4">
                <div>
                    <button
                        class={twMerge(
                            button.primary,
                            (items().length === 0 &&
                                "opacity-50 cursor-not-allowed") ||
                                ""
                        )}
                        disabled={items().length <= 1}
                        onClick={() => {
                            let newTasks = items().sort((a, b) => {
                                return (
                                    getTaskTime(a, ctx.timerSettings()) -
                                    getTaskTime(b, ctx.timerSettings())
                                );
                            });
                            setNewTasks(newTasks);
                        }}
                    >
                        Sort by Time
                    </button>
                </div>
                <div class="flex flex-row gap-1">
                    <button
                        class={twMerge(
                            button.primary,
                            "items-center flex gap-1"
                        )}
                    >
                        <IconPlus class="w-4 h-4 inline-block" />
                    </button>
                    <button
                        // class={button.red}
                        class={twMerge(
                            button.red,
                            (items().length === 0 &&
                                "opacity-50 cursor-not-allowed") ||
                                ""
                        )}
                        disabled={items().length === 0}
                        onClick={() => {
                            setNewTasks([]);
                        }}
                    >
                        <IconTrash class="w-4 h-4 inline-block" />
                    </button>
                </div>
            </div>
            <div class="flex flex-col border-gray-300 dark:border-gray-700 border rounded-lg p-5 mb-2">
                <Show
                    when={items().length > 0}
                    fallback={
                        <div class="text-center text-gray-500 dark:text-gray-400">
                            You have no tasks.
                        </div>
                    }
                >
                    <div
                        class="flex flex-col gap-2"
                        // @ts-expect-error Typescript doesn't support d-irectives
                        use:dndzone={{
                            items,
                            dropTargetStyle: "",
                            dropTargetClasses: [],
                        }}
                        on:consider={handleDndEvent}
                        on:finalize={handleDndEvent}
                    >
                        <For each={items()}>
                            {(task) => (
                                <div class="flex flex-row justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-5 py-2.5 cursor-move">
                                    <div class="flex flex-col">
                                        <div class="text-gray-900 dark:text-white font-medium">
                                            {task.title}
                                        </div>
                                        <div class="text-gray-500 dark:text-gray-400 text-sm">
                                            {task.project}
                                        </div>
                                    </div>
                                    <div class="flex flex-row gap-1">
                                        <button class={button.icon.primary}>
                                            <IconEdit class="w-4 h-4 inline-block" />
                                        </button>
                                        <button
                                            class={button.icon.primary}
                                            onClick={() => {
                                                setNewTasks(
                                                    items().filter(
                                                        (t) => t !== task
                                                    )
                                                );
                                            }}
                                        >
                                            <IconTrash class="w-4 h-4 inline-block" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </For>
                    </div>
                </Show>
            </div>
        </div>
    );
}
