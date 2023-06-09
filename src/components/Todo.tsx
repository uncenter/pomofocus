import { For, Show } from "solid-js";
import { useUserContext } from "~/routes";

export default function Todo() {
    const ctx = useUserContext()!;

    return (
        <div class="flex flex-col">
            <Show
                when={ctx.data().tasks.length > 0}
                fallback={
                    <div class="text-center text-gray-500 dark:text-gray-400">
                        You have no tasks.
                    </div>
                }
            >
                <For each={ctx.data().tasks}>
                    {(task) => (
                        <div class="flex flex-row justify-between items-center bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-5 py-2.5 mb-2">
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
                                        ctx.setData({
                                            ...ctx.data(),
                                            tasks: ctx
                                                .data()
                                                .tasks.filter(
                                                    (t) => t !== task
                                                ),
                                        });
                                    }}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </For>
            </Show>
        </div>
    );
}
