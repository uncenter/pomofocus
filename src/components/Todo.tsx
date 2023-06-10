import { ToggleButton } from "@kobalte/core";
import {
    dndzone,
    overrideItemIdKeyNameBeforeInitialisingDndZones,
} from "solid-dnd-directive";
import { For, Show, createSignal } from "solid-js";
import { twMerge } from "tailwind-merge";
import { useUserContext } from "~/routes";
import { button } from "~/styles";
import type { Task } from "~/types";
import {
    IconCheckCircle,
    IconMoreVertical,
    IconPlus,
    IconSettings,
    IconTrash,
} from "./Icons";
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

    function TaskItem(props: { task: Task }) {
        return (
            <div
                class="flex flex-row justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-5 py-2.5"
                draggable
            >
                <div class="flex flex-row items-center gap-4">
                    <ToggleButton.Root
                        pressed={props.task.completed}
                        onChange={(state) => {
                            const newTasks = [...ctx.data().tasks];
                            newTasks[props.task.order].completed = state;
                            setNewTasks(newTasks);
                        }}
                    >
                        {(state) => (
                            <Show
                                when={state.pressed()}
                                fallback={
                                    <IconCheckCircle class="w-8 h-8 inline-block p-1 rounded-full bg-blue-100 text-white" />
                                }
                            >
                                <IconCheckCircle class="w-8 h-8 inline-block p-1 rounded-full bg-blue-500 text-white" />
                            </Show>
                        )}
                    </ToggleButton.Root>
                    <div class="flex flex-col">
                        <div class="text-gray-900 dark:text-white font-medium">
                            {props.task.title}
                        </div>
                        <div class="text-gray-500 dark:text-gray-400 text-sm">
                            {props.task.project}
                        </div>
                    </div>
                </div>
                <div class="flex flex-row">
                    <button class={button.icon.primary}>
                        <IconMoreVertical class="w-4 h-4 inline-block" />
                    </button>
                </div>
            </div>
        );
    }

    function NewTaskItem() {
        return (
            <div class="flex flex-row items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-5 py-2.5 border-dashed h-16 cursor-pointer justify-center gap-2">
                <IconPlus class="w-4 h-4 inline-block" />
                <div class="text-gray-500 dark:text-gray-400">Add Task</div>
            </div>
        );
    }

    return (
        <div class="flex flex-col w-full">
            <div class="flex flex-row justify-between items-center mb-4 border-b border-gray-300 dark:border-gray-700 pb-2">
                <div>
                    <div class="text-2xl font-bold dark:text-white">Tasks</div>
                </div>
                <div class="flex flex-row">
                    <button
                        class={twMerge(
                            button.icon.primary,
                            "items-center flex"
                        )}
                    >
                        <IconSettings class="w-4 h-4 inline-block" />
                    </button>
                </div>
            </div>
            <div class="flex flex-col rounded-lg mb-2 gap-2">
                <Show
                    when={items().length > 0}
                    fallback={
                        <div class="flex flex-col gap-2">
                            <NewTaskItem />
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
                            {(task) => <TaskItem task={task} />}
                        </For>
                    </div>
                    <div class="flex flex-col gap-2">
                        <NewTaskItem />
                    </div>
                </Show>
            </div>
        </div>
    );
}
