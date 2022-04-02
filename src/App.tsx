import {useState} from "react"
import copy from "copy-to-clipboard"
import ReactTooltip from "react-tooltip"

import Footer from "./components/Footer"
import PasswordStrengthMeter from "./components/PasswordStrengthMeter"

export default function App() {
    const [passLength, setPassLength] = useLocalStorage<number | string>("pass-length", 18)
    const [includeUppercase, setIncludeUppercase] = useLocalStorage("include-uppercase", true)
    const [includeLowercase, setIncludeLowercase] = useLocalStorage("include-lowercase", true)
    const [excludeDuplicate, setExcludeDuplicate] = useLocalStorage("exclude-duplicate", false)
    const [includeNumber, setIncludeNumber] = useLocalStorage("include-number", true)
    const [includeSymbol, setIncludeSymbol] = useLocalStorage("include-symbol", false)

    // Jalankan fungsi generatePassword() hanya sekali
    const [password, setPassword] = useState(() => generatePassword())
    const [showAlert, setShowAlert] = useState(false)
    const [alertTimeout, setAlertTimeout] = useState<number>()

    function generatePassword(
        characterAmount = passLength,
        includeUpper = includeUppercase,
        includeLower = includeLowercase,
        includeNumbers = includeNumber,
        includeSymbols = includeSymbol,
        excludeDuplicates = excludeDuplicate
    ) {
        const UPPERCASE_CHAR = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        const LOWERCASE_CHAR = "abcdefghijklmnopqrstuvwxyz"
        const NUMBER_CHAR = "1234567890"
        const SYMBOL_CHAR = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

        let combinedCharacters = ""

        if (includeLower) combinedCharacters += LOWERCASE_CHAR
        if (includeUpper) combinedCharacters += UPPERCASE_CHAR
        if (includeNumbers) combinedCharacters += NUMBER_CHAR
        if (includeSymbols) combinedCharacters += SYMBOL_CHAR

        let password = ""
        for (let i = 0; i < characterAmount; i++) {
            const char = combinedCharacters.charAt(Math.floor(Math.random() * combinedCharacters.length));
            if (excludeDuplicates) combinedCharacters = combinedCharacters.replace(char, "")
            password += char
        }

        return password
    }

    function handleCopy(password: string) {
        copy(password)
        setShowAlert(true)

        // Bersihkan semua timeout sebelum memulai timeout yang baru
        clearTimeout(alertTimeout)
        setAlertTimeout(window.setTimeout(() => setShowAlert(false), 2500))
    }

    function onLengthChange(event: any) {
        if (isNaN(Number(event.target.value)) || parseInt(event.target.value) <= 0 || parseInt(event.target.value) > 50) {
            event.cancel()
            return;
        }
        setPassLength(event.target.value === "" ? "" : parseInt(event.target.value))
    }

    return (
        <div className="container relative my-5 px-3 dark:selection:bg-slate-100 dark:selection:text-slate-800 sm:px-0">
            {/* Alert */}
            <div
                className="absolute -top-14 flex h-10 w-60 items-center justify-center rounded-lg bg-green-100 text-green-700 shadow-md transition-opacity duration-150 dark:bg-green-200"
                style={{ opacity: showAlert ? 1 : 0 }}
            >
                Successfully copied password!
            </div>

            <div className="mb-8 max-w-md rounded-lg bg-white py-10 px-5 text-center shadow-lg transition-all dark:bg-slate-800 sm:px-10">
                <label htmlFor="password">
                    <h1 className="mb-5 text-2xl font-bold text-slate-700 transition-all dark:text-white sm:text-3xl">Password Generator</h1>
                </label>

                <div className="mb-5 flex h-10 items-center transition-all sm:h-14">
                    <input
                        type="text"
                        value={password}
                        className="h-full w-full rounded-l-lg border p-3 dark:border-slate-900 dark:bg-slate-900 dark:text-slate-100"
                        id="password"
                        disabled
                    />
                    <button
                        className="group flex h-full items-center rounded-r-lg bg-slate-200 dark:bg-slate-900 "
                        onClick={() => handleCopy(password)}
                        data-tip="Copy"
                        aria-label="Copy"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="45"
                            height="20"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            className="text-slate-700 transition-all group-hover:scale-105 group-active:scale-95 dark:text-slate-300"
                        >
                            <path d="M13 0H6a2 2 0 0 0-2 2 2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2 2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 13V4a2 2 0 0 0-2-2H5a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1zM3 4a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4z" />
                        </svg>
                    </button>
                    <ReactTooltip place="right" effect="solid" className="select-none " />
                </div>

                {/* Password Strength Meter */}
                <PasswordStrengthMeter password={password} />

                <div className="grid grid-cols-2 gap-2 dark:text-slate-100">
                    <label htmlFor="password-length" className="text-left text-lg font-semibold">
                        Password Length
                    </label>
                    <div className="flex items-center justify-start">
                        <input
                            type="range"
                            id="password-length"
                            className="mr-2 h-2 w-4/6 appearance-none rounded bg-slate-200 dark:bg-slate-900"
                            min={1}
                            max={50}
                            value={passLength}
                            onChange={(event) => setPassLength(parseInt(event.target.value))}
                        />
                        <input
                            type="number"
                            min={1}
                            max={50}
                            value={passLength}
                            onChange={(event) => onLengthChange(event)}
                            className="w-2/6 rounded border dark:border-slate-900 dark:bg-slate-900"
                            aria-labelledby="password-length"
                        />
                    </div>

                    <label htmlFor="include-uppercase" className="text-left text-lg font-semibold">
                        Small letters
                    </label>
                    <div className="flex justify-start">
                        <input
                            type="checkbox"
                            id="include-lowercase"
                            className="h-5 w-5"
                            defaultChecked={includeLowercase}
                            onChange={() => setIncludeLowercase((prevIncludeLowercase) => !prevIncludeLowercase)}
                        />
                    </div>

                    <label htmlFor="include-uppercase" className="text-left text-lg font-semibold">
                        Capital letters
                    </label>
                    <div className="flex justify-start">
                        <input
                            type="checkbox"
                            id="include-uppercase"
                            className="h-5 w-5"
                            defaultChecked={includeUppercase}
                            onChange={() => setIncludeUppercase((prevIncludeUppercase) => !prevIncludeUppercase)}
                        />
                    </div>

                    <label htmlFor="include-number" className="text-left text-lg font-semibold">
                        Number
                    </label>
                    <div className="flex justify-start">
                        <input
                            type="checkbox"
                            id="include-number"
                            className="h-5 w-5"
                            defaultChecked={includeNumber}
                            onChange={() => setIncludeNumber((prevIncludeNumber) => !prevIncludeNumber)}
                        />
                    </div>

                    <label htmlFor="include-symbol" className="text-left text-lg font-semibold">
                        Symbol
                    </label>

                    <div className="flex justify-start">
                        <input
                            type="checkbox"
                            id="include-symbol"
                            className="h-5 w-5"
                            defaultChecked={includeSymbol}
                            onChange={() => setIncludeSymbol((prevIncludeNumber) => !prevIncludeNumber)}
                        />
                    </div>

                    <label htmlFor="exclude-duplications" className="text-left text-lg font-semibold">
                        Exclude Duplications
                    </label>
                    <div className="flex justify-start">
                        <input
                            type="checkbox"
                            id="exclude-duplications"
                            className="h-5 w-5"
                            defaultChecked={excludeDuplicate}
                            onChange={() => setExcludeDuplicate((e) => !e)}
                        />
                    </div>
                </div>
                <button
                    className="mt-3 w-full rounded bg-gradient-to-r from-emerald-400 to-teal-500 p-3 font-bold text-slate-100 shadow transition-all hover:scale-105 active:scale-100 dark:bg-slate-900 dark:text-slate-100 dark:shadow-none"
                    onClick={() => setPassword(generatePassword(passLength, includeUppercase, includeNumber, includeSymbol))}
                >
                    Generate
                </button>
            </div>
            <Footer />
        </div>
    )
}
// Hook, copied from https://usehooks.com/useLocalStorage/
function useLocalStorage<T>(key: string, initialValue: T) {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === "undefined") {
            return initialValue;
        }
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });
    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T | ((val: T) => T)) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            if (typeof window !== "undefined") {
                window.localStorage.setItem(key, JSON.stringify(valueToStore));
            }
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error);
        }
    };
    return [storedValue, setValue] as const;
}