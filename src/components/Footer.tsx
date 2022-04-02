import DarkModeToggler from "./DarkModeToggler"

export default function Footer() {
    return (
        <footer className="flex items-center justify-between">
            <DarkModeToggler />
            <div className="text-slate-700 dark:text-slate-400 text-center justify-center">
                made with <span className="text-red-600">&#10084;</span> by{" "}
                <a href="https://web.facebook.com/yande.cc/" target="_blank" rel="noreferrer" className="font-bold">
                    Yande Arta
                </a>
                <br/>
                Modified & Translated by{" "}
                <a href="https://github.com/BlueTree242" target="_blank" rel="noreferrer" className="font-bold">
                    BlueTree242
                </a>
            </div>
        </footer>
    )
}
