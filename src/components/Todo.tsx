import { For, Show, JSX, createEffect, createSignal } from "solid-js";
import { useUserContext } from "~/routes";
import { dndzone } from "solid-dnd-directive";
import type { Task } from "~/types";
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
        <div class="flex flex-col">
            <Show
                when={items().length > 0}
                fallback={
                    <div class="text-center text-gray-500 dark:text-gray-400">
                        You have no tasks.
                    </div>
                }
            >
                <div
                    class="flex flex-col border-gray-300 dark:border-gray-700 border rounded-lg p-5 mb-2 gap-2"
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
                                <div class="flex flex-row">
                                    <button class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                        Edit
                                    </button>
                                    <button
                                        class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                                        onClick={() => {
                                            setNewTasks(
                                                items().filter(
                                                    (t) => t !== task
                                                )
                                            );
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </For>
                </div>
            </Show>
        </div>
    );
}
