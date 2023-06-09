import { button } from "~/styles";

export default function Header() {
    return (
        <div class="flex flex-row justify-between">
            <div class="text-4xl font-extrabold dark:text-white">Pomodoro</div>
            <div class="flex flex-col sm:flex-row">
                <button class={button.primary}>Settings</button>
            </div>
        </div>
    );
}
