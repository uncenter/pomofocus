import { twMerge } from "tailwind-merge";

const button = {
    icon: { primary: "", red: "" },
    primary:
        "text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 flex items-center",
};

button.icon.primary = twMerge(button.primary, "p-3");

const tabs = {
    active: "text-white bg-blue-600",
    inactive: "hover:text-gray-900 dark:hover:text-white",
    default: "inline-block p-2 rounded-lg",
};

export { button, tabs };
