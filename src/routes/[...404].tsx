import { A } from "solid-start";

export default function NotFound() {
    return (
        <main class="text-center flex flex-col justify-center py-12">
            <p class="text-center text-gray-500 dark:text-gray-400">
                The page you are looking for does not exist.
            </p>
            <A href="/" class="mt-3 text-center text-blue-500">
                Go back to the homepage
            </A>
        </main>
    );
}
