import {
    dndzone,
    overrideItemIdKeyNameBeforeInitialisingDndZones,
} from "solid-dnd-directive";
import { For, Show, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useUserContext } from "~/routes";
import { button } from "~/styles";
import type { Task } from "~/types";
import { IconEdit, IconPlus, IconTrash } from "./Icons";
overrideItemIdKeyNameBeforeInitialisingDndZones("order");

/**
 * Typescript removes dndzone because it thinks that it is not being used.
 * This trick prevents that from happening.
 * https://github.com/solidjs/solid/issues/1005#issuecomment-1134778606
 */
0 && dndzone;

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
            <div class="flex flex-row justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                <div>
                    <div class="text-2xl font-bold dark:text-white">Tasks</div>
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
            <div class="flex flex-col rounded-lg mb-2">
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
                        // @ts-expect-error Typescript doesn't support directives
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
